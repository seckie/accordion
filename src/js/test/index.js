'use strict';

import assert from 'assert';
import Accordion from '../accordion.js';


describe('Accordion class', function () {

  it('Throw error without DOM', function () {
    if (typeof window === 'undefined') {
      assert.throws(() => {
        const accordion = new Accordion();
      }, Error, 'Accordion instance is depends on DOM.');
    }
  });

  it('Pass props from args', function () {
    function filterFunc () {
      return true;
    }
    const accordion = new Accordion({
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
    const accordion = new Accordion({
      bodiesSelector: '.component__body',
      headersSelector: '.component__label',
      sectionsSelector: '.component',
      openClassName: 'component-open'
    });
    const $section = document.querySelector('.component');
    const $body = document.querySelector('.component__body');
    assert.equal($section.style.position, 'relative', '$section.style.position is "relative" after initialize');
    assert.equal($section.style.overflow, 'hidden', '$section.style.overflow is "hidden" after initialize');
    assert.equal($body.style.position, 'absolute', '$body.style.position is "absolute" after initialize');
    assert.equal($body.style.width, "100%", '$body.style.width is "100%" after initialize');
    assert.equal($body.style.left, '-150%', '$body.style.left is "-150%" after initialize');
    assert.equal($body.style.transition, 'height 0.5s ease-in-out', '$body.style.transition is "height 0.5s ease-in-out" after initialize');
  });

  beforeEach(function () {
    document.body.innerHTML = __html__['src/js/test/fixture.html'];
  });
  afterEach(function () {
    document.body.innerHTML = "";
  });

});
