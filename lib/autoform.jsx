/**
 * Created by josh.welham on 15/03/2016.
 */

const React = require('react');
const DatePicker = require('material-ui/lib/date-picker/date-picker');
const TextField = require('material-ui/lib/text-field');
const Toggle = require('material-ui/lib/toggle');
const Checkbox = require('material-ui/lib/checkbox');
import RadioFieldInput from './radioField.jsx';
const SelectField = require('material-ui/lib/select-field');
const MenuItem = require('material-ui/lib/menus/menu-item');
// import RaisedButton from 'material-ui/lib/raised-button';
const RaisedButton = require('material-ui/lib/raised-button');
//const SelectField = require('material-ui/lib/select-field');
//const MenuItem = require('material-ui/lib/menus/menu-item');
//const Fields = require('./fields.jsx');

// Extend the schema to allow our materfialForm object
// SimpleSchema.extendOptions({
//   materialForm: Match.Optional(Object)
// });

/**
 * Class to translate SimpleSchema to Material-UI fields
 * @type {{
 *  typeCheckbox: (function(): XML),
 *  typeString: (function(): XML),
 *  typeNumber: (function(): XML),
 *  createDefaultAttr: (function()),
 *  componentToggle: (function(): XML),
 *  typeDate: (function(): XML),
 *  removeMaterialSchemaValue: (function(*)),
 *  componentRadio: (function()),
 *  componentTextField: (function(): XML),
 *  typeDropdown: (function(): XML),
 *  processFields: (function(*): Array),
 *  moveMaterialSchemaValue: (function(*, *)),
 *  getSchemaMaterialForm: (function()),
 *  getSchemaValue: (function(*, *=)),
 *  componentCheckbox: (function(): XML),
 *  processField: (function(*, *): *)
 * }}
 */

class ReactAutoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fields = {};
    this.getFields();
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
    this.fields[fieldName].attributes.selectOptions.defaultValue = this.fields[fieldName].defaultValue;
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
    this.fields[fieldName].attributes.defaultValue = this.fields[fieldName].defaultValue;
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
          [`${fieldName}_fieldValue`]: this.fields[fieldName].defaultValue
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
    this.fields[fieldName].attributes.defaultChecked = this.fields[fieldName].defaultValue;
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
    this.fields[fieldName].attributes.groupOptions = this.fields[fieldName].attributes.groupOptions ? this.fields[fieldName].attributes.groupOptions : {};
    this.fields[fieldName].attributes.groupOptions.valueSelected = this.getStateOrDefaultSchemaValue(fieldName, '');
    this.fields[fieldName].attributes.groupOptions.onChange = (e, value) => {
        this.setState({
          [`${fieldName}_fieldValue`]: value
        });
    };

    return (
      <RadioFieldInput
        inputKey={this.fields[fieldName].key}
        floatingLabelText={this.fields[fieldName].attributes.floatingLabelText}
        options={this.getSchemaAllowValues(fieldName)}
        groupOptions={this.fields[fieldName].attributes.groupOptions}
      />
    );
  }

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

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      processingForm: true
    });

    const forumFields = {};

    Object.keys(this.schema).map((fieldName) => {
      if(typeof this.state[`${fieldName}_fieldValue`] !== 'undefined')
      {
        forumFields[fieldName] = this.getStateOrDefaultSchemaValue(fieldName);
      }

      this.setState({
        [`${fieldName}_fieldError`]: null
      });
    });

    if(this.props.type === 'update')
    {
      this.submitUpdateDocument(forumFields);
    }
    else
    {
      this.submitInsertDocument(forumFields);
    }
  }

  submitUpdateDocument(forumFields) {
    if(Object.keys(forumFields).length === 0)
    {
      this.log(`Attempting to update "${this.props.doc._id}" with a blank forum`);
      return;
    }

    this.props.collection.update(this.props.doc._id, {$set: forumFields}, (err, res) => {
      if(err)
      {
        this.log(`Error updating "${this.props.doc._id}"`, forumFields);
        if(err.invalidKeys)
        {
          // this.log(err.invalidKeys); // All the errors found in the form
          this.setState({
            [`${err.invalidKeys[0].name}_fieldError`]: err.message
          });
        }
        else
        {
          this.log(err);
        }
      }
      else
      {
        this.log(`Updated "${this.props.doc._id}"`, forumFields);
      }

      this.setState({
        processingForm: false
      });

      return res;
    });
  }

  submitInsertDocument(forumFields) {
    this.props.collection.insert(forumFields, (err, res) => {
      if(err)
      {
        this.log(`Error inserting forum`, forumFields);
        if(err.invalidKeys)
        {
          // this.log(err.invalidKeys); // All the errors found in the form
          this.setState({
            [`${err.invalidKeys[0].name}_fieldError`]: err.message
          });
        }
        else
        {
          this.log(err);
        }

        this.setState({
          processingForm: false
        });
      }
      else
      {
        this.log(`Inserted forum`, forumFields);
        this.resetForm();
      }

      return res;
    });
  }

  log(...msg) {
    if(this.props.debug)
    {
      console.log(...msg);
    }
  }

  resetForm() {
    const changeStates = {
      processingForm: false
    };

    Object.keys(this.schema).map((fieldName) => {
      changeStates[`${fieldName}_fieldValue`] = null;
    });

    this.setState(changeStates);
  }

  getStateOrDefaultSchemaValue(fieldName, ourDefaultValue) {
    if(typeof this.state[`${fieldName}_fieldValue`] !== 'undefined' && this.state[`${fieldName}_fieldValue`] !== null)
    {
      return this.state[`${fieldName}_fieldValue`];
    }
    else if(this.props.type === 'update' && typeof this.props.doc[fieldName] !== 'undefined' && this.props.doc[fieldName] !== null)
    {
      if(!isNaN(parseFloat(this.props.doc[fieldName])) && isFinite(this.props.doc[fieldName]))
      {
        return this.props.doc[fieldName].toString();
      }
      else
      {
        return this.props.doc[fieldName];
      }
    }
    else
    {
      return typeof this.fields[fieldName].defaultValue !== 'undefined' ? this.fields[fieldName].defaultValue : ourDefaultValue;
    }
  }

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

  forumClass() {
    return this.props.formClass ? this.props.formClass : `autoform_${this.props.collection._name}`;
  }

  render() {
    if(!this.props.collection)
    {
      this.log(`You must provide a collection for the form to use! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform`);
      return (<div></div>);
    }
    else if(this.props.type === 'update' && !this.props.doc)
    {
      this.log(`If you wish to update a document you must provide the document in the \`doc\` ReactAutoForm parameter)! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform`);
      return (<div></div>);
    }

    console.log('schema', this.schema);

    return (
      <form className={this.forumClass} onSubmit={this.handleSubmit.bind(this)}>
        {
          Object.keys(this.schema).map((fieldName) => { // Loop through each schema object
            return this.processField(this.schema[fieldName], fieldName); // Return the form element
          })
        }
        <RaisedButton type="submit" className="button-submit" label='Submit' primary={true} onClick={this.handleSubmit.bind(this)} disabled={this.state.processingForm} />
      </form>
    )
  }
}

export default ReactAutoForm;
