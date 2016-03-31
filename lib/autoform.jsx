/**
 * Created by josh.welham on 15/03/2016.
 */

const React = require('react');
const DatePicker = require('material-ui/lib/date-picker/date-picker');
const TextField = require('material-ui/lib/text-field');
const Toggle = require('material-ui/lib/toggle');
const Checkbox = require('material-ui/lib/checkbox');
import SelectFieldInput from './selectField.jsx';
import RadioFieldInput from './radioField.jsx';
// import RaisedButton from 'material-ui/lib/raised-button';
const RaisedButton = require('material-ui/lib/raised-button');
//const SelectField = require('material-ui/lib/select-field');
//const MenuItem = require('material-ui/lib/menus/menu-item');
//const Fields = require('./fields.jsx');

// Extend the schema to allow our materfialForm object
SimpleSchema.extendOptions({
  materialForm: Match.Optional(Object)
});

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
const Fields = class {
	/**
   * Start here by passing through the props from a React component
   * @param schema
   * @returns {Array}
   */
  static processFields(schema) {
    this.schema = schema;
    const components = []; // Each schema field will have a component and will be stored here as an array

    _.each(this.schema, (field, key) => { // Loop through each field in the schema
      components.push(this.processField(field, key)); // Build and get the Material-UI component
    });

    components.push(this.submitButton());

    return components; // Return all the components we've created
  }

	/**
   * Process each field from the schema
   * @param field
   * @param key
   * @returns {*}
   */
  static processField(field, key) {
    this.field = field;
    this.key = key;
    this.field.label = this.field.label ? this.field.label : key; // DEVELOPMENT ONLY
    this.createDefaultAttr();

    if(this.field.allowedValues) // If we're restricting the values to a list it's a dropdown
    {
      switch(this.field.materialForm.switcher)
      {
        case 'Radio':
          return this.componentRadio();
          break;

        default:
          return this.typeDropdown();
          break;
      }
    }

    switch(this.field.type.name) // Switch between what type of field it is to use different types of Material -UI component
    {
      case 'Date':
        return this.typeDate();
        break;

      case 'Number':
        return this.typeNumber();
        break;

      case 'Boolean':
        return this.typeCheckbox();
        break;

      case 'String':
        return this.typeString();
        break;
    }
  }

	/**
   * Translate the SimpleSchema top-level attributes to Material-UI attributes
   * This is so the developer doesn't have to write the
   */
  static createDefaultAttr() {
    this.attributes = {}; // These will be overwritten if it's repeated in the materialForm object (ie `materialForm.floatingLabelText`)
    this.attributes.name = this.key;
    this.getSchemaValue('label', 'floatingLabelText');
    this.getSchemaValue('max', 'maxLength');
    //this.getSchemaValue('defaultValue', 'value');
    this.getSchemaMaterialForm();

    this.field.materialForm = this.field.materialForm ? this.field.materialForm : {};
  }

  /**
   * Store all of the `materialForm` attributes
   */
  static getSchemaMaterialForm() {
    _.each(this.field.materialForm, (value, key) => { // For each `materialForm` field
      this.attributes[key] = value; // Store it in our component attributes
    });
  }

  /**
   *
   * @param fieldColumn
   * @param materialField
   */
  static getSchemaValue(fieldColumn, materialField = fieldColumn) {
    this.attributes[materialField] = this.field[fieldColumn] ? this.field[fieldColumn] : null; // If the `fieldColumn` exists, store it in our `materialField` attributes otherwise null
  }

	/**
   * Remove an attributes value by Nulling it
   * @param field
   */
  static removeMaterialSchemaValue(field)  {
    this.attributes[field] = null;
  }

	/**
   * Move a value to our new field and then remove the original field by Nulling it
   * @param newField
   * @param oldField
   */
  static moveMaterialSchemaValue(newField, oldField) {
    this.attributes[newField] = this.attributes[oldField]; // Copy the oldField value to the newField value
    this.attributes[oldField] = null; // And now remove the oldField by Nulling
  }

	/**
   * A normal string field
   * @returns {XML}
   */
  static typeString() {
    if(this.field.materialForm.switcher)
    {
      return this.typeCheckbox();
    }

    // We don't need to change anything here so go straight to the input text
    return this.componentTextField();
  }

	/**
   * Date component
   * http://www.material-ui.com/#/components/date-picker
   * @returns {XML}
   */
  static typeDate() {
    this.moveMaterialSchemaValue('hintText', 'floatingLabelText');

    return (
      <div key={this.key}>
        <DatePicker {...this.attributes} />
      </div>
    )
  }

	/**
   * Input type number
   * @returns {XML}
   */
  static typeNumber() {
    this.attributes.type = 'number'; // Change the input type to number
    this.getSchemaValue('max'); // Set the max [and min] of the number input
    this.getSchemaValue('min');

    return this.componentTextField();
  }

	/**
   * Logic to get the correct checkbox type component
   * @returns {XML}
   */
  static typeCheckbox() {
    this.moveMaterialSchemaValue('label', 'floatingLabelText');

    switch(this.field.materialForm.switcher)
    {
      case 'Toggle':
        this.removeMaterialSchemaValue('switcher');
        return this.componentToggle();
        break;

      case 'Checkbox':
      default:
        this.removeMaterialSchemaValue('switcher');
        return this.componentCheckbox();
        break;
    }
  }

	/**
   *
   * @returns {XML}
   */
  static typeDropdown() {
    this.attributes.selectOptions = this.attributes.selectOptions ? this.attributes.selectOptions : {};
    this.attributes.selectOptions.floatingLabelText = this.attributes.floatingLabelText;

    const options = _.map(this.attributes.options ? this.attributes.options : this.field.allowedValues, (item, key) => {
      if(typeof item === 'object')
      {
        item.value = item.value.toString();
        return item;
      }
      else
      {
        return {label: item, value: item.toString()};
      }
    });

    return (
      <SelectFieldInput inputKey={this.key} options={options} selectOptions={this.attributes.selectOptions} />
    );
  }

	/**
   * This will be used for either a text, password, number or textarea input field
   * http://www.material-ui.com/#/components/text-field
   * @returns {XML}
   */
  static componentTextField() {
    return (
      <div key={this.key}>
        <TextField {...this.attributes} />
        <br />
      </div>
    );
  }

	/**
   * Toggle component
   * http://www.material-ui.com/#/components/toggle
   * @returns {XML}
   */
  static componentToggle() {
    return (
      <div key={this.key}>
        <Toggle {...this.attributes} />
      </div>
    );
  }


  /**
   * Checkbox component
   * http://www.material-ui.com/#/components/checkbox
   * @returns {XML}
   */
  static componentCheckbox() {
    return (
      <div key={this.key}>
        <Checkbox {...this.attributes} />
      </div>
    );
  }

  static componentRadio() {
    this.attributes.groupOptions = this.attributes.groupOptions ? this.attributes.groupOptions : {};

    const options = _.map(this.attributes.options ? this.attributes.options : this.field.allowedValues, (item, key) => {
      if(typeof item === 'object')
      {
        item.value = item.value.toString();
        return item;
      }
      else
      {
        return {label: item, value: item.toString()};
      }
    });

    return (
      <RadioFieldInput inputKey={this.key} floatingLabelText={this.attributes.floatingLabelText} options={options} groupOptions={this.attributes.groupOptions} />
    );
  }

  static submitButton() {
    return (
      <RaisedButton type="submit" className="button-submit" label='Submit' primary={true} />
    )
  }

  static getFields(props) {
    this.schema = props.collection._c2._simpleSchema._schema; // Using the provided Collection object, get the simpleSchema object
    const components = []; // Each schema field will have a component and will be stored here as an array

    if(props.useFields) // If we're selecting which fields to use
    {
      this.schema = _.reject(this.schema, (field, key) => { // Reject (ie remove) this field from the schema by returning boolean
        return !_.contains(props.useFields, key); // Check if this key is inside our useFields prop
      });
    }

    return this.schema;
  }
};

class ReactAutoForm extends React.Component {
  handleSubmit(event) {
    event.preventDefault();
    
    console.log(this.schema);
  }

  getFields() {
    this.schema = Fields.getFields(this.props);
  }

  render() {
    if(!this.props.collection)
    {
      console.log('You must provide a collection for the form to use! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform');
      console.trace();
      return (<div></div>);
    }

    this.getFields();
    console.log(this.schema);

    return (
      <div>
        <form className={this.props.formClass ? this.props.formClass : 'autoform_' + this.props.collection._name} onSubmit={this.handleSubmit.bind(this)}>
          {Fields.processFields(this.schema)}
        </form>
      </div>
    )
  };
}

export default ReactAutoForm;
