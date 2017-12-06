'use strict';
(function(){
  if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Положим O равным результату вызова ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Положим lenValue равным результату вызова внутреннего метода Get объекта O с аргументом "length".
    // 3. Положим len равным ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. Если IsCallable(callback) равен false, выкинем исключение TypeError.
    // Смотрите: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }

    // 5. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Положим k равным 0
    k = 0;

    // 7. Пока k < len, будем повторять
    while (k < len) {

      var kValue;

      // a. Положим Pk равным ToString(k).
      //   Это неявное преобразование для левостороннего операнда в операторе in
      // b. Положим kPresent равным результату вызова внутреннего метода HasProperty объекта O с аргументом Pk.
      //   Этот шаг может быть объединён с шагом c
      // c. Если kPresent равен true, то
      if (k in O) {

        // i. Положим kValue равным результату вызова внутреннего метода Get объекта O с аргументом Pk.
        kValue = O[k];

        // ii. Вызовем внутренний метод Call функции callback с объектом T в качестве значения this и
        // списком аргументов, содержащим kValue, k и O.
        callback.call(T, kValue, k, O);
      }
      // d. Увеличим k на 1.
      k++;
    }
    // 8. Вернём undefined.
  };
}
})()
;(function () {
  function toArrayByClassName(nodes) {
    return [].slice.call(document.getElementsByClassName(nodes));
  }
  var doc = document,
      manu = doc.getElementById('menu'),
      expanded = false;

  function Slider() {}

  Slider.prototype.invoke = function (sliderId, controlsCss) {
    var inputs = toArrayByClassName(controlsCss);
    var slider = document.getElementById(sliderId);

    inputs.forEach(function (el) {
      el.addEventListener('click', function (e) {
        var index = e.target.getAttribute('data-index');

        slider.style.left = -100 * index + '%';
      }, false);
    });
  };

  var firstSlider = new Slider();
  var secondSlider = new Slider();

  firstSlider.invoke('slider-1', 'inputs-1');
  secondSlider.invoke('slider-2', 'inputs-2');
  /*
  function SliderOpacity(prev_id, next_id, slides_css) {
    this.prev = document.getElementById(prev_id);
    this.next = document.getElementById(next_id);
    this.slides = toArrayByClassName(slides_css);
    }
  SliderOpacity.prototype.init = function() {
    var currentIndex = 0,
      slideIndex = 1,
      slideClick;
    var wrapper = n => slideClick = () => slideRender(slideIndex += n);
    this.prev.addEventListener('click', wrapper(-1));
    this.next.addEventListener('click', wrapper(1));
    var slides = this.slides;
      function slideRender(n) {
      var i;
        n > slides.length
        ? slideIndex = 1
        : false;
      n < 1
        ? slideIndex = slides.length
        : false;
        slides.forEach(function(element, index) {
        element.style.display = "none";
        index == slideIndex - 1
          ? element.style.opacity = "0"
          : false;
      });
      slides[slideIndex - 1].style.display = "block";
      setTimeout(function() {
        slides[slideIndex - 1].style.opacity = "1";
      }, 0)
      }
    slideRender(slideIndex);
  }
  */

  function InfinitySlider(slider_id, slides_class, buttonPrev, buttonNext) {
    this.slider = document.getElementById(slider_id);
    this.slides = [].slice.call(this.slider.getElementsByClassName(slides_class));
    this.lastSlide = this.slides.length - 1;
    this.prevButton = document.getElementById(buttonPrev);
    this.nextButton = document.getElementById(buttonNext);
    this.currentSlide = 1;
    this.left = [0, '20%', '40%', '60%', '80%'];
    this.clicked = false;
  }

  InfinitySlider.prototype.transitionEnd = function () {

    var t;
    var el = this.slides[0];
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  };

  InfinitySlider.prototype.changeAttributes = function (increment) {
    var _this2 = this;

    this.slides.forEach(function (element) {
      var attr = parseInt(element.getAttribute('data-index'));
      attr += increment;
      if (attr > _this2.lastSlide) {
        attr = 0;
      } else if (attr < 0) {
        attr = _this2.lastSlide;
      }
      element.setAttribute('data-index', attr);
    });
  };
  InfinitySlider.prototype.moveSlide = function (increment) {
    var _this3 = this;

    var animatedSlide;
    var direction = increment > 0 ? 0 : this.lastSlide;
    console.log('increment',increment,'lastSlide',this.lastSlide,direction)
    this.slides.forEach(function (el) {});
    this.slides.forEach(function(el, ind) {
      var dataIndex = parseInt(el.getAttribute('data-index'));
      el.style.left = _this3.left[dataIndex];
      if (dataIndex == direction) {
        animatedSlide = el;

       el.style.zIndex = '-1';
      //  el.style.transition='none';

     el.style.opacity = '0';

      }
      if (dataIndex !== direction) {
          el.style.zIndex = '1';
          //el.style.transition='all 1s ease';

        el.style.opacity = '1';

      //  el.style.backgroundColor='transparent';
      }
    });

    return animatedSlide;
  };
  InfinitySlider.prototype.onTransitionEnd = function (animatedSlide) {

    var transitionEvent = this.transitionEnd();
    var app = this;
    function transitionCallback() {
      //console.log('Transition complete!  This is the callback, no library needed!');
      animatedSlide.removeEventListener(transitionEvent, transitionCallback);
      app.clicked = false;
    }
    transitionEvent && animatedSlide.addEventListener(transitionEvent, transitionCallback);
  };
  InfinitySlider.prototype.checkSlideAndRun = function (e) {
    var _this4 = this;

    var increment = parseInt(e.target.getAttribute('data-inc'));

    this.currentSlide = function (increment, currentSlide) {
      currentSlide > _this4.lastSlide ? currentSlide = 0 : false;
      currentSlide < 0 ? currentSlide = _this4.lastSlide : false;
      return currentSlide;
    }(increment, this.currentSlide + increment);

    this.changeAttributes(increment);
    var animatedSlide = this.moveSlide(increment);

    this.onTransitionEnd(animatedSlide);
  };
  InfinitySlider.prototype.move = function (e) {
    !this.clicked ? (this.checkSlideAndRun(e), this.clicked = true) : false;
  };

  InfinitySlider.prototype.init = function () {
    this.nextButton.addEventListener('click', this.move.bind(this));
    this.prevButton.addEventListener('click', this.move.bind(this));
  };
  var iSlider = new InfinitySlider('slider-3', 'slider__slide', 'prev', 'next');
  iSlider.init();

  var iSlider2 = new InfinitySlider('slider-4', 'slider__slide', 'prev2', 'next2');
  iSlider2.init();

  function Hamburger(callback) {
    var hamburgerId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'hamburger';

    this.hamburger = document.getElementById(hamburgerId);
    this.state = 'collapsed';
    this.dependencies = callback;
    this.animation = {
      'collapsed': function collapsed() {
        this.hamburger.classList.remove('closed');
      },
      'expanded': function expanded() {
        this.hamburger.classList.add('closed');
      }
    };
  }

  Hamburger.prototype.reset = function () {
    this.state = 'collapsed';
    this.hamburger.className = 'nav__hamburger';
  };

  Hamburger.prototype.changeState = function (forceState) {
    this.state == 'collapsed' ? this.state = 'expanded' : this.state = 'collapsed';
    this.animation[this.state].call(this);
    this.dependencies.apply(this, [this.state]);
    //return this.expanded;
  };

  Hamburger.prototype.init = function (conditions) {
    var _this = this;
    function hamburgerClick(e) {
      _this.changeState();
    }
    this.hamburger.removeEventListener('click', hamburgerClick);
    this.hamburger.addEventListener('click', hamburgerClick);
  };

  function Navigation(id) {
    this.nav = document.getElementById(id);
    this.animation = {
      'collapsed': function collapsed() {
        this.nav.classList.remove('expanded');
        this.nav.classList.add('collapsed');
      },
      'expanded': function expanded() {
        this.nav.classList.remove('blocked', 'collapsed');
        this.nav.classList.add('expanded');
      }
    };
  }
  var nav = new Navigation('nav');

  var hamburger = new Hamburger(function (state) {
    nav.animation[state].call(nav);
  });
  hamburger.init();

  window.addEventListener('resize', function dropdown(e) {

    if (window.innerWidth > 1024) {
      hamburger.reset();
      nav.nav.classList.remove('expanded');
      nav.nav.classList.add('collapsed', 'blocked');
    }
  });
})();
