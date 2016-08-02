/**
 * Created by josh.welham on 15/03/2016.
 */

import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Errors from './errors';
import Button from './button';

/**
 * Class to translate SimpleSchema to Material-UI fields
 */
class ReactAutoForm extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {};
    this.fields = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getChildContext()
  {
    if(this.props.muiTheme)
    {
      return {
        muiTheme: getMuiTheme(baseTheme)
      };
    }
  }

  componentWillUpdate(props, state)
  {
    this.stateUpdated(props, state);
  }

  processErrors()
  {
    this.mappedErrors = {};

    if(this.props.errors)
    {
      if(Array.isArray(this.props.errors))
      {
        if(this.props.errors)
        {
          this.props.errors.map(error =>
          {
            this.mappedErrors[error.name] = {message: error.message};
          });
        }
      }
      else
      {
        this.mappedErrors = this.props.errors;
      }
    }
  }

	/**
   * Process each field from the schema
   * @param field
   * @param fieldName
   * @returns {*}
   */
  processField(field, fieldName)
  {
    if(this.props.useFields && this.props.useFields.indexOf(fieldName) === -1)
    {
      return null;
    }

    this.fields[fieldName] = field;
    this.fields[fieldName].key = fieldName;
    this.createDefaultAttr(fieldName);
    let component;

    if(this.fields[fieldName].allowedValues) // If we're restricting the values to a list it's a dropdown
    {
      return this.switchComponent(fieldName);
    }

    switch(this.fields[fieldName].type.name) // Switch between what type of field it is to use different types of Material -UI component
    {
      case 'Date':
        component = this.typeDate(fieldName);
        break;

      case 'Number':
        component = this.typeNumber(fieldName);
        break;

      case 'Boolean':
        component = this.typeCheckbox(fieldName);
        break;

      case 'String':
        component = this.typeString(fieldName);
        break;
    }

    return component;
  }

  switchComponent(fieldName)
  {
    let component;

    if(this.fields[fieldName].attributes && this.fields[fieldName].attributes.options || this.fields[fieldName].allowedValues)
    {
      switch(this.fields[fieldName].materialForm.switcher)
      {
        case 'Radio':
          component = this.componentRadio(fieldName);
          break;

        default:
          component = this.typeDropdown(fieldName);
          break;
      }
    }
    else
    {
      console.error('Autoform Error:',
        `You must provide either '${fieldName}.allowedValues' or '${fieldName}.materialForm.options' to have a Radio or Dropdown component.`);
      component = this.componentTextField(fieldName);
    }

    return component;
  }

	/**
   * Translate the SimpleSchema top-level attributes to Material-UI attributes
   * This is so the developer doesn't have to write the
   * @param fieldName
   */
  createDefaultAttr(fieldName)
  {
    this.fields[fieldName].materialForm = this.fields[fieldName].materialForm ? this.fields[fieldName].materialForm : {};
    this.getFieldParentStyle(fieldName);
    this.fields[fieldName].attributes = {}; // These will be overwritten if it's repeated in the materialForm object (ie `materialForm.floatingLabelText`)
    this.fields[fieldName].attributes.disabled = this.props.disabled;
    this.fields[fieldName].attributes.name = fieldName;
    this.getSchemaValue(fieldName, 'label', 'floatingLabelText');
    this.getSchemaValue(fieldName, 'max', 'maxLength');
    this.getSchemaMaterialForm(fieldName);
  }

  getFieldParentStyle(fieldName)
  {
    if(this.fields[fieldName].materialForm && this.fields[fieldName].materialForm.parentStyle) // If there is a parentStyle
    {
      this.fields[fieldName].parentStyle = {};

      Object.keys(this.fields[fieldName].materialForm.parentStyle).map((key) => // For each `materialForm.parentStyle` field
      {
        this.fields[fieldName].parentStyle[key] = this.fields[fieldName].materialForm.parentStyle[key]; // Store it in our parent component style
      });

      delete this.fields[fieldName].materialForm.parentStyle; // We've stored it in the correct place so delete it so it's not used later
    }
  }

  /**
   * Store all of the `materialForm` attributes
   * @param fieldName
   */
  getSchemaMaterialForm(fieldName)
  {
    Object.keys(this.fields[fieldName].materialForm).map((key) => // For each `materialForm` field
    {
      this.fields[fieldName].attributes[key] = this.fields[fieldName].materialForm[key]; // Store it in our component attributes
    });
  }

  /**
   *
   * @param fieldName
   * @param fieldColumn
   * @param materialField
   */
  getSchemaValue(fieldName, fieldColumn, materialField = fieldColumn)
  {
    // If the `fieldColumn` exists, store it in our `materialField` attributes otherwise null
    if(typeof this.fields[fieldName][fieldColumn] !== 'undefined')
    {
      this.fields[fieldName].attributes[materialField] = this.fields[fieldName][fieldColumn];
      return;
    }

    this.fields[fieldName].attributes[materialField] = null;
  }

	/**
   * Remove an attributes value by Nulling it
   * @param fieldName
   * @param field
   */
  removeMaterialSchemaValue(fieldName, field)
  {
    this.fields[fieldName].attributes[field] = null;
  }

	/**
   * Move a value to our new field and then remove the original field by Nulling it
   * @param fieldName
   * @param newField
   * @param oldField
   */
  moveMaterialSchemaValue(fieldName, newField, oldField)
  {
    this.fields[fieldName].attributes[newField] = this.fields[fieldName].attributes[oldField]; // Copy the oldField value to the newField value
    this.fields[fieldName].attributes[oldField] = null; // And now remove the oldField by Nulling
  }

	/**
   * A normal string field
   * @param fieldName
   * @returns {XML}
   */
  typeString(fieldName)
  {
    if(this.fields[fieldName].materialForm.switcher)
    {
      return this.switchComponent(fieldName);
    }

    // We don't need to change anything here so go straight to the input text
    return this.componentTextField(fieldName);
  }

	/**
   * Date component
   * http://www.material-ui.com/#/components/date-picker
   * @param fieldName
   * @returns {XML}
   */
  typeDate(fieldName)
  {
    this.moveMaterialSchemaValue(fieldName, 'hintText', 'floatingLabelText');

    this.fields[fieldName].attributes.defaultDate = this.fields[fieldName].defaultValue;
    this.fields[fieldName].attributes.value = this.getStateOrDefaultSchemaValue(fieldName, '');
    this.fields[fieldName].attributes.onChange = (e, date) =>
    {
      this.setState({
        [`${fieldName}_fieldValue`]: date
      });
    };

    return (
      <div key={this.fields[fieldName].key} style={this.fields[fieldName].parentStyle}>
        <DatePicker {...this.fields[fieldName].attributes} />
      </div>
    );
  }

	/**
   * Input type number
   * @param fieldName
   * @returns {XML}
   */
  typeNumber(fieldName)
  {
    this.fields[fieldName].attributes.type = 'number'; // Change the input type to number
    this.getSchemaValue(fieldName, 'max'); // Set the max [and min] of the number input
    this.getSchemaValue(fieldName, 'min');

    return this.componentTextField(fieldName);
  }

	/**
   * Logic to get the correct checkbox type component
   * @param fieldName
   * @returns {XML}
   */
  typeCheckbox(fieldName)
  {
    this.moveMaterialSchemaValue(fieldName, 'label', 'floatingLabelText');
    let component;

    switch(this.fields[fieldName].materialForm.switcher)
    {
      case 'Toggle':
        this.removeMaterialSchemaValue(fieldName, 'switcher');
        component = this.componentToggle(fieldName);
        break;

      case 'Checkbox':
      default:
        this.removeMaterialSchemaValue(fieldName, 'switcher');
        component = this.componentCheckbox(fieldName);
        break;
    }

    return component;
  }

	/**
   *
   * @param fieldName
   * @returns {XML}
   */
  typeDropdown(fieldName)
  {
    const options = this.getSchemaAllowValues(fieldName);
    let selectOptions = this.fields[fieldName].attributes.selectOptions;

    selectOptions = selectOptions ? selectOptions : {};
    selectOptions.key = this.fields[fieldName].attributes.name;
    selectOptions.floatingLabelText = this.fields[fieldName].attributes.floatingLabelText;
    selectOptions.errorText = this.getErrorText(fieldName);
    selectOptions.defaultValue = this.getSchemaDefaultValue(fieldName, '');
    selectOptions.value = this.getStateOrDefaultSchemaValue(fieldName, '');
    selectOptions.onChange = (e, index, value) =>
    {
      this.setState({
        [`${fieldName}_fieldValue`]: value
      });
    };

    return (
      <SelectField {...selectOptions}>
        {
          Object.keys(options).map((i) =>
          {
            return (
              <MenuItem key={options[i].value} label={options[i].label} primaryText={options[i].label} value={options[i].value} />
            );
          })
        }
      </SelectField>
    );
  }

	/**
   * This will be used for either a text, password, number or textarea input field
   * http://www.material-ui.com/#/components/text-field
   * @param fieldName
   * @returns {XML}
   */
  componentTextField(fieldName)
  {
    this.fields[fieldName].attributes.errorText = this.getErrorText(fieldName);
    this.fields[fieldName].attributes.value = this.getStateOrDefaultSchemaValue(fieldName, '');
    this.fields[fieldName].attributes.onChange = (e) =>
    {
      if(e.target.value !== '')
      {
        this.setState({
          [`${fieldName}_fieldValue`]: this.fields[fieldName].attributes.type === 'number' ? Number(e.target.value) : e.target.value
        });
      }
      else
      {
        this.setState({
          [`${fieldName}_fieldValue`]: this.getStateOrDefaultSchemaValue(fieldName, '', true)
        });
      }
    };

    return (
      <div key={this.fields[fieldName].key} style={this.fields[fieldName].parentStyle}>
        <TextField {...this.fields[fieldName].attributes} />
      </div>
    );
  }

	/**
   * Toggle component
   * http://www.material-ui.com/#/components/toggle
   * @param fieldName
   * @returns {XML}
   */
  componentToggle(fieldName)
  {
    this.fields[fieldName].attributes.defaultToggled = this.fields[fieldName].defaultValue;
    this.fields[fieldName].attributes.toggled = this.getStateOrDefaultSchemaValue(fieldName, false);
    this.fields[fieldName].attributes.onToggle = (e) =>
    {
      this.setState({
        [`${fieldName}_fieldValue`]: e.target.checked
      });
    };

    return (
      <div key={this.fields[fieldName].key} style={this.fields[fieldName].parentStyle}>
        <Toggle {...this.fields[fieldName].attributes} />
      </div>
    );
  }


  /**
   * Checkbox component
   * http://www.material-ui.com/#/components/checkbox
   * @param fieldName
   * @returns {XML}
   */
  componentCheckbox(fieldName)
  {
    this.fields[fieldName].attributes.checked = this.getStateOrDefaultSchemaValue(fieldName, false);
    this.fields[fieldName].attributes.onCheck = (e) =>
    {
      this.setState({
        [`${fieldName}_fieldValue`]: e.target.checked
      });
    };

    return (
      <div key={this.fields[fieldName].key} style={this.fields[fieldName].parentStyle}>
        <Checkbox {...this.fields[fieldName].attributes} />
      </div>
    );
  }

	/**
   * Radio component
   * http://www.material-ui.com/#/components/radio-button
   * @param fieldName
   * @returns {XML}
   */
  componentRadio(fieldName)
  {
    const options = this.getSchemaAllowValues(fieldName);
    let groupOptions = this.fields[fieldName].attributes.groupOptions;

    groupOptions = groupOptions ? groupOptions : {};
    groupOptions.name = this.fields[fieldName].key;
    groupOptions.valueSelected = this.getStateOrDefaultSchemaValue(fieldName, '');
    groupOptions.onChange = (e, value) =>
    {
      this.setState({
        [`${fieldName}_fieldValue`]: value
      });
    };

    return (
      <div key={this.fields[fieldName].key} style={this.fields[fieldName].parentStyle}>
        <label>{this.fields[fieldName].attributes.floatingLabelText}</label>
        <RadioButtonGroup {...groupOptions}>
          {Object.keys(options).map(i => (
            <RadioButton key={options[i].value} {...options[i]} />
          ))}
        </RadioButtonGroup>
      </div>
    );
  }

  getErrorText(fieldName)
  {
    return this.mappedErrors[fieldName] ? this.mappedErrors[fieldName].message : null;
  }

	/**
   * Get the option values from the schema - Used for radio and select inputs
   * @param fieldName
   * @returns {Array}
   */
  getSchemaAllowValues(fieldName)
  {
    const options = this.fields[fieldName].attributes.options;
    const allowedValues = options ? options : this.fields[fieldName].allowedValues;

    return Object.keys(allowedValues).map(i =>
    {
      let disabled = this.fields[fieldName].attributes.disabled;

      if(typeof allowedValues[i] === 'object')
      {
        allowedValues[i].disabled = disabled;
        allowedValues[i].value = allowedValues[i].value.toString();
        return allowedValues[i];
      }

      return {label: allowedValues[i], value: allowedValues[i].toString(), disabled};
    });
  }

	/**
   * Submit handler - Submit button was clicked or enter was pressed
   * @param event
   */
  handleSubmit(event)
  {
    event.preventDefault();

    const formFields = this.getForumFields();

    if(this.props.doc)
    {
      this.log(false, `Form submitted \`${this.props.doc._id}\`:`, formFields);
      this.props.onSubmit(this.props.doc._id, formFields, this.props.onSubmitExtra);
    }
    else
    {
      this.log(false, `Form submitted:`, formFields);
      this.props.onSubmit(formFields, this.props.onSubmitExtra);
    }
  }

  getForumFields(state = this.state)
  {
    const formFields = {};

    // Loop through each schema object to build the $formFields which is then used to submit the form
    Object.keys(this.props.schema).map((fieldName) =>
    {
      if(typeof state[`${fieldName}_fieldValue`] !== 'undefined' &&
        !(this.props.type === 'insert' && state[`${fieldName}_fieldValue`] === '') &&
        this.getDocumentValue(fieldName) !== this.getStateOrDefaultSchemaValue(fieldName, null, null, state))
      {
        formFields[fieldName] = this.getStateOrDefaultSchemaValue(fieldName, null, null, state); // Gets the state value
      }
    });

    return formFields;
  }

	/**
   * Console.log
   * @param force
   * @param msg
   */
  log(force, ...msg)
  {
    if(force || this.props.debug)
    {
      console.warn(...msg);
    }
  }

	/**
   * Reset the entire form to default
   */
  // resetForm()
  // {
  //   const changeStates = {};
  //
  //   Object.keys(this.props.schema).map((fieldName) =>
  //   {
  //     changeStates[`${fieldName}_fieldValue`] = null;
  //   });
  //
  //   this.setState(changeStates);
  //   this.stateUpdated();
  // }

	/**
   * Used to get an inputs value, it will attempt to return a value that exists (in order):
   *  1. The state value
   *  2. Document value
   *    1. If it's an int, return it as a String value
   *    2. Return normal String value
   *  3. Default value
   * @param fieldName
   * @param ourDefaultValue
   * @param ignoreState
   * @param state
   * @returns {*}
   */
  getStateOrDefaultSchemaValue(fieldName, ourDefaultValue = null, ignoreState = false, state = this.state)
  {
    // If the state value exists
    if(typeof state[`${fieldName}_fieldValue`] !== 'undefined' && state[`${fieldName}_fieldValue`] !== null && !ignoreState)
    {
      // Return the state value
      return state[`${fieldName}_fieldValue`];
    }
    // Else if we're updating an existing document and the value exists here
    else if(this.doesDocumentValueExist(fieldName) && !ignoreState)
    {
      return this.getDocumentValue(fieldName);
    }

    // Else just return the Schema default value OR my hard-coded default value
    return typeof this.fields[fieldName].defaultValue !== 'undefined' ? this.fields[fieldName].defaultValue : ourDefaultValue;
  }

  doesDocumentValueExist(fieldName)
  {
    // If we're updating an existing document and the value exists here
    return this.props.type === 'update' && typeof this.props.doc[fieldName] !== 'undefined' && this.props.doc[fieldName] !== null;
  }

  getDocumentValue(fieldName)
  {
    if(this.doesDocumentValueExist(fieldName))
    {
      // If it's a number
      if(!isNaN(parseFloat(this.props.doc[fieldName])) && isFinite(this.props.doc[fieldName]))
      {
        // Return it as a String
        return this.props.doc[fieldName].toString();
      }

      return this.props.doc[fieldName];
    }

    return false;
  }

  stateUpdated(props, state)
  {
    this.props.buttonProps.disabled = props.disabled ? props.disabled : Object.keys(this.getForumFields(state)).length === 0;
  }

  getSchemaDefaultValue(fieldName, ourDefaultValue)
  {
    return typeof this.fields[fieldName].defaultValue !== 'undefined' ? this.fields[fieldName].defaultValue : ourDefaultValue;
  }

  render()
  {
    this.processErrors();

    return (
      <div>
        {
          this.props.errors ? <Errors errors={this.props.errors} style={this.props.errorsStyle} title={this.props.errorsTitle} /> : null
        }
        <form className={this.props.formClass} onSubmit={this.handleSubmit} style={this.props.formStyle}>
          {
            Object.keys(this.props.schema).map((fieldName) =>
            { // Loop through each schema object
              return this.processField(this.props.schema[fieldName], fieldName); // Return the form element
            })
          }
          {
            this.props.buttonComponent ?
              this.props.buttonComponent :
              <Button
                buttonParentStyle={this.props.buttonParentStyle}
                extraProps={this.props.buttonProps}
                icon={this.props.buttonIcon}
                label={this.props.buttonLabel}
                type={this.props.buttonType}
              />
          }
        </form>
      </div>
    );
  }
}

