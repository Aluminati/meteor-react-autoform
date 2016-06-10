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
  it('Quick test on all fields exist with basic features like label and floating text', () =>
  {
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
    expect(el.find('input[name="favoritePositiveInteger"]').props().id).to.contain('favoritePositiveInteger-undefined-Favoritepositiveinteger');
    expect(el.find('input[name="birthday"]').props().id).to.contain('birthday-Yourbirthday-null-');
    expect(el.find('Toggle').props().toggled).to.equal(false);
    // expect(el.find('#selectChooseNumber div').nodes[2].parentNode.textContent).to.equal('Two');
    // expect(el.find('input[name="skyColour"][value="red"]').props().checked).to.be.true;
  });

  it('Should test the text input: name', () =>
  {
    const schema = {
      name: {
        type: String,
        materialForm: {
          floatingLabelText: 'Name',
          hintText: 'Your name...'
        }
      }
    };

    const el = mount(
      <ReactAutoForm
        muiTheme={true}
        onSubmit={onSubmit}
        schema={schema}
        type="insert"
      />
    );

    const TextField = el.find('TextField').filterWhere(n => n.props().name === 'name');
    expect(TextField).length(1);
    expect(TextField.props().name).to.equal('name');
    expect(TextField.props().floatingLabelText).to.equal('Name');
    expect(TextField.props().hintText).to.equal('Your name...');
    expect(TextField.props().value).to.equal('');

    schema.name.defaultValue = 'My default name';
    el.setProps({schema});
    expect(TextField.props().value).to.equal('My default name');

    el.setState({name_fieldValue: 'Josh'});
    expect(TextField.props().value).to.equal('Josh');
  });

  it('Should test the checkbox radio input: reoccurringProblem', () =>
  {
    const schema = {
      reoccurringProblem: {
        type: Boolean,
        optional: true,
        label: 'Have you had the problem before?',
        materialForm: {
          switcher: 'Checkbox'
        }
      }
    };

    const el = mount(
      <ReactAutoForm
        muiTheme={true}
        onSubmit={onSubmit}
        schema={schema}
        type="insert"
      />
    );

    expect(el.find('Checkbox')).length(1);
    expect(el.find('Checkbox').props().name).to.equal('reoccurringProblem');
    expect(el.find('Checkbox').props().label).to.equal('Have you had the problem before?');
    expect(el.find('Checkbox').props().checked).to.equal(false);

    schema.reoccurringProblem.defaultValue = true;
    el.setProps({schema});
    expect(el.find('Checkbox').props().checked).to.equal(true);

    schema.reoccurringProblem.defaultValue = false;
    el.setProps({schema});
    expect(el.find('Checkbox').props().checked).to.equal(false);

    el.setState({reoccurringProblem_fieldValue: true});
    expect(el.find('Checkbox').props().checked).to.equal(true);
  });

  it('Should test the toggle radio input: agree', () =>
  {
    const schema = {
      agree: {
        type: Boolean,
        optional: true,
        label: 'Do you agree Toggle?',
        materialForm: {
          switcher: 'Toggle'
        }
      }
    };

    const el = mount(
      <ReactAutoForm
        muiTheme={true}
        onSubmit={onSubmit}
        schema={schema}
        type="insert"
      />
    );

    expect(el.find('Toggle')).length(1);
    expect(el.find('Toggle').props().name).to.equal('agree');
    expect(el.find('Toggle').props().label).to.equal('Do you agree Toggle?');
    expect(el.find('Toggle').props().toggled).to.equal(false);

    schema.agree.defaultValue = true;
    el.setProps({schema});
    expect(el.find('Toggle').props().toggled).to.equal(true);

    schema.agree.defaultValue = false;
    el.setProps({schema});
    expect(el.find('Toggle').props().toggled).to.equal(false);

    el.setState({agree_fieldValue: true});
    expect(el.find('Toggle').props().toggled).to.equal(true);
  });
});

const onSubmit = sinon.spy();

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

