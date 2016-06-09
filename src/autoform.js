/**
 * Created by josh.welham on 15/03/2016.
 */

import React from 'react';
import Errors from './errors';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

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

  processErrors()
  {
    this.mappedErrors = {};

    if(this.props.errors)
    {
      this.props.errors.map((error) =>
      {
        this.mappedErrors[error.name] = error.message;
      });
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
    this.fields[fieldName] = field;
    this.fields[fieldName].key = fieldName;
    this.createDefaultAttr(fieldName);
    let component;

    if(this.fields[fieldName].allowedValues) // If we're restricting the values to a list it's a dropdown
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

      return component;
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

	/**
   * Translate the SimpleSchema top-level attributes to Material-UI attributes
   * This is so the developer doesn't have to write the
   * @param fieldName
   */
  createDefaultAttr(fieldName)
  {
    this.fields[fieldName].attributes = {}; // These will be overwritten if it's repeated in the materialForm object (ie `materialForm.floatingLabelText`)
    this.fields[fieldName].attributes.name = fieldName;
    this.getSchemaValue(fieldName, 'label', 'floatingLabelText');
    this.getSchemaValue(fieldName, 'max', 'maxLength');
    this.getSchemaMaterialForm(fieldName);

    this.fields[fieldName].materialForm = this.fields[fieldName].materialForm ? this.fields[fieldName].materialForm : {};
  }

  /**
   * Store all of the `materialForm` attributes
   * @param fieldName
   */
  getSchemaMaterialForm(fieldName)
  {
    this.fields[fieldName].materialForm = this.fields[fieldName].materialForm ? this.fields[fieldName].materialForm : {};

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
      return this.typeCheckbox(fieldName);
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
      <div key={this.fields[fieldName].key}>
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
    selectOptions.errorText = this.mappedErrors[fieldName];
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
    this.fields[fieldName].attributes.errorText = this.mappedErrors[fieldName];
    this.fields[fieldName].attributes.value = this.getStateOrDefaultSchemaValue(fieldName, '');
    this.fields[fieldName].attributes.onChange = (e) =>
    {
      if(e.target.value !== '')
      {
        this.setState({
          [`${fieldName}_fieldValue`]: this.fields[fieldName].attributes.type ? Number(e.target.value) : e.target.value
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
      <div key={this.fields[fieldName].key}>
        <TextField {...this.fields[fieldName].attributes} />
        <br />
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
      <div key={this.fields[fieldName].key}>
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
      <div key={this.fields[fieldName].key}>
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
      <div key={this.fields[fieldName].key}>
        <label>{this.fields[fieldName].attributes.floatingLabelText}</label>
        <RadioButtonGroup {...groupOptions}>
          {
            Object.keys(options).map((i) =>
            {
              return (
                <RadioButton key={options[i].value} {...options[i]} />
              );
            })
          }
        </RadioButtonGroup>
      </div>
    );
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

    return Object.keys(allowedValues).map((key) =>
    {
      if(typeof allowedValues[key] === 'object')
      {
        allowedValues[key].value = allowedValues[key].value.toString();
        return allowedValues[key];
      }

      return {label: allowedValues[key], value: allowedValues[key].toString()};
    });
  }

	/**
   * Submit handler - Submit button was clicked or enter was pressed
   * @param event
   */
  handleSubmit(event)
  {
    event.preventDefault();

    const forumFields = {};

    // Loop through each schema object to build the $forumFields which is then used to submit the form
    Object.keys(this.props.schema).map((fieldName) =>
    {
      if(typeof this.state[`${fieldName}_fieldValue`] !== 'undefined')
      {
        forumFields[fieldName] = this.getStateOrDefaultSchemaValue(fieldName); // Gets the state value
      }
    });

    if(this.props.doc)
    {
      this.log(false, `Forum submitted \`${this.props.doc._id}\`:`, forumFields);
      this.props.onSubmit(this.props.doc._id, forumFields);
    }
    else
    {
      this.log(false, `Forum submitted:`, forumFields);
      this.props.onSubmit(forumFields);
    }
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
      console.log(...msg);
    }
  }

	/**
   * Reset the entire forum to default
   */
  resetForm()
  {
    const changeStates = {};

    Object.keys(this.props.schema).map((fieldName) =>
    {
      changeStates[`${fieldName}_fieldValue`] = null;
    });

    this.setState(changeStates);
  }

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
   * @returns {*}
   */
  getStateOrDefaultSchemaValue(fieldName, ourDefaultValue = null, ignoreState = false)
  {
    // If the state value exists
    if(typeof this.state[`${fieldName}_fieldValue`] !== 'undefined' && this.state[`${fieldName}_fieldValue`] !== null && !ignoreState)
    {
      // Return the state value
      return this.state[`${fieldName}_fieldValue`];
    }
    // Else if we're updating an existing document and the value exists here
    else if(this.props.type === 'update' && typeof this.props.doc[fieldName] !== 'undefined' && this.props.doc[fieldName] !== null)
    {
      // If it's a number
      if(!isNaN(parseFloat(this.props.doc[fieldName])) && isFinite(this.props.doc[fieldName]))
      {
        // Return it as a String
        return this.props.doc[fieldName].toString();
      }

      return this.props.doc[fieldName];
    }

    // Else just return the Schema default value OR my hard-coded default value
    return typeof this.fields[fieldName].defaultValue !== 'undefined' ? this.fields[fieldName].defaultValue : ourDefaultValue;
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
          this.props.errors ? <Errors errors={this.mappedErrors} style={this.props.errorsStyle} /> : null
        }
        <form className={this.props.formClass} onSubmit={this.handleSubmit}>
          {
            Object.keys(this.props.schema).map((fieldName) =>
            { // Loop through each schema object
              return this.processField(this.props.schema[fieldName], fieldName); // Return the form element
            })
          }
          <RaisedButton className="button-submit" label="Submit" primary={true} type="submit" />
        </form>
      </div>
    );
  }
}

ReactAutoForm.propTypes = {
  debug: React.PropTypes.bool,
  doc: React.PropTypes.object,
  errors: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.array]),
  errorsStyle: React.PropTypes.object,
  formClass: React.PropTypes.string,
  formStyle: React.PropTypes.object,
  onSubmit: React.PropTypes.func.isRequired,
  schema: React.PropTypes.object.isRequired,
  type: React.PropTypes.oneOf(['update', 'insert']).isRequired,
  useFields: React.PropTypes.array
};

ReactAutoForm.defaultProps = {
  debug: false,
  errors: false,
  errorsStyle: {
    // TO DO - I don't know colours
  },
  formClass: 'autoform',
  formStyle: {}
};

export default ReactAutoForm;