ReactAutoForm.propTypes = {
  buttonComponent: React.PropTypes.node,
  buttonIcon: React.PropTypes.string,
  buttonLabel: React.PropTypes.string,
  buttonParentStyle: React.PropTypes.object,
  buttonProps: React.PropTypes.object,
  buttonType: React.PropTypes.oneOf(['FlatButton', 'RaisedButton', 'IconButton']),
  debug: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  doc: React.PropTypes.object,
  errors: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.arrayOf(React.PropTypes.shape({
      message: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.string,
      value: React.PropTypes.string
    })),
    React.PropTypes.objectOf(React.PropTypes.shape({
      message: React.PropTypes.string.isRequired,
      type: React.PropTypes.string
    }))
  ]),
  errorsStyle: React.PropTypes.object,
  errorsTitle: React.PropTypes.string,
  formClass: React.PropTypes.string,
  formStyle: React.PropTypes.object,
  muiTheme: React.PropTypes.bool,
  onSubmit: React.PropTypes.func.isRequired,
  onSubmitExtra: React.PropTypes.object,
  schema: React.PropTypes.object.isRequired,
  type: React.PropTypes.oneOf(['update', 'insert']),
  useFields: React.PropTypes.array
};

ReactAutoForm.defaultProps = {
  buttonProps: {},
  debug: false,
  disabled: false,
  errors: false,
  formClass: 'autoform',
  formStyle: {},
  onSubmitExtra: {},
  type: 'insert',
  muiTheme: false
};

ReactAutoForm.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default ReactAutoForm;
