/**
 * Created by josh.welham on 09/06/16.
 */

/* eslint no-unused-expressions: ["off"] */
/* eslint no-shadow: ["error", {"allow": ["doc"]}] */
/* eslint camelcase: ["off"] */

const {describe, it} = global;
import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import ReactAutoForm from './../src/autoform';

describe('meteor-react-autoform.autoform', () =>
{
  it('Testing a test', () =>
  {
    const onSubmit = sinon.spy();

    const el = mount(
      <ReactAutoForm
        muiTheme={true}
        onSubmit={onSubmit}
        schema={HelpDeskSchema}
        type="insert"
      />
    );

    expect(el.find('input[name="name"]').props().id).to.contain('name-Yourname-Name-');
    expect(el.find('input[name="nameWithNoFormData"]').props().id).to.contain('nameWithNoFormData-undefined-null-');
    expect(el.find('textarea[name="description"]').props().id).to.contain('description-Irequireapasswordreset-Describeyourproblem-');
    expect(el.find('input[name="reoccurringProblem"]').props().type).to.equal('checkbox');
    expect(el.find('input[name="reoccurringProblem"]').props().checked).to.equal(true);
    expect(el.find('input[name="favoritePositiveInteger"]').props().id).to.contain('favoritePositiveInteger-undefined-Favoritepositiveinteger');
    expect(el.find('input[name="birthday"]').props().id).to.contain('birthday-Yourbirthday-null-');
    expect(el.find('Toggle').props().toggled).to.equal(false);
    // expect(el.find('#selectChooseNumber div').nodes[2].parentNode.textContent).to.equal('Two');
    // expect(el.find('input[name="skyColour"][value="red"]').props().checked).to.be.true;
  });
});

const HelpDeskSchema = {
  name: {
    type: String,
    materialForm: {
      floatingLabelText: 'Name',
      hintText: 'Your name...'
    }
  },
  nameWithNoFormData: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    min: 10,
    max: 200,
    materialForm: {
      floatingLabelText: 'Describe your problem',
      rows: 1,
      rowsMax: 10,
      multiLine: true,
      hintText: 'I require a password reset...'
    }
  },
  reoccurringProblem: {
    type: Boolean,
    defaultValue: true,
    optional: true,
    label: 'Have you had the problem before?',
    materialForm: {
      switcher: 'Checkbox'
    }
  },
  favoritePositiveInteger: {
    type: Number,
    min: 0,
    optional: true,
    label: 'Favorite positive integer',
    materialForm: {
      step: 0.5
    }
  },
  birthday: {
    type: Date,
    optional: true,
    label: 'Your birthday',
    defaultValue: new Date('2014-10-18T00:00:00.000Z'),
    materialForm: {
      dateMode: 'landscape',
      autoOk: true
    }
  },
  agree: {
    type: Boolean,
    optional: true,
    label: 'Do you agree Toggle?',
    defaultValue: false,
    materialForm: {
      switcher: 'Toggle'
    }
  },
  choose3: {
    type: Number,
    allowedValues: [
      1,
      2,
      3
    ],
    optional: true,
    label: 'Choose a number',
    materialForm: {
      selectOptions: {
        id: 'selectChooseNumber',
        className: 'selectChooseNumber'
      },
      options: [
        {
          label: 'One',
          value: 1
        },
        {
          label: 'Two',
          value: 2
        },
        {
          label: 'Three',
          value: 3
        }
      ]
    }
  },
  skyColour: {
    type: String,
    allowedValues: [
      'red',
      'green'
    ],
    optional: true,
    label: 'What colour is the sky?',
    materialForm: {
      switcher: 'Radio',
      groupOptions: {
        className: 'radioExample'
      },
      options: [
        {
          label: 'Red',
          value: 'red'
        },
        {
          label: 'Green',
          value: 'green'
        }
      ]
    }
  }
};
