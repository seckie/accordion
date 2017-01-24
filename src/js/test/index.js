'use strict';

import assert from 'assert';
import Accordion from '../accordion.js';

describe('Accordion class', () => {
  it('Throw error without DOM', () => {
    assert.throws(() => {
      const accordion = new Accordion();
    }, Error, 'Accordion instance is depends on DOM.');
  });
});
