'use strict';

import assert from 'assert';
import Accordion from '../accordion.js';

/*eslint-disable no-console*/

describe('Accordion class', function () {

  it('Throw error without DOM', function () {
    if (typeof window === 'undefined') {
      assert.throws(() => {
        this.accordion = new Accordion();
      }, Error, 'Accordion instance is depends on DOM.');
    }
  });

  it('destroy() method', function () {
    let counter = 0;
    function handler() { counter++; }
    const option = Object.assign({}, this.option, { onResize: handler });
    const accordion = this.accordion = new Accordion(option);
    this.timeout(500);
    return new Promise((resolve) => {
      setTimeout(() =>{
        assert.equal(counter, 0, 'counter value is 0');

        // trigger 'resize' event
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('resize', false, false);
        window.dispatchEvent(evt);
        assert.equal(counter, 1, 'counter value is 1');

        // Do destroy()
        accordion.destroy();

        // trigger 'resize' event after destroy()
        evt = document.createEvent('HTMLEvents');
        evt.initEvent('resize', false, false);
        window.dispatchEvent(evt);
        assert.equal(counter, 1, 'counter value is still 1');

        // removing $header clickLiteners after destroy()
        let $section =  document.querySelector(accordion.sectionsSelector);
        const cName = $section.className;
        accordion.$headers[0].click();
        $section = document.querySelector(accordion.sectionsSelector);
        assert.equal($section.className, cName, 'section element className was not updated.');

        delete this.accordion;
        resolve();
      }, 400);
    });
  });

  it('Pass props from args', function () {
    function filterFunc () {
      return true;
    }
    const accordion = this.accordion = new Accordion({
      bodiesSelector: '.body',
      headersSelector: '.header',
      sectionsSelector: '.section',
      openClassName: 'section-open',
      filter: filterFunc
    });

    assert.equal(accordion.bodiesSelector, '.body', 'Pass "bodiesSelector" option to prop');
    assert.equal(accordion.headersSelector, '.header', 'Pass "headersSelector" option to prop');
    assert.equal(accordion.sectionsSelector, '.section', 'Pass "sectionsSelector" option to prop');
    assert.equal(accordion.openClassName, 'section-open', 'Pass "openClassName" option to prop');
    assert.equal(accordion.filter, filterFunc, 'Pass "filter" option to prop');
  });

  it('DOM manupulation', function () {
    this.accordion = new Accordion(this.option);
    const $section = document.querySelector('.component');
    const $body = document.querySelector('.component__body');
    assert.equal($section.style.position, 'relative', '$section.style.position is "relative" after initialize');
    assert.equal($section.style.overflow, 'hidden', '$section.style.overflow is "hidden" after initialize');
    assert.equal($body.style.position, 'absolute', '$body.style.position is "absolute" after initialize');
    assert.equal($body.style.width, '100%', '$body.style.width is "100%" after initialize');
    assert.equal($body.style.left, '-150%', '$body.style.left is "-150%" after initialize');
    assert.equal($body.style.transition, 'height 0.5s ease-in-out', '$body.style.transition is "height 0.5s ease-in-out" after initialize');
  });

  beforeEach(function () {
    document.body.innerHTML = __html__['src/js/test/fixture.html'];
    this.option = {
      bodiesSelector: '.component__body',
      headersSelector: '.component__label',
      sectionsSelector: '.component',
      openClassName: 'component-open'
    };
  });
  afterEach(function () {
    document.body.innerHTML = '';
    if (this.accordion) {
      this.accordion.destroy();
      delete this.accordion;
    }
  });

});
