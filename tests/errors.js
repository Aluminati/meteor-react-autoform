/**
 * Created by josh.welham on 09/06/16.
 */

/* eslint no-unused-expressions: ["off"] */
/* eslint no-shadow: ["error", {"allow": ["doc"]}] */

const {describe, it} = global;
import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import Errors from '../src/errors';

describe('meteor-react-autoform.errors', () =>
{
  it('Testing the test - Should win', () =>
  {
    expect(1).to.equal(1);
  });
});
