export default class N_Slider {
  constructor(object, settings) {
    this.SliderObject = object;
    this.SwitchBtns = {
      btnLeft: settings.switchBtns.btnLeft,
      btnRight: settings.switchBtns.btnRight,
    };
    this.BreakPoints = settings.breakpoints;

    this.SlidesOffset;

    this.CountOfShowSlides;

    this.SlidesTransition =
      parseFloat(
        window
          .getComputedStyle(
            this.SliderObject.querySelector(".slider__inner"),
            null
          )
          .getPropertyValue("transition")
          .match(/[0-9]+\.[0-9]+/)
      ) * 1000;

    // Устанавливаем размер слайдов при resize-е и при загрузке страницы
    this.main();

    // Скролл при нажатии на кнопки
    this.isEvent = false;

    // Переменная проверяющая, был ли скролл после загрузки страницы
    this.isScrollable = false;

    this.SwitchBtns.btnLeft.onclick = () => {
      if (this.isEvent) return;
      this.SlidesOffset++;
      console.log(this.SlidesOffset);
      this.ScrollSlides();
      this.setActiveClasses();
      this.SliderObject.querySelector(
        ".slides > .slider__inner"
      ).ontransitionend = () => {
        this.SwitchFromCloneSlides();
        this.isEvent = false
      };
    };
    this.SwitchBtns.btnRight.onclick = () => {
      if (this.isEvent) return;
      this.SlidesOffset--;
      this.ScrollSlides();
      this.setActiveClasses();
      this.SliderObject.querySelector(
        ".slides > .slider__inner"
      ).ontransitionend = () => {
        this.SwitchFromCloneSlides();
        this.isEvent = false
      };
    };

    // Свайп слайдов
    this.SliderObject.querySelector(".slides").addEventListener(
      "touchstart",
      this.SwipeSlidesStart.bind(this)
    );
    this.SliderObject.querySelector(".slides").addEventListener(
      "touchmove",
      this.SwipeSlides.bind(this)
    );
    this.SliderObject.querySelector(".slides").addEventListener(
      "touchend",
      () => {
        this.SwipeSlidesEnd();
        this.setActiveClasses();
        this.SliderObject.querySelector(
          ".slides > .slider__inner"
        ).ontransitionend = () => {
          this.SwitchFromCloneSlides();
          this.isEvent = false;
        };
      }
    );
  }

  main() {
    window.addEventListener("load", () => {
      this.setSlideSize();
      this.cloneSlides();
      this.setActiveClasses();
      this.SwitchFromCloneSlides();
    });
    window.addEventListener("resize", () => {
      this.setSlideSize();
      this.cloneSlides();
      this.setActiveClasses();
      this.SwitchFromCloneSlides();
    });
  }

  setSlideSize() {
    let SliderBreakPointsKeys = [];

    for (let i = 0; i < Object.keys(this.BreakPoints).length; i++) {
      if (Object.keys(this.BreakPoints)[i].match(/\d+/)) {
        SliderBreakPointsKeys.push(parseInt(Object.keys(this.BreakPoints)[i]));
      }
    }
    SliderBreakPointsKeys = SliderBreakPointsKeys.reverse();

    for (let i = 0; i < SliderBreakPointsKeys.length; i++) {
      if (SliderBreakPointsKeys[i] >= window.innerWidth) {
        this.CountOfShowSlides =
          this.BreakPoints[SliderBreakPointsKeys[i]].showSlidesCount;
      }
    }

    if (this.CountOfShowSlides == undefined) {
      this.CountOfShowSlides = this.BreakPoints.default.showSlidesCount;
    }

    let SliderScrollWidth =
      this.SliderObject.querySelector(".slider__inner").scrollWidth;
    this.SlidesSideMargins = parseInt(
      window
        .getComputedStyle(this.SliderObject.querySelectorAll(".slide")[0], null)
        .getPropertyValue("margin")
        .split(" ")[1]
        .match(/\d+/)
    );

    this.SlideWidth =
      this.SliderObject.querySelector(".slider__inner").offsetWidth /
      this.CountOfShowSlides;

    this.SliderObject.querySelectorAll(".slide").forEach((slide) => {
      slide.style.cssText += `min-width: ${
        this.SlideWidth - this.SlidesSideMargins * 2
      }px`;
    });

    // Выбираем все слайды
    this.AllSlides = this.SliderObject.querySelectorAll(
      ".slides > .slider__inner .slide:not(.clone-slide)"
    );

    // Выбираем все слайды которые были склонированны
    this.CloneSlides = this.SliderObject.querySelectorAll(
      ".slides > .slider__inner .clone-slide"
    );

    if (this.SlidesOffset == undefined) {
      this.SlidesOffset = -this.CountOfShowSlides;

      this.SliderObject.querySelector(
        ".slider__inner"
      ).style.cssText = `transition: 0s;transform: translate(${
        this.SlideWidth * this.SlidesOffset
      }px)`;

      setTimeout(() => {
        this.SliderObject.querySelector(
          ".slider__inner"
        ).style.cssText = `transform: translate(${
          this.SlideWidth * this.SlidesOffset
        }px)`;
      });
      console.log(this.SlidesOffset);
    } else {
      if (!this.isScrollable) {
        this.SlidesOffset = -this.CountOfShowSlides;
      }

      this.SliderObject.querySelector(
        ".slider__inner"
      ).style.cssText = `transition: 0s;transform: translate(${
        this.SlideWidth * this.SlidesOffset
      }px)`;

      setTimeout(() => {
        this.SliderObject.querySelector(
          ".slider__inner"
        ).style.cssText = `transform: translate(${
          this.SlideWidth * this.SlidesOffset
        }px)`;
      });
    }
  }

