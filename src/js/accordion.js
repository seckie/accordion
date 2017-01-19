'use strict';
import debounce from 'lodash/debounce';

class Accordion {

  constructor (props) {
    // props
    this.filter = props.filter || function () {return true;};
    this.bodiesSelector = props.bodiesSelector;
    this.headersSelector = props.headersSelector;
    this.sectionsSelector = props.sectionsSelector;
    this.openClassName = props.openClassName;
    // data
    this.clickListeners = [];
    this.currentWidth = window.innerWidth;

    window.addEventListener("resize", debounce(this._resizeHandler.bind(this), 250));
    this._resizeHandler();
  }

  _resizeHandler () {
    if (this.clickListeners[0] && this.currentWidth === window.innerWidth) {
      return;
    }
    this.currentWidth = window.innerWidth;

    if (!this.filter()) {
      if (this.clickListeners[0]) {
        const $bodies = document.querySelectorAll(this.bodiesSelector);
        const $headers= document.querySelectorAll(this.headersSelector);
        for (let i=0, l=$bodies.length; i<l; i++) {
          $bodies[i].style.height = "";
          $bodies[i].style.position = "";
          $bodies[i].style.left = "";
          $headers[i].removeEventListener("click", this.clickListeners[i], false);
        }
      }
      return;
    }

    const $sections = document.querySelectorAll(this.sectionsSelector);
    if ($sections[0]) {
      const $bodies = document.querySelectorAll(this.bodiesSelector);
      const $headers= document.querySelectorAll(this.headersSelector);
      for (let i=0, l=$sections.length; i<l; i++) {
        $bodies[i].style.height = "";
        $bodies[i].style.position = "";
        $bodies[i].style.left = "";
        let $el = $sections[i];
        let $header = $headers[i];
        let $body = $bodies[i];
        if (this.clickListeners[i]) {
          $header.removeEventListener("click", this.clickListeners[i], false);
        }
        this.clickListeners[i] = (e) => {
          const el = e.currentTarget;
          const key = +el.dataset.key;
          if (parseInt($bodies[key].style.height, 10) == 0) {
            $bodies[key].style.height = el.dataset.targetHeight + "px";
            $sections[key].classList.add(this.openClassName);
          } else {
            $bodies[key].style.height = 0;
            $sections[key].classList.remove(this.openClassName);
          }
        };
        this.clickListeners[i] = this.clickListeners[i].bind(this);

        $header.dataset.key = i;
        $header.dataset.targetHeight = $body.clientHeight ? $body.clientHeight : 0;
        $body.style.height = 0;
        $body.style.position = "static";
        $body.style.left = 0;
        $sections[i].classList.remove(this.openClassName);
        $header.addEventListener("click", this.clickListeners[i], false);
      }
    }
  }

}

export default Accordion;
