export default function N_Slider(object, settings) {
  // Объект слайдера
  const SliderObject = object;
  const SliderInner = SliderObject.querySelector(".slider__inner");
  const SlidesList = SliderObject.querySelectorAll(".slide");
  // настройки по слайдеру
  // Кнопки
  const SwitchBtns = {
    btnLeft: settings.switchBtns.btnLeft,
    btnRight: settings.switchBtns.btnRight,
  };
  // Брекпоинты
  const BreakPoints = settings.breakpoints;
  // Анимация
  const SliderTransition = settings.transition;
  const SliderTransitionString = `transform ${SliderTransition.seconds}ms ${
    SliderTransition.timing ? SliderTransition.timing : ""
  }`;
  // Offset Слайдов
  const def = {
    sliderOffset: 0,
    showSlidesCount: function () {
      let SliderBreakPointsKeys = [];
      let showSlides;
      for (let i = 0; i < Object.keys(BreakPoints).length; i++) {
        if (Object.keys(BreakPoints)[i].match(/\d+/)) {
          SliderBreakPointsKeys.push(parseInt(Object.keys(BreakPoints)[i]));
        }
      }
      SliderBreakPointsKeys = SliderBreakPointsKeys.reverse();
      for (let i = 0; i < SliderBreakPointsKeys.length; i++) {
        if (SliderBreakPointsKeys[i] >= window.innerWidth) {
          showSlides = BreakPoints[SliderBreakPointsKeys[i]].showSlidesCount;
        }
      }
      if (showSlides == undefined) {
        showSlides = BreakPoints.default.showSlidesCount;
      }

      return showSlides;
    },
    sliderScrollWidth: SliderInner.scrollWidth,
    slideWidth: function () {
      return SliderInner.offsetWidth / this.showSlidesCount();
    },
    slideMargins: parseInt(
      window
        .getComputedStyle(SlidesList[0], null)
        .getPropertyValue("margin")
        .split(" ")[1]
        .match(/\d+/)
    ),
    isAnimated: false,
    isScrollable: false,
  };

  main();

  function main() {
    window.addEventListener("load", () => {
      setSlidesSettings();

      // Сролл слайдера при клике на кнопки
      SwitchBtns.btnLeft.onclick = () => {
        if (def.isAnimated) return;
        def.sliderOffset++;
        scrollSlides();
      };
      SwitchBtns.btnRight.onclick = () => {
        if (def.isAnimated) return;
        def.sliderOffset--;
        scrollSlides();
      };

      // Сролл слайдера при свайпе
      SliderInner.addEventListener("touchstart", sliderTouchStart, false);
      SliderInner.addEventListener("mousedown", sliderTouchStart, false);
    });
    window.addEventListener("resize", () => {
      setSlidesSettings();
    });
  }

  function setSlidesSettings() {
    SlidesList.forEach((slide) => {
      slide.style.minWidth = `${def.slideWidth() - def.slideMargins * 2}px`;
    });

    if (
      window
        .getComputedStyle(SliderInner, null)
        .getPropertyValue("transform") == "none"
    ) {
      def.sliderOffset = -def.showSlidesCount();
      SliderInner.style.transform = `translate3d(${
        def.slideWidth() * def.sliderOffset
      }px, 0px, 0px)`;
    } else {
      if (!def.isScrollable) {
        def.sliderOffset = -def.showSlidesCount();
      }
      SliderInner.style.transform = `translate3d(${
        def.slideWidth() * def.sliderOffset
      }px, 0px, 0px)`;
    }

    setActiveSlides();
    checkToChangeSlides();
    cloneSlides();
  }

  function scrollSlides() {
    def.isScrollable = true;
    def.isAnimated = true;

    SliderInner.style.transition = SliderTransitionString;
    SliderInner.style.transform = `translate3d(${
      def.slideWidth() * def.sliderOffset
    }px, 0px, 0px)`;

    SliderInner.addEventListener("transitionend", () => {
      SliderInner.style.transition = "";
      def.isAnimated = false;
      setActiveSlides();
      checkToChangeSlides();
    });
  }

  function cloneSlides() {
    let CloneSlides = SliderObject.querySelectorAll(
      ".slides > .slider__inner .clone-slide"
    );
    CloneSlides.forEach((elem) => {
      elem.remove();
    });
    // Отделяем кол-во нужных первых слайдов
    let firstSlides = Array.from(SlidesList).slice(0, def.showSlidesCount());
    // Отделяем кол-во нужных последних слайдов
    let lastSlides = Array.from(SlidesList).slice(
      SlidesList.length - def.showSlidesCount()
    );
    lastSlides.reverse().forEach((elem) => {
      let cloneSlide = elem.cloneNode(true);
      cloneSlide.classList.add("clone-slide");
      SliderInner.prepend(cloneSlide);
    });
    firstSlides.forEach((elem) => {
      let cloneSlide = elem.cloneNode(true);
      cloneSlide.classList.add("clone-slide");
      SliderInner.append(cloneSlide);
    });
  }

  function setActiveSlides() {
    // Выбираем все слайды
    const Slides = SliderInner.querySelectorAll(".slide");

    // Удаляем статус "active" у всех слайдов
    Slides.forEach((elem) => {
      elem.classList.remove("slide--active");
    });

    // Добавляем первому количеству слайдов статус "active"
    for (
      let i = Math.abs(def.sliderOffset);
      i < Math.abs(def.sliderOffset) + def.showSlidesCount();
      i++
    ) {
      Slides[i].classList.add("slide--active");
    }
  }

  function checkToChangeSlides() {
    let ActiveSlides = SliderInner.querySelectorAll(".slide--active");

    let isEvent = false;

    for (let i = 0; i < ActiveSlides.length; i++) {
      if (ActiveSlides[i].classList.contains("clone-slide")) {
        isEvent = true;
      } else {
        isEvent = false;
        return false;
      }
    }

    def.isAnimated = true;

    if (isEvent) {
      if (Math.abs(def.sliderOffset) == 0) {
        def.sliderOffset = -(
          SliderObject.querySelectorAll(".slides > .slider__inner .slide")
            .length -
          def.showSlidesCount() * 2
        );

        SliderInner.style.transition = "";
        SliderInner.style.transform = `translate3d(${
          def.slideWidth() * def.sliderOffset
        }px, 0px, 0px)`;
        def.isAnimated = false;
      } else if (
        Math.abs(def.sliderOffset) ==
        SliderObject.querySelectorAll(".slides > .slider__inner .slide")
          .length -
          def.showSlidesCount()
      ) {
        def.sliderOffset = -def.showSlidesCount();
        SliderInner.style.transition = "";
        SliderInner.style.transform = `translate3d(${
          def.slideWidth() * def.sliderOffset
        }px, 0px, 0px)`;
        def.isAnimated = false;
      }
      return true;
    }
    return false;
  }

  let sliderTouchStart = function (event) {
    if (def.isAnimated) return;

    def.swipeStartX =
      event.type == "touchstart" ? event.targetTouches[0].clientX : event.clientX;

    def.sliderTransformX = parseFloat(
      window
        .getComputedStyle(SliderObject.querySelector(".slider__inner"), null)
        .getPropertyValue("transform")
        .split(",")[4]
    );

    SliderInner.addEventListener("touchmove", sliderTouchMove, false);
    SliderInner.addEventListener("mousemove", sliderTouchMove, false);
    SliderInner.addEventListener("touchend", sliderTouchEnd, false);
    SliderInner.addEventListener("mouseup", sliderTouchEnd, false);
  };

  let sliderTouchMove = function (event) {
    def.swipeMoveX =
      event.type == "touchmove"
        ? parseFloat(
            (def.swipeStartX - event.targetTouches[0].clientX).toFixed(2)
          )
        : def.swipeStartX - event.clientX;

    if (Math.abs(def.swipeMoveX) < Math.abs(def.slideWidth())) {
      SliderInner.style.transform = `translate3d(${
        def.sliderTransformX - def.swipeMoveX
      }px, 0, 0)`;
    }

    def.isAnimated = true;
    event.preventDefault();
  };

  let sliderTouchEnd = function () {
    def.isScrollable = true;

    if (Math.abs(def.swipeMoveX - def.swipeStartX) < 40) return;

    if (Math.abs(def.swipeMoveX) > def.slideWidth() / 4) {
      if (def.swipeMoveX < 0) {
        def.sliderOffset++;
      } else {
        def.sliderOffset--;
      }
      SliderInner.style.transition = `${SliderTransitionString}`;
      SliderInner.style.transform = `translate3d(${
        def.slideWidth() * def.sliderOffset
      }px, 0, 0)`;
      SliderInner.setAttribute("data-is-animating", true);
    } else {
      SliderInner.style.transition = `${SliderTransitionString}`;
      SliderInner.style.transform = `translate3d(${
        def.slideWidth() * def.sliderOffset
      }px, 0, 0)`;
    }

    SliderObject.querySelector(".slider__inner").removeEventListener(
      "touchmove",
      sliderTouchMove,
      false
    );

    SliderObject.querySelector(".slider__inner").removeEventListener(
      "touchend",
      sliderTouchEnd,
      false
    );

    SliderObject.querySelector(".slider__inner").removeEventListener(
      "mousemove",
      sliderTouchMove,
      false
    );

    SliderObject.querySelector(".slider__inner").removeEventListener(
      "mouseup",
      sliderTouchEnd,
      false
    );

    setTimeout(() => {
      SliderInner.style.transition = "";

      delete def.swipeStartX;
      delete def.swipeMoveX;

      def.isAnimated = false;

      SliderInner.setAttribute("data-is-animating", false);

      setActiveSlides();
      checkToChangeSlides();
    }, SliderTransition.seconds);
  };
}
