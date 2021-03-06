import N_Slider from "./Slider.js";

const Slider = document.querySelector(".slider");
const SliderBtnToLeft = document.querySelector(
  ".slider > .slider__btn.slide-to-left"
);
const SliderBtnToRight = document.querySelector(
  ".slider > .slider__btn.slide-to-right"
);

N_Slider(Slider, {
  switchBtns: {
    btnLeft: SliderBtnToLeft,
    btnRight: SliderBtnToRight,
  },
  transition: {
    seconds: 300,
    timing: "ease-in-out",
  },
  breakpoints: {
    1024: {
      showSlidesCount: 3,
    },
    768: {
      showSlidesCount: 2,
    },
    580: {
      showSlidesCount: 1,
    },
    default: {
      showSlidesCount: 3,
    },
  },
});