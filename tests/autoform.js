/**
 * Created by josh.welham on 09/06/16.
 */

/* eslint no-unused-expressions: ["off"] */
/* eslint no-shadow: ["error", {"allow": ["doc"]}] */

const {describe, it} = global;
import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from './../src/muiTheme';
import ReactAutoForm from './../src/autoform';

describe('meteor-react-autoform.autoform', () =>
{
  it('Testing a test', () =>
  {
    const onSubmit = sinon.spy();

    const el = mount(
      <MaterialUI>
        <div>
          <h1>Hello World</h1>
          <ReactAutoForm
            onSubmit={onSubmit}
            schema={HelpDeskSchema}
            type="insert"
          />
        </div>
      </MaterialUI>
    );

    expect(el.find('h1').text()).to.equal('Hello World');
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

const MaterialUI = ({children}) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    {children}
  </MuiThemeProvider>
);
