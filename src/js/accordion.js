'use strict';
import debounce from 'lodash/debounce';

const errorMessage = 'This module depends on browser DOM. You can\'t use this without browser.';

class Accordion {

  constructor (props = {}) {
    if (typeof window === 'undefined' ||
      typeof document === 'undefined') {
      throw new Error(errorMessage);
    }
    // props
    this.filter = props.filter || function () {return true;};
    this.bodiesSelector = props.bodiesSelector;
    this.headersSelector = props.headersSelector;
    this.sectionsSelector = props.sectionsSelector;
    this.openClassName = props.openClassName;
    this.resizeHandler = props.onResize || debounce(this._update.bind(this), 250);
    // data
    this.clickListeners = [];
    this.currentWidth = window.innerWidth;
    // exec
    this._init();
    window.addEventListener('resize', this.resizeHandler, false);
    setTimeout(this._update.bind(this), 50);
  }

  destroy () {
    this._reset();
    window.removeEventListener('resize', this.resizeHandler, false);
  }

  _init () {
    // initialize DOM style
    if (this.isInitialized || this.filter() == false) {
      return;
    }
    const $sections = document.querySelectorAll(this.sectionsSelector);
    const $bodies = document.querySelectorAll(this.bodiesSelector);
    for (let i=0, l=$sections.length; i<l; i++) {
      const $section = $sections[i];
      const $body = $bodies[i];
      $section.style.position = 'relative';
      $section.style.overflow = 'hidden';
      $body.style.position = 'absolute';
      $body.style.width = '100%';
      $body.style.left = '-150%';
      $body.style.transition = 'height 0.5s ease-in-out';
    }
    this.$sections = $sections;
    this.$bodies = $bodies;
    this.isInitialized = true;
  }

  _reset () {
    // reset DOM style
    const $sections = this.$sections || document.querySelectorAll(this.sectionsSelector);
    const $bodies = this.$bodies || document.querySelectorAll(this.bodiesSelector);
    const $headers = this.$headers || document.querySelectorAll(this.headersSelector);
    for (let i=0, l=$sections.length; i<l; i++) {
      const $section = $sections[i];
      const $body = $bodies[i];
      $section.style.position = '';
      $section.style.overflow = '';
      $body.style.position = '';
      $body.style.width = '';
      $body.style.height = '';
      $body.style.left = '';
      $body.style.transition = '';
      if (this.clickListeners[i] && $headers[i]) {
        $headers[i].removeEventListener('click', this.clickListeners[i], false);
      }
    }
    this.isInitialized = false;
  }

  _update () {
    if (this.clickListeners[0] && this.currentWidth === window.innerWidth) {
      // return if window width doesn't change
      return;
    }
    this.currentWidth = window.innerWidth;

    if (this.filter() == false) {
      // return if disable condition
      if (this.clickListeners[0]) {
        // Change from enable condition to disable condition, reset DOM
        this._reset();
      }
      return;
    }

    this._init();

    const $sections = document.querySelectorAll(this.sectionsSelector);
    if ($sections[0]) {
      const $bodies = document.querySelectorAll(this.bodiesSelector);
      const $headers = document.querySelectorAll(this.headersSelector);
      for (let i=0, l=$sections.length; i<l; i++) {
        const $section = $sections[i];
        const $header = $headers[i];
        const $body = $bodies[i];
        $body.style.height = '';
        $body.style.position = '';
        $body.style.left = '';
        if (this.clickListeners[i]) {
          $header.removeEventListener('click', this.clickListeners[i], false);
        }
        this.clickListeners[i] = (e) => {
          const el = e.currentTarget;
          const key = +el.dataset.key;
          if (parseInt($bodies[key].style.height, 10) == 0) {
            $bodies[key].style.height = el.dataset.targetHeight + 'px';
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
        $body.style.position = 'static';
        $body.style.left = 0;
        $section.classList.remove(this.openClassName);
        $header.addEventListener('click', this.clickListeners[i], false);
      }

      this.$sections = $sections;
      this.$bodies = $bodies;
      this.$headers = $headers;
    }
  }

}

export default Accordion;
