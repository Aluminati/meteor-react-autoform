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
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

/**
 * Class to translate SimpleSchema to Material-UI fields
 */
class ReactAutoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fields = {};
    this.getFields();
    this.checkPropsDefined();
  }

  checkPropsDefined() {
    if(!this.props.collection)
    {
      this.log(false, `You must provide a collection for the form to use! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform`);
      this.failedRun = true;
    }
    else if(this.props.type === 'update' && !this.props.doc)
    {
      if(this.props.docId)
      {
        this.failedRun = true;
      }
      else
      {
        this.log(false, `If you wish to update a document you must provide the document in the \`doc\` prop! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform`);
        this.failedRun = true;
      }
    }
    else if(['insert', 'update'].indexOf(this.props.type) === -1)
    {
      this.log(false, `You must provide a type prop (either \`insert\` or \`update\`)! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform`);
      this.failedRun = true;
    }
  }

	/**
   * Process each field from the schema
   * @param field
   * @param fieldName
   * @returns {*}
   */
  processField(field, fieldName) {
    this.fields[fieldName] = field;
    this.fields[fieldName].key = fieldName;
    //this.fields[fieldName].label = field.label ? field.label : fieldName; // DEVELOPMENT ONLY
    this.createDefaultAttr(fieldName);

    if(this.fields[fieldName].allowedValues) // If we're restricting the values to a list it's a dropdown
    {
      switch(this.fields[fieldName].materialForm.switcher)
      {
        case 'Radio':
          return this.componentRadio(fieldName);
          break;

        default:
          return this.typeDropdown(fieldName);
          break;
      }
    }

    switch(this.fields[fieldName].type.name) // Switch between what type of field it is to use different types of Material -UI component
    {
      case 'Date':
        return this.typeDate(fieldName);
        break;

      case 'Number':
        return this.typeNumber(fieldName);
        break;

      case 'Boolean':
        return this.typeCheckbox(fieldName);
        break;

      case 'String':
        return this.typeString(fieldName);
        break;
    }
  }

	/**
   * Translate the SimpleSchema top-level attributes to Material-UI attributes
   * This is so the developer doesn't have to write the
   * @param fieldName
   */
  createDefaultAttr(fieldName) {
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
  getSchemaMaterialForm(fieldName) {
    this.fields[fieldName].materialForm = this.fields[fieldName].materialForm ? this.fields[fieldName].materialForm : {};

    Object.keys(this.fields[fieldName].materialForm).map((key) => { // For each `materialForm` field
      this.fields[fieldName].attributes[key] = this.fields[fieldName].materialForm[key]; // Store it in our component attributes
    });
  }

  /**
   *
   * @param fieldName
   * @param fieldColumn
   * @param materialField
   */
  getSchemaValue(fieldName, fieldColumn, materialField = fieldColumn) {
    this.fields[fieldName].attributes[materialField] = typeof this.fields[fieldName][fieldColumn] !== 'undefined' ? this.fields[fieldName][fieldColumn] : null; // If the `fieldColumn` exists, store it in our `materialField` attributes otherwise null
  }

	/**
   * Remove an attributes value by Nulling it
   * @param fieldName
   * @param field
   */
  removeMaterialSchemaValue(fieldName, field)  {
    this.fields[fieldName].attributes[field] = null;
  }

	/**
   * Move a value to our new field and then remove the original field by Nulling it
   * @param fieldName
   * @param newField
   * @param oldField
   */
  moveMaterialSchemaValue(fieldName, newField, oldField) {
    this.fields[fieldName].attributes[newField] = this.fields[fieldName].attributes[oldField]; // Copy the oldField value to the newField value
    this.fields[fieldName].attributes[oldField] = null; // And now remove the oldField by Nulling
  }

	/**
   * A normal string field
   * @param fieldName
   * @returns {XML}
   */
  typeString(fieldName) {
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
  typeDate(fieldName) {
    this.moveMaterialSchemaValue(fieldName, 'hintText', 'floatingLabelText');

    this.fields[fieldName].attributes.defaultDate = this.fields[fieldName].defaultValue;
    this.fields[fieldName].attributes.value = this.getStateOrDefaultSchemaValue(fieldName, '');
    this.fields[fieldName].attributes.onChange = (e, date) => {
      this.setState({
        [`${fieldName}_fieldValue`]: date
      });
    };

    return (
      <div key={this.fields[fieldName].key}>
        <DatePicker {...this.fields[fieldName].attributes} />
      </div>
    )
  }

	/**
   * Input type number
   * @param fieldName
   * @returns {XML}
   */
  typeNumber(fieldName) {
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
  typeCheckbox(fieldName) {
    this.moveMaterialSchemaValue(fieldName, 'label', 'floatingLabelText');

    switch(this.fields[fieldName].materialForm.switcher)
    {
      case 'Toggle':
        this.removeMaterialSchemaValue(fieldName, 'switcher');
        return this.componentToggle(fieldName);
        break;

      case 'Checkbox':
      default:
        this.removeMaterialSchemaValue(fieldName, 'switcher');
        return this.componentCheckbox(fieldName);
        break;
    }
  }

	/**
   *
   * @param fieldName
   * @returns {XML}
   */
  typeDropdown(fieldName) {
    const options = this.getSchemaAllowValues(fieldName);
    this.fields[fieldName].attributes.selectOptions = this.fields[fieldName].attributes.selectOptions ? this.fields[fieldName].attributes.selectOptions : {};
    this.fields[fieldName].attributes.selectOptions.floatingLabelText = this.fields[fieldName].attributes.floatingLabelText;
    this.fields[fieldName].attributes.selectOptions.errorText = this.state[`${fieldName}_fieldError`];
    this.fields[fieldName].attributes.selectOptions.defaultValue = this.getSchemaDefaultValue(fieldName, '');
    this.fields[fieldName].attributes.selectOptions.value = this.getStateOrDefaultSchemaValue(fieldName, '');
    this.fields[fieldName].attributes.selectOptions.onChange = (e, index, value) => {
      this.setState({
        [`${fieldName}_fieldValue`]: value
      });
    };

    return (
      <SelectField {...this.fields[fieldName].attributes.selectOptions}>
        {
          Object.keys(options).map((i) => {
            return (
              <MenuItem key={options[i].value} value={options[i].value} label={options[i].label} primaryText={options[i].label}/>
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
  componentTextField(fieldName) {
    this.fields[fieldName].attributes.errorText = this.state[`${fieldName}_fieldError`];
    this.fields[fieldName].attributes.value = this.getStateOrDefaultSchemaValue(fieldName, '');
    this.fields[fieldName].attributes.onChange = (e) => {
      if(e.target.value !== '')
      {
        this.setState({
          [`${fieldName}_fieldValue`]: e.target.value
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
  componentToggle(fieldName) {
    this.fields[fieldName].attributes.defaultToggled = this.fields[fieldName].defaultValue;
    this.fields[fieldName].attributes.toggled = this.getStateOrDefaultSchemaValue(fieldName, false);
    this.fields[fieldName].attributes.onToggle = (e) => {
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
  componentCheckbox(fieldName) {
    // this.fields[fieldName].attributes.defaultChecked = this.fields[fieldName].defaultValue;
    this.fields[fieldName].attributes.checked = this.getStateOrDefaultSchemaValue(fieldName, false);
    this.fields[fieldName].attributes.onCheck = (e) => {
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
  componentRadio(fieldName) {
    const options = this.getSchemaAllowValues(fieldName);
    this.fields[fieldName].attributes.groupOptions = this.fields[fieldName].attributes.groupOptions ? this.fields[fieldName].attributes.groupOptions : {};
    this.fields[fieldName].attributes.groupOptions.name = this.fields[fieldName].key;
    this.fields[fieldName].attributes.groupOptions.valueSelected = this.getStateOrDefaultSchemaValue(fieldName, '');
    this.fields[fieldName].attributes.groupOptions.onChange = (e, value) => {
        this.setState({
          [`${fieldName}_fieldValue`]: value
        });
    };

    return (
      <div key={this.fields[fieldName].key}>
        <label>{this.fields[fieldName].attributes.floatingLabelText}</label>
        <RadioButtonGroup {...this.fields[fieldName].attributes.groupOptions}>
          {
            Object.keys(options).map((i) => {
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
  getSchemaAllowValues(fieldName) {
    const allowedValues = this.fields[fieldName].attributes.options ? this.fields[fieldName].attributes.options : this.fields[fieldName].allowedValues;

    return Object.keys(allowedValues).map((key) => {
      if(typeof allowedValues[key] === 'object')
      {
        allowedValues[key].value = allowedValues[key].value.toString();
        return allowedValues[key];
      }
      else
      {
        return {label: allowedValues[key], value: allowedValues[key].toString()};
      }
    });
  }

	/**
   * Submit handler - Submit button was clicked or enter was pressed
   * @param event
   */
  handleSubmit(event) {
    event.preventDefault();

    if(this.state.processingForm) // If we're already processing we don't need to submit again
    {
      return;
    }

    // This will disable duplicated submits
    this.setState({
      processingForm: true
    });

    const forumFields = {};

    // Loop through each schema object to build the $forumFields which is then used to submit the form
    Object.keys(this.schema).map((fieldName) => {
      if(typeof this.state[`${fieldName}_fieldValue`] !== 'undefined')
      {
        forumFields[fieldName] = this.getStateOrDefaultSchemaValue(fieldName); // Gets the state value
      }

      // Reset the error if there is one
      this.setState({
        [`${fieldName}_fieldError`]: null
      });
    });

    if(this.props.type === 'update') // If we're updating a document
    {
      this.submitUpdateDocument(forumFields);
    }
    else // Or inserting a new document
    {
      this.submitInsertDocument(forumFields);
    }
  }

	/**
   * Update an existing document
   * @param forumFields
   */
  submitUpdateDocument(forumFields) {
    if(Object.keys(forumFields).length === 0) // If there is nothing to submit quit now
    {
      this.setState({
        processingForm: false
      });
      this.log(false, `Attempting to update \`${this.props.doc._id}\` with a blank forum`);
      return;
    }

    // Update the document with $forumFields
    this.props.collection.update(this.props.doc._id, {$set: forumFields}, (err, res) => {
      if(err) // If there was an error
      {
        this.log(false, `Error updating \`${this.props.doc._id}\``, forumFields);
        this.handleSubmitError(err);
      }
      else
      {
        this.log(false, `Updated \`${this.props.doc._id}\``, forumFields);
      }

      // Finished processing so allow submitting again
      this.setState({
        processingForm: false
      });

      return res;
    });
  }

	/**
   * Insert a new document
   * @param forumFields
   */
  submitInsertDocument(forumFields) {
    // Insert a new document
    this.props.collection.insert(forumFields, (err, res) => {
      if(err) // If there was an error
      {
        this.log(false, `Error inserting forum`, forumFields);
        this.handleSubmitError(err);

        this.setState({
          processingForm: false
        });
      }
      else
      {
        this.log(false, `Inserted forum`, forumFields);

        if(this.props.onSubmit) // If we have a onSubmit function from the props
        {
          this.props.onSubmit(res); // Run it - and pass the created docId to it
        }
        else // Otherwise
        {
          this.resetForm(); // Reset the forum to blank
        }
      }

      return res;
    });
  }

	/**
   * There was an error in either submitting or inserting a document, handle it here
   * @param err
   */
  handleSubmitError(err) {
    if(err.invalidKeys)
    {
      // this.log(false, err.invalidKeys); // All the errors found in the form
      // Update the input to slash the error
      this.setState({
        [`${err.invalidKeys[0].name}_fieldError`]: err.message
      });
    }
    else
    {
      // Some error we don't know about!
      this.log(true, err);
    }
  }

	/**
   * Console.log
   * @param force
   * @param msg
   */
  log(force, ...msg) {
    if(force || this.props.debug)
    {
      console.log(...msg);
    }
  }

	/**
   * Reset the entire forum to default
   */
  resetForm() {
    const changeStates = {
      processingForm: false
    };

    Object.keys(this.schema).map((fieldName) => {
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
  getStateOrDefaultSchemaValue(fieldName, ourDefaultValue, ignoreState = false) {
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
      else
      {
        // Return normal document String
        return this.props.doc[fieldName];
      }
    }
    else // Else just return the Schema default value OR my hard-coded default value
    {
      return typeof this.fields[fieldName].defaultValue !== 'undefined' ? this.fields[fieldName].defaultValue : ourDefaultValue;
    }
  }

  getSchemaDefaultValue(fieldName, ourDefaultValue) {
    return typeof this.fields[fieldName].defaultValue !== 'undefined' ? this.fields[fieldName].defaultValue : ourDefaultValue;
  }

	/**
   * Gets the Schema object and then removes anything that the `props.useFields` hasn't declared
   */
  getFields() {
    this.schema = this.props.collection._c2._simpleSchema._schema; // Using the provided Collection object, get the simpleSchema object

    if(this.props.useFields) // If we're selecting which fields to use
    {
      Object.keys(this.schema).filter((fieldName) => { // Filter (ie remove) this field from the schema by returning boolean
        if(this.props.useFields.indexOf(fieldName) === -1) // If this fieldName does not exist in the useFields array
        {
          delete this.schema[fieldName]; // We remove it from the forum schema
        }
      });
    }
  }

	/**
   * Get the forum class or use default class name
   * @returns {string}
   */
  forumClass() {
    return this.props.formClass ? this.props.formClass : `autoform_${this.props.collection._name}`;
  }

  render() {
    if(this.failedRun) // If there was an error
    {
      return (<div></div>); // Return blank
    }

    return (
      <form className={this.forumClass()} onSubmit={this.handleSubmit.bind(this)}>
        {
          Object.keys(this.schema).map((fieldName) => { // Loop through each schema object
            return this.processField(this.schema[fieldName], fieldName); // Return the form element
          })
        }
        <RaisedButton type="submit" className="button-submit" label='Submit' primary={true} disabled={this.state.processingForm} />
      </form>
    )
  }
}

export default ReactAutoForm;
