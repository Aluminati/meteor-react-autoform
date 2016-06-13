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

  it('Should test the text input without any materialForm object: name', () =>
  {
    const schema = {
      name: {
        type: String
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
    expect(TextField.props().floatingLabelText).to.equal(null);
    expect(TextField.props().hintText).to.equal(undefined);
    expect(el.find('TextField').props().type).to.equal('text');
    expect(TextField.props().value).to.equal('');

    TextField.props().onChange({target: {value: ''}});
    expect(el.state().name_fieldValue).to.equal('');
    expect(TextField.props().value).to.equal('');

    schema.name.defaultValue = 'My default name';
    el.setProps({schema});
    TextField.props().onChange({target: {value: ''}});
    expect(TextField.props().value).to.equal('My default name');

    el.setState({name_fieldValue: 'Josh'});
    expect(TextField.props().value).to.equal('Josh');

    TextField.props().onChange({target: {value: ''}});
    expect(el.state().name_fieldValue).to.equal('My default name');
    expect(TextField.props().value).to.equal('My default name');

    TextField.props().onChange({target: {value: 'Hello World'}});
    expect(el.state().name_fieldValue).to.equal('Hello World');
    expect(TextField.props().value).to.equal('Hello World');
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
    expect(el.find('TextField').props().type).to.equal('text');
    expect(TextField.props().value).to.equal('');

    TextField.props().onChange({target: {value: ''}});
    expect(el.state().name_fieldValue).to.equal('');
    expect(TextField.props().value).to.equal('');

    schema.name.defaultValue = 'My default name';
    el.setProps({schema});
    TextField.props().onChange({target: {value: ''}});
    expect(TextField.props().value).to.equal('My default name');

    el.setState({name_fieldValue: 'Josh'});
    expect(TextField.props().value).to.equal('Josh');

    TextField.props().onChange({target: {value: ''}});
    expect(el.state().name_fieldValue).to.equal('My default name');
    expect(TextField.props().value).to.equal('My default name');

    TextField.props().onChange({target: {value: 'Hello World'}});
    expect(el.state().name_fieldValue).to.equal('Hello World');
    expect(TextField.props().value).to.equal('Hello World');
  });

  it('Should test the textarea input: description', () =>
  {
    const schema = {
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

    expect(el.find('TextField')).length(1);
    expect(el.find('TextField').props().name).to.equal('description');
    expect(el.find('TextField').props().floatingLabelText).to.equal('Describe your problem');
    expect(el.find('TextField').props().hintText).to.equal('I require a password reset...');
    expect(el.find('TextField').props().type).to.equal('text');
    expect(el.find('TextField').props().value).to.equal('');
    expect(el.find('TextField').props().maxLength).to.equal(200);
    expect(el.find('TextField').props().rows).to.equal(1);
    expect(el.find('TextField').props().rowsMax).to.equal(10);
    expect(el.find('TextField').props().multiLine).to.equal(true);

    schema.description.defaultValue = 'My default';
    el.setProps({schema});
    expect(el.find('TextField').props().value).to.equal('My default');

    el.setState({description_fieldValue: 'Hello world textarea'});
    expect(el.find('TextField').props().value).to.equal('Hello world textarea');
  });

  it('Should test the checkbox input: reoccurringProblem', () =>
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

    el.find('Checkbox').props().onCheck({target: {checked: false}});
    expect(el.find('Checkbox').props().checked).to.equal(false);
    expect(el.state().reoccurringProblem_fieldValue).to.equal(false);

    el.find('Checkbox').props().onCheck({target: {checked: true}});
    expect(el.find('Checkbox').props().checked).to.equal(true);
    expect(el.state().reoccurringProblem_fieldValue).to.equal(true);
  });

  it('Should test the toggle checkbox input: agree', () =>
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

    el.find('Toggle').props().onToggle({target: {checked: false}});
    expect(el.state().agree_fieldValue).to.equal(false);
    expect(el.find('Toggle').props().toggled).to.equal(false);
  });

  it('Should test the number input: favoritePositiveInteger', () =>
  {
    const schema = {
      favoritePositiveInteger: {
        type: Number,
        min: 0,
        optional: true,
        label: 'Favorite positive integer',
        materialForm: {
          step: 0.5
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

    expect(el.find('TextField')).length(1);
    expect(el.find('TextField').props().name).to.equal('favoritePositiveInteger');
    expect(el.find('TextField').props().floatingLabelText).to.equal('Favorite positive integer');
    expect(el.find('TextField').props().step).to.equal(0.5);
    expect(el.find('TextField').props().type).to.equal('number');

    schema.favoritePositiveInteger.defaultValue = 1;
    el.setProps({schema});
    expect(el.find('TextField').props().value).to.equal(1);

    el.setState({favoritePositiveInteger_fieldValue: 10});
    expect(el.find('TextField').props().value).to.equal(10);

    el.find('TextField').props().onChange({target: {value: 'text'}});
    expect(el.state().favoritePositiveInteger_fieldValue).to.deep.equal(NaN);
    expect(el.find('TextField').props().value).to.deep.equal(NaN);

    el.find('TextField').props().onChange({target: {value: '1'}});
    expect(el.state().favoritePositiveInteger_fieldValue).to.equal(1);
    expect(el.find('TextField').props().value).to.equal(1);

    el.find('TextField').props().onChange({target: {value: 2}});
    expect(el.state().favoritePositiveInteger_fieldValue).to.equal(2);
    expect(el.find('TextField').props().value).to.equal(2);
  });

  it('Should test the date input: birthday', () =>
  {
    const schema = {
      birthday: {
        type: Date,
        optional: true,
        label: 'Your birthday',
        materialForm: {
          mode: 'landscape',
          autoOk: true
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

    expect(el.find('DatePicker')).length(1);
    expect(el.find('DatePicker').props().name).to.equal('birthday');
    expect(el.find('DatePicker').props().container).to.equal('dialog');
    expect(el.find('DatePicker').props().hintText).to.equal('Your birthday');
    expect(el.find('DatePicker').props().mode).to.equal('landscape');
    expect(el.find('DatePicker').props().autoOk).to.equal(true);
    expect(el.find('DatePicker').props().value).to.equal('');

    schema.birthday.defaultValue = new Date('2014-10-18T00:00:00.000Z');
    el.setProps({schema});
    expect(el.find('DatePicker').props().value).to.deep.equal(new Date('Sat, 18 Oct 2014 00:00:00 GMT'));

    el.setState({birthday_fieldValue: new Date('Fri Jun 10 2016 16:43:04 GMT+0100 (BST)')});
    expect(el.find('DatePicker').props().value).to.deep.equal(new Date('Fri, 10 Jun 2016 15:43:04 GMT'));

    el.find('DatePicker').props().onChange(null, new Date('Mon Jun 13 2016 08:53:13 GMT+0100 (BST)'));
    expect(el.state().birthday_fieldValue).to.deep.equal(new Date('Mon Jun 13 2016 08:53:13 GMT+0100 (BST)'));
    expect(el.find('DatePicker').props().value).to.deep.equal(new Date('Mon, 13 Jun 2016 07:53:13 GMT'));

    schema.birthday.materialForm.mode = 'portrait';
    el.setProps({schema});
    expect(el.find('DatePicker').props().mode).to.equal('portrait');
  });

  it('Should test the radio input: skyColour', () =>
  {
    const schema = {
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

    const el = mount(
      <ReactAutoForm
        muiTheme={true}
        onSubmit={onSubmit}
        schema={schema}
        type="insert"
      />
    );

    expect(el.find('RadioButtonGroup')).length(1);
    expect(el.find('RadioButton')).length(2);
    expect(el.find('RadioButtonGroup').props().name).to.equal('skyColour');
    expect(el.find('RadioButtonGroup').props().className).to.equal(undefined);
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('');

    const RedButton = el.find('RadioButton').filterWhere(n => n.props().label === 'Red');
    expect(RedButton).length(1);
    expect(RedButton.props().name).to.equal('skyColour');
    expect(RedButton.props().value).to.equal('red');
    expect(RedButton.props().label).to.equal('Red');
    expect(RedButton.props().checked).to.equal(false);

    const GreenButton = el.find('RadioButton').filterWhere(n => n.props().label === 'Green');
    expect(GreenButton).length(1);
    expect(GreenButton.props().name).to.equal('skyColour');
    expect(GreenButton.props().value).to.equal('green');
    expect(GreenButton.props().label).to.equal('Green');
    expect(GreenButton.props().checked).to.equal(false);

    const GreenButtonEnhancedSwitch = el.find('EnhancedSwitch').filterWhere(n => n.props().label === 'Green');
    expect(GreenButtonEnhancedSwitch).length(1);
    expect(GreenButtonEnhancedSwitch.props().name).to.equal('skyColour');
    expect(GreenButtonEnhancedSwitch.props().value).to.equal('green');
    expect(GreenButtonEnhancedSwitch.props().label).to.equal('Green');
    expect(GreenButtonEnhancedSwitch.props().value).to.equal('green');
    expect(GreenButtonEnhancedSwitch.props().inputType).to.equal('radio');
    expect(GreenButtonEnhancedSwitch.props().switched).to.equal(false);
    expect(GreenButtonEnhancedSwitch.props().checked).to.equal(false);

    schema.skyColour.materialForm.groupOptions = {className: 'radioExample'};
    el.setProps({schema});
    expect(el.find('RadioButtonGroup').props().className).to.equal('radioExample');

    schema.skyColour.defaultValue = 'red';
    el.setProps({schema});
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('red');
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'Red').props().checked).to.equal(true);
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'Green').props().checked).to.equal(false);

    el.setState({skyColour_fieldValue: 'green'});
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('green');
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'Red').props().checked).to.equal(false);
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'Green').props().checked).to.equal(true);

    el.find('RadioButtonGroup').props().onChange(null, 'red');
    expect(el.state().skyColour_fieldValue).to.equal('red');
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('red');
  });

  it('Should test the radio input without materialForm.options in the schema: skyColour', () =>
  {
    const schema = {
      skyColour: {
        type: String,
        allowedValues: [
          'red',
          'green'
        ],
        optional: true,
        label: 'What colour is the sky?',
        materialForm: {
          switcher: 'Radio'
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

    expect(el.find('RadioButtonGroup')).length(1);
    expect(el.find('RadioButton')).length(2);
    expect(el.find('RadioButtonGroup').props().name).to.equal('skyColour');
    expect(el.find('RadioButtonGroup').props().className).to.equal(undefined);
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('');

    const RedButton = el.find('RadioButton').filterWhere(n => n.props().label === 'red');
    expect(RedButton).length(1);
    expect(RedButton.props().name).to.equal('skyColour');
    expect(RedButton.props().value).to.equal('red');
    expect(RedButton.props().label).to.equal('red');
    expect(RedButton.props().checked).to.equal(false);

    const GreenButton = el.find('RadioButton').filterWhere(n => n.props().label === 'green');
    expect(GreenButton).length(1);
    expect(GreenButton.props().name).to.equal('skyColour');
    expect(GreenButton.props().value).to.equal('green');
    expect(GreenButton.props().label).to.equal('green');
    expect(GreenButton.props().checked).to.equal(false);

    const GreenButtonEnhancedSwitch = el.find('EnhancedSwitch').filterWhere(n => n.props().label === 'green');
    expect(GreenButtonEnhancedSwitch).length(1);
    expect(GreenButtonEnhancedSwitch.props().name).to.equal('skyColour');
    expect(GreenButtonEnhancedSwitch.props().value).to.equal('green');
    expect(GreenButtonEnhancedSwitch.props().label).to.equal('green');
    expect(GreenButtonEnhancedSwitch.props().value).to.equal('green');
    expect(GreenButtonEnhancedSwitch.props().inputType).to.equal('radio');
    expect(GreenButtonEnhancedSwitch.props().switched).to.equal(false);
    expect(GreenButtonEnhancedSwitch.props().checked).to.equal(false);

    schema.skyColour.materialForm.groupOptions = {className: 'radioExample'};
    el.setProps({schema});
    expect(el.find('RadioButtonGroup').props().className).to.equal('radioExample');

    schema.skyColour.defaultValue = 'red';
    el.setProps({schema});
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('red');
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'red').props().checked).to.equal(true);
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'green').props().checked).to.equal(false);

    el.setState({skyColour_fieldValue: 'green'});
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('green');
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'red').props().checked).to.equal(false);
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'green').props().checked).to.equal(true);

    el.find('RadioButtonGroup').props().onChange(null, 'red');
    expect(el.state().skyColour_fieldValue).to.equal('red');
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('red');
  });

  it('Should test the radio input without allowValues in the schema: skyColour', () =>
  {
    const schema = {
      skyColour: {
        type: String,
        optional: true,
        label: 'What colour is the sky?',
        materialForm: {
          switcher: 'Radio',
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

    const el = mount(
      <ReactAutoForm
        muiTheme={true}
        onSubmit={onSubmit}
        schema={schema}
        type="insert"
      />
    );

    expect(el.find('RadioButtonGroup')).length(1);
    expect(el.find('RadioButton')).length(2);
    expect(el.find('RadioButtonGroup').props().name).to.equal('skyColour');
    expect(el.find('RadioButtonGroup').props().className).to.equal(undefined);
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('');

    const RedButton = el.find('RadioButton').filterWhere(n => n.props().label === 'Red');
    expect(RedButton).length(1);
    expect(RedButton.props().name).to.equal('skyColour');
    expect(RedButton.props().value).to.equal('red');
    expect(RedButton.props().label).to.equal('Red');
    expect(RedButton.props().checked).to.equal(false);

    const GreenButton = el.find('RadioButton').filterWhere(n => n.props().label === 'Green');
    expect(GreenButton).length(1);
    expect(GreenButton.props().name).to.equal('skyColour');
    expect(GreenButton.props().value).to.equal('green');
    expect(GreenButton.props().label).to.equal('Green');
    expect(GreenButton.props().checked).to.equal(false);

    const GreenButtonEnhancedSwitch = el.find('EnhancedSwitch').filterWhere(n => n.props().label === 'Green');
    expect(GreenButtonEnhancedSwitch).length(1);
    expect(GreenButtonEnhancedSwitch.props().name).to.equal('skyColour');
    expect(GreenButtonEnhancedSwitch.props().value).to.equal('green');
    expect(GreenButtonEnhancedSwitch.props().label).to.equal('Green');
    expect(GreenButtonEnhancedSwitch.props().value).to.equal('green');
    expect(GreenButtonEnhancedSwitch.props().inputType).to.equal('radio');
    expect(GreenButtonEnhancedSwitch.props().switched).to.equal(false);
    expect(GreenButtonEnhancedSwitch.props().checked).to.equal(false);

    schema.skyColour.materialForm.groupOptions = {className: 'radioExample'};
    el.setProps({schema});
    expect(el.find('RadioButtonGroup').props().className).to.equal('radioExample');

    schema.skyColour.defaultValue = 'red';
    el.setProps({schema});
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('red');
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'Red').props().checked).to.equal(true);
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'Green').props().checked).to.equal(false);

    el.setState({skyColour_fieldValue: 'green'});
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('green');
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'Red').props().checked).to.equal(false);
    expect(el.find('RadioButton').filterWhere(n => n.props().label === 'Green').props().checked).to.equal(true);

    el.find('RadioButtonGroup').props().onChange(null, 'red');
    expect(el.state().skyColour_fieldValue).to.equal('red');
    expect(el.find('RadioButtonGroup').props().valueSelected).to.equal('red');
  });

  it('Should test the radio input without allowValues or materialForm.options in the schema: skyColour', () =>
  {
    const schema = {
      skyColour: {
        type: String,
        optional: true,
        label: 'What colour is the sky?',
        materialForm: {
          switcher: 'Radio'
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

    expect(el.find('TextField')).length(1);
    expect(el.find('TextField').props().name).to.equal('skyColour');
    expect(el.find('TextField').props().floatingLabelText).to.equal('What colour is the sky?');
    expect(el.find('TextField').props().hintText).to.equal(undefined);
    expect(el.find('TextField').props().type).to.equal('text');
    expect(el.find('TextField').props().value).to.equal('');

    el.find('TextField').props().onChange({target: {value: ''}});
    expect(el.state().skyColour_fieldValue).to.equal('');
    expect(el.find('TextField').props().value).to.equal('');

    schema.skyColour.defaultValue = 'My default name';
    el.setProps({schema});
    el.find('TextField').props().onChange({target: {value: ''}});
    expect(el.find('TextField').props().value).to.equal('My default name');

    el.setState({skyColour_fieldValue: 'Josh'});
    expect(el.find('TextField').props().value).to.equal('Josh');

    el.find('TextField').props().onChange({target: {value: ''}});
    expect(el.state().skyColour_fieldValue).to.equal('My default name');
    expect(el.find('TextField').props().value).to.equal('My default name');

    el.find('TextField').props().onChange({target: {value: 'Hello World'}});
    expect(el.state().skyColour_fieldValue).to.equal('Hello World');
    expect(el.find('TextField').props().value).to.equal('Hello World');
  });

  it('Should test the dropdown input: choose3', () =>
  {
    const schema = {
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

    expect(el.find('DropDownMenu')).length(1);
    expect(el.find('SelectField')).length(1);
    expect(el.find('SelectField').props().className).to.equal(undefined);
    expect(el.find('SelectField').props().id).to.equal(undefined);
    expect(el.find('SelectField').props().floatingLabelText).to.equal('Choose a number');
    expect(el.find('SelectField').props().defaultValue).to.equal('');
    expect(el.find('SelectField').props().value).to.equal('');

    expect(el.find('SelectField').props().children).length(3);
    expect(el.find('SelectField').props().children[0].props.value).to.equal('1');
    expect(el.find('SelectField').props().children[0].props.label).to.equal('One');
    expect(el.find('SelectField').props().children[0].props.primaryText).to.equal('One');
    expect(el.find('SelectField').props().children[1].props.value).to.equal('2');
    expect(el.find('SelectField').props().children[1].props.label).to.equal('Two');
    expect(el.find('SelectField').props().children[2].props.value).to.equal('3');
    expect(el.find('SelectField').props().children[2].props.label).to.equal('Three');

    schema.choose3.materialForm.selectOptions = {id: 'myIdValue', className: 'theClassValue'};
    el.setProps({schema});
    expect(el.find('SelectField').props().className).to.equal('theClassValue');
    expect(el.find('SelectField').props().id).to.equal('myIdValue');

    schema.choose3.defaultValue = '2';
    el.setProps({schema});
    expect(el.find('SelectField').props().defaultValue).to.equal('2');
    expect(el.find('SelectField').props().value).to.equal('2');

    el.setState({choose3_fieldValue: '3'});
    expect(el.find('SelectField').props().value).to.equal('3');

    el.find('SelectField').props().onChange(null, null, '1');
    expect(el.state().choose3_fieldValue).to.equal('1');
    expect(el.find('SelectField').props().value).to.equal('1');
  });

  it('It should display the errors component', () =>
  {
    const el = mount(
      <ReactAutoForm
        errors={errors}
        muiTheme={true}
        onSubmit={onSubmit}
        schema={HelpDeskSchema}
        type="insert"
      />
    );

    expect(el.find('Errors')).length('1');
    expect(el.find('h3').text()).to.equal('There was an error submitting the form:');
  });
});

const onSubmit = sinon.spy();

const doc = {
  _id: 'document_ID_10',
  agree: true,
  birthday: new Date('Mon Oct 13 2014 00:00:00 GMT+0100 (BST)'),
  choose3: 2,
  description: 'My long description',
  favoritePositiveInteger: 1,
  name: 'My Name',
  reoccurringProblem: false,
  skyColour: 'red'
};

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

const errors = [
  {
    name: 'name',
    type: 'required',
    value: null,
    message: 'Name is required'
  }
];
