'use strict';

import assert from 'assert';
import Accordion from '../accordion.js';


describe('Accordion class', () => {
  if (typeof window === 'undefined') {
    it('Throw error without DOM', () => {
      assert.throws(() => {
        const accordion = new Accordion();
      }, Error, 'Accordion instance is depends on DOM.');
    });
  } else {
    window.blur();
  }

  it('DOM manupulation test', () => {
    document.body.innerHTML = __html__['src/js/test/fixture.html'];
    const $sections = document.getElementsByTagName('section');
    assert.equal(true, true, 'Dummy');
    console.log($sections.length);
    assert.equal($sections.length, 3, 'Count of section elements is 3');
  });

});