  cloneSlides() {
    this.CloneSlides.forEach((elem) => {
      elem.remove();
    });

    // Отделяем кол-во нужных первых слайдов
    let firstSlides = Array.from(this.AllSlides).slice(
      0,
      this.CountOfShowSlides
    );

    // Отделяем кол-во нужных последних слайдов
    let lastSlides = Array.from(this.AllSlides).slice(
      this.AllSlides.length - this.CountOfShowSlides
    );

    lastSlides.reverse().forEach((elem) => {
      let cloneSlide = elem.cloneNode(true);
      cloneSlide.classList.add("clone-slide");

      this.SliderObject.querySelector(".slider__inner").prepend(cloneSlide);
    });

    firstSlides.forEach((elem) => {
      let cloneSlide = elem.cloneNode(true);
      cloneSlide.classList.add("clone-slide");

      this.SliderObject.querySelector(".slider__inner").append(cloneSlide);
    });
  }

  SwitchFromCloneSlides() {
    let ActiveSlides = this.SliderObject.querySelectorAll(
      ".slides > .slider__inner .slide--active"
    );

    let isEvent = false;

    ActiveSlides.forEach((elem) => {
      if (elem.classList.contains("clone-slide")) {
        isEvent = true;
      } else {
        isEvent = false;
      }
    });

    if (isEvent) {
      this.isEvent = true;

      if (this.SlidesOffset == 0) {
        this.SlidesOffset = -(
          this.SliderObject.querySelectorAll(".slides > .slider__inner .slide")
            .length -
          this.CountOfShowSlides * 2
        );

        this.SliderObject.querySelector(
          ".slider__inner"
        ).style.cssText = `transition: 0s;transform: translate(${
          this.SlideWidth * this.SlidesOffset
        }px)`;

        setTimeout(() => {
          this.SliderObject.querySelector(
            ".slider__inner"
          ).style.cssText = `transform: translate(${
            this.SlideWidth * this.SlidesOffset
          }px)`;
        });
      } else if (
        (Math.abs(this.SlidesOffset) == 
        this.SliderObject.querySelectorAll(".slides > .slider__inner .slide")
          .length - this.CountOfShowSlides)
      ) {
        this.SlidesOffset = -this.CountOfShowSlides;

        this.SliderObject.querySelector(
          ".slider__inner"
        ).style.cssText = `transition: 0s;transform: translate(${
          this.SlideWidth * this.SlidesOffset
        }px)`;

        setTimeout(() => {
          this.SliderObject.querySelector(
            ".slider__inner"
          ).style.cssText = `transform: translate(${
            this.SlideWidth * this.SlidesOffset
          }px)`;
        });
      }

      this.SliderObject.querySelector(".slider__inner").ontransitionend =
        () => {
          this.isEvent = false;
        };
    }
  }

  setActiveClasses() {
    // Выбираем все которые не были клонированны
    const Slides = this.SliderObject.querySelectorAll(
      ".slides > .slider__inner .slide"
    );

    // Удаляем статус "active" у всех слайдов
    Slides.forEach((elem) => {
      elem.classList.remove("slide--active");
    });

    // Добавляем первому количеству слайдов статус "active"
    for (
      let i = Math.abs(this.SlidesOffset);
      i < Math.abs(this.SlidesOffset) + this.CountOfShowSlides;
      i++
    ) {
      Slides[i].classList.add("slide--active");
    }
  }

  ScrollSlides() {
    this.isScrollable = true;
    this.isEvent = true;

    this.SliderObject.querySelector(
      ".slider__inner"
    ).style.cssText = `transform: translate(${
      this.SlideWidth * this.SlidesOffset
    }px)`;

    this.SliderObject.querySelector(".slider__inner").ontransitionend = () => {
      this.isEvent = false;
    };
  }

  SwipeSlidesStart(event) {
    this.TouchStart = event.touches[0];

    this.SlidesTransformX = parseFloat(
      window
        .getComputedStyle(
          this.SliderObject.querySelector(".slider__inner"),
          null
        )
        .getPropertyValue("transform")
        .split(",")[4]
    );

    this.SliderObject.querySelector(
      ".slider__inner"
    ).style.cssText += `transition: 0s;`;

    this.TouchStartX = this.TouchStart.clientX;
  }

  SwipeSlides(event) {
    this.TouchMove = event.touches[0];

    this.TouchMoveX = this.TouchStartX - this.TouchMove.clientX;

    if (Math.abs(this.TouchMoveX) < Math.abs(this.SlideWidth)) {
      this.SliderObject.querySelector(
        ".slider__inner"
      ).style.cssText += `transform: translateX(${
        this.SlidesTransformX - this.TouchMoveX
      }px)`;
    }
  }

  SwipeSlidesEnd() {
    this.isScrollable = true;

    if (Math.abs(this.TouchMoveX) > this.SlideWidth / 4) {
      if (this.TouchMoveX < 0) {
        this.SlidesOffset++;
      } else {
        this.SlidesOffset--;
      }
    }

    this.SliderObject.querySelector(
      ".slider__inner"
    ).style.cssText = `transform: translateX(${
      this.SlideWidth * this.SlidesOffset
    }px)`;
  }
}
