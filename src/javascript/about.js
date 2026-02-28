import gsap from "gsap";
import CONFIG, { ROUTES } from "../../config.js";
import "../css/about.css"

gsap.fromTo(".Transition div", {
  height: "100%"
}, {
  delay: 0.3,
  height: "0%",
  stagger: 0.1,
  duration: 1.3,

})


document.querySelector(".homeLink").addEventListener("click", () => {
  // document.querySelector(".Transition").style.diplay ="flex"
  gsap.fromTo(".Transition div", {
    height: "0%"
  }, {
    height: "100%",
    stagger: 0.12,
    duration: 1.5,
    onComplete: () => { window.location.href = ROUTES.HOME; }

  })
})
document.querySelector(".worksLink").addEventListener("click", () => {
  // document.querySelector(".Transition").style.diplay ="flex"
  gsap.fromTo(".Transition div", {
    height: "0%"
  }, {
    height: "100%",
    stagger: 0.12,
    duration: 1.5,
    onComplete: () => {
      // gsap.set(".Transition div",{height:"100%"})
      window.location.href = ROUTES.WORKS;
    }

  })
})