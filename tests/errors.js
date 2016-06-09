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
  it('Should display the h3 title', () =>
  {
    const errors = [
      {
        name: 'name',
        type: 'required',
        value: null,
        message: 'Name is required'
      },
      {
        name: 'description',
        type: 'required',
        value: null,
        message: 'Description is required'
      }
    ];

    const el = mount(
      <Errors errors={errors} />
    );

    expect(el.find('h3').text()).to.equal('There was an error submitting the form:');
  });
});
