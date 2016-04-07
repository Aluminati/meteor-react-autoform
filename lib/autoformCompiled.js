'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _datePicker = require('material-ui/lib/date-picker/date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

var _textField = require('material-ui/lib/text-field');

var _textField2 = _interopRequireDefault(_textField);

var _toggle = require('material-ui/lib/toggle');

var _toggle2 = _interopRequireDefault(_toggle);

var _checkbox = require('material-ui/lib/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _selectField = require('material-ui/lib/select-field');

var _selectField2 = _interopRequireDefault(_selectField);

var _menuItem = require('material-ui/lib/menus/menu-item');

var _menuItem2 = _interopRequireDefault(_menuItem);

var _raisedButton = require('material-ui/lib/raised-button');

var _raisedButton2 = _interopRequireDefault(_raisedButton);

var _radioButton = require('material-ui/lib/radio-button');

var _radioButton2 = _interopRequireDefault(_radioButton);

var _radioButtonGroup = require('material-ui/lib/radio-button-group');

var _radioButtonGroup2 = _interopRequireDefault(_radioButtonGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
 * Created by josh.welham on 15/03/2016.
 */

/**
 * Class to translate SimpleSchema to Material-UI fields
 */

var ReactAutoForm = function (_React$Component) {
  _inherits(ReactAutoForm, _React$Component);

  function ReactAutoForm(props) {
    _classCallCheck(this, ReactAutoForm);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactAutoForm).call(this, props));

    _this.state = {};
    _this.fields = {};
    _this.getFields();
    _this.checkPropsDefined();
    return _this;
  }

  _createClass(ReactAutoForm, [{
    key: 'checkPropsDefined',
    value: function checkPropsDefined() {
      if (!this.props.collection) {
        this.log(false, 'You must provide a collection for the form to use! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform');
        this.failedRun = true;
      } else if (this.props.type === 'update' && !this.props.doc) {
        if (this.props.docId) {
          this.failedRun = true;
        } else {
          this.log(false, 'If you wish to update a document you must provide the document in the `doc` prop! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform');
          this.failedRun = true;
        }
      } else if (['insert', 'update'].indexOf(this.props.type) === -1) {
        this.log(false, 'You must provide a type prop (either `insert` or `update`)! Please read the documentation https://github.com/MechJosh0/meteor-react-autoform');
        this.failedRun = true;
      }
    }

    /**
     * Process each field from the schema
     * @param field
     * @param fieldName
     * @returns {*}
     */

  }, {
    key: 'processField',
    value: function processField(field, fieldName) {
      this.fields[fieldName] = field;
      this.fields[fieldName].key = fieldName;
      //this.fields[fieldName].label = field.label ? field.label : fieldName; // DEVELOPMENT ONLY
      this.createDefaultAttr(fieldName);

      if (this.fields[fieldName].allowedValues) // If we're restricting the values to a list it's a dropdown
      {
        switch (this.fields[fieldName].materialForm.switcher) {
          case 'Radio':
            return this.componentRadio(fieldName);
            break;

          default:
            return this.typeDropdown(fieldName);
            break;
        }
      }

      switch (this.fields[fieldName].type.name) {// Switch between what type of field it is to use different types of Material -UI component

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

  }, {
    key: 'createDefaultAttr',
    value: function createDefaultAttr(fieldName) {
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

  }, {
    key: 'getSchemaMaterialForm',
    value: function getSchemaMaterialForm(fieldName) {
      var _this2 = this;

      this.fields[fieldName].materialForm = this.fields[fieldName].materialForm ? this.fields[fieldName].materialForm : {};

      Object.keys(this.fields[fieldName].materialForm).map(function (key) {
        // For each `materialForm` field
        _this2.fields[fieldName].attributes[key] = _this2.fields[fieldName].materialForm[key]; // Store it in our component attributes
      });
    }

    /**
     *
     * @param fieldName
     * @param fieldColumn
     * @param materialField
     */

  }, {
    key: 'getSchemaValue',
    value: function getSchemaValue(fieldName, fieldColumn) {
      var materialField = arguments.length <= 2 || arguments[2] === undefined ? fieldColumn : arguments[2];

      this.fields[fieldName].attributes[materialField] = typeof this.fields[fieldName][fieldColumn] !== 'undefined' ? this.fields[fieldName][fieldColumn] : null; // If the `fieldColumn` exists, store it in our `materialField` attributes otherwise null
    }

    /**
     * Remove an attributes value by Nulling it
     * @param fieldName
     * @param field
     */

  }, {
    key: 'removeMaterialSchemaValue',
    value: function removeMaterialSchemaValue(fieldName, field) {
      this.fields[fieldName].attributes[field] = null;
    }

    /**
     * Move a value to our new field and then remove the original field by Nulling it
     * @param fieldName
     * @param newField
     * @param oldField
     */

  }, {
    key: 'moveMaterialSchemaValue',
    value: function moveMaterialSchemaValue(fieldName, newField, oldField) {
      this.fields[fieldName].attributes[newField] = this.fields[fieldName].attributes[oldField]; // Copy the oldField value to the newField value
      this.fields[fieldName].attributes[oldField] = null; // And now remove the oldField by Nulling
    }

    /**
     * A normal string field
     * @param fieldName
     * @returns {XML}
     */

  }, {
    key: 'typeString',
    value: function typeString(fieldName) {
      if (this.fields[fieldName].materialForm.switcher) {
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

  }, {
    key: 'typeDate',
    value: function typeDate(fieldName) {
      var _this3 = this;

      this.moveMaterialSchemaValue(fieldName, 'hintText', 'floatingLabelText');

      this.fields[fieldName].attributes.defaultDate = this.fields[fieldName].defaultValue;
      this.fields[fieldName].attributes.value = this.getStateOrDefaultSchemaValue(fieldName, '');
      this.fields[fieldName].attributes.onChange = function (e, date) {
        _this3.setState(_defineProperty({}, fieldName + '_fieldValue', date));
      };

      return _react2.default.createElement(
        'div',
        { key: this.fields[fieldName].key },
        _react2.default.createElement(_datePicker2.default, this.fields[fieldName].attributes)
      );
    }

    /**
     * Input type number
     * @param fieldName
     * @returns {XML}
     */

  }, {
    key: 'typeNumber',
    value: function typeNumber(fieldName) {
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

  }, {
    key: 'typeCheckbox',
    value: function typeCheckbox(fieldName) {
      this.moveMaterialSchemaValue(fieldName, 'label', 'floatingLabelText');

      switch (this.fields[fieldName].materialForm.switcher) {
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

  }, {
    key: 'typeDropdown',
    value: function typeDropdown(fieldName) {
      var _this4 = this;

      var options = this.getSchemaAllowValues(fieldName);
      this.fields[fieldName].attributes.selectOptions = this.fields[fieldName].attributes.selectOptions ? this.fields[fieldName].attributes.selectOptions : {};
      this.fields[fieldName].attributes.selectOptions.floatingLabelText = this.fields[fieldName].attributes.floatingLabelText;
      this.fields[fieldName].attributes.selectOptions.errorText = this.state[fieldName + '_fieldError'];
      this.fields[fieldName].attributes.selectOptions.defaultValue = this.fields[fieldName].defaultValue;
      this.fields[fieldName].attributes.selectOptions.value = this.getStateOrDefaultSchemaValue(fieldName, '');
      this.fields[fieldName].attributes.selectOptions.onChange = function (e, index, value) {
        _this4.setState(_defineProperty({}, fieldName + '_fieldValue', value));
      };

      return _react2.default.createElement(
        _selectField2.default,
        this.fields[fieldName].attributes.selectOptions,
        Object.keys(options).map(function (i) {
          return _react2.default.createElement(_menuItem2.default, { key: options[i].value, value: options[i].value, label: options[i].label, primaryText: options[i].label });
        })
      );
    }

    /**
     * This will be used for either a text, password, number or textarea input field
     * http://www.material-ui.com/#/components/text-field
     * @param fieldName
     * @returns {XML}
     */

  }, {
    key: 'componentTextField',
    value: function componentTextField(fieldName) {
      var _this5 = this;

      this.fields[fieldName].attributes.errorText = this.state[fieldName + '_fieldError'];
      this.fields[fieldName].attributes.defaultValue = this.fields[fieldName].defaultValue;
      this.fields[fieldName].attributes.value = this.getStateOrDefaultSchemaValue(fieldName, '');
      this.fields[fieldName].attributes.onChange = function (e) {
        if (e.target.value !== '') {
          _this5.setState(_defineProperty({}, fieldName + '_fieldValue', e.target.value));
        } else {
          _this5.setState(_defineProperty({}, fieldName + '_fieldValue', _this5.fields[fieldName].defaultValue));
        }
      };

      return _react2.default.createElement(
        'div',
        { key: this.fields[fieldName].key },
        _react2.default.createElement(_textField2.default, this.fields[fieldName].attributes),
        _react2.default.createElement('br', null)
      );
    }

    /**
     * Toggle component
     * http://www.material-ui.com/#/components/toggle
     * @param fieldName
     * @returns {XML}
     */

  }, {
    key: 'componentToggle',
    value: function componentToggle(fieldName) {
      var _this6 = this;

      this.fields[fieldName].attributes.defaultToggled = this.fields[fieldName].defaultValue;
      this.fields[fieldName].attributes.toggled = this.getStateOrDefaultSchemaValue(fieldName, false);
      this.fields[fieldName].attributes.onToggle = function (e) {
        _this6.setState(_defineProperty({}, fieldName + '_fieldValue', e.target.checked));
      };

      return _react2.default.createElement(
        'div',
        { key: this.fields[fieldName].key },
        _react2.default.createElement(_toggle2.default, this.fields[fieldName].attributes)
      );
    }

    /**
     * Checkbox component
     * http://www.material-ui.com/#/components/checkbox
     * @param fieldName
     * @returns {XML}
     */

  }, {
    key: 'componentCheckbox',
    value: function componentCheckbox(fieldName) {
      var _this7 = this;

      this.fields[fieldName].attributes.defaultChecked = this.fields[fieldName].defaultValue;
      this.fields[fieldName].attributes.checked = this.getStateOrDefaultSchemaValue(fieldName, false);
      this.fields[fieldName].attributes.onCheck = function (e) {
        _this7.setState(_defineProperty({}, fieldName + '_fieldValue', e.target.checked));
      };

      return _react2.default.createElement(
        'div',
        { key: this.fields[fieldName].key },
        _react2.default.createElement(_checkbox2.default, this.fields[fieldName].attributes)
      );
    }

    /**
     * Radio component
     * http://www.material-ui.com/#/components/radio-button
     * @param fieldName
     * @returns {XML}
     */

  }, {
    key: 'componentRadio',
    value: function componentRadio(fieldName) {
      var _this8 = this;

      var options = this.getSchemaAllowValues(fieldName);
      this.fields[fieldName].attributes.groupOptions = this.fields[fieldName].attributes.groupOptions ? this.fields[fieldName].attributes.groupOptions : {};
      this.fields[fieldName].attributes.groupOptions.name = this.fields[fieldName].key;
      this.fields[fieldName].attributes.groupOptions.valueSelected = this.getStateOrDefaultSchemaValue(fieldName, '');
      this.fields[fieldName].attributes.groupOptions.onChange = function (e, value) {
        _this8.setState(_defineProperty({}, fieldName + '_fieldValue', value));
      };

      return _react2.default.createElement(
        'div',
        { key: this.fields[fieldName].key },
        _react2.default.createElement(
          'label',
          null,
          this.fields[fieldName].attributes.floatingLabelText
        ),
        _react2.default.createElement(
          _radioButtonGroup2.default,
          this.fields[fieldName].attributes.groupOptions,
          Object.keys(options).map(function (i) {
            return _react2.default.createElement(_radioButton2.default, _extends({ key: options[i].value }, options[i]));
          })
        )
      );
    }

    /**
     * Get the option values from the schema - Used for radio and select inputs
     * @param fieldName
     * @returns {Array}
     */

  }, {
    key: 'getSchemaAllowValues',
    value: function getSchemaAllowValues(fieldName) {
      var allowedValues = this.fields[fieldName].attributes.options ? this.fields[fieldName].attributes.options : this.fields[fieldName].allowedValues;

      return Object.keys(allowedValues).map(function (key) {
        if (_typeof(allowedValues[key]) === 'object') {
          allowedValues[key].value = allowedValues[key].value.toString();
          return allowedValues[key];
        } else {
          return { label: allowedValues[key], value: allowedValues[key].toString() };
        }
      });
    }

    /**
     * Submit handler - Submit button was clicked or enter was pressed
     * @param event
     */

  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      var _this9 = this;

      event.preventDefault();

      if (this.state.processingForm) // If we're already processing we don't need to submit again
      {
        return;
      }

      // This will disable duplicated submits
      this.setState({
        processingForm: true
      });

      var forumFields = {};

      // Loop through each schema object to build the $forumFields which is then used to submit the form
      Object.keys(this.schema).map(function (fieldName) {
        if (typeof _this9.state[fieldName + '_fieldValue'] !== 'undefined') {
          forumFields[fieldName] = _this9.getStateOrDefaultSchemaValue(fieldName); // Gets the state value
        }

        // Reset the error if there is one
        _this9.setState(_defineProperty({}, fieldName + '_fieldError', null));
      });

      if (this.props.type === 'update') // If we're updating a document
      {
        this.submitUpdateDocument(forumFields);
      } else // Or inserting a new document
      {
        this.submitInsertDocument(forumFields);
      }
    }

    /**
     * Update an existing document
     * @param forumFields
     */

  }, {
    key: 'submitUpdateDocument',
    value: function submitUpdateDocument(forumFields) {
      var _this10 = this;

      if (Object.keys(forumFields).length === 0) // If there is nothing to submit quit now
      {
        this.log(false, 'Attempting to update `' + this.props.doc._id + '` with a blank forum');
        return;
      }

      // Update the document with $forumFields
      this.props.collection.update(this.props.doc._id, { $set: forumFields }, function (err, res) {
        if (err) // If there was an error
        {
          _this10.log(false, 'Error updating `' + _this10.props.doc._id + '`', forumFields);
          _this10.handleSubmitError(err);
        } else {
          _this10.log(false, 'Updated `' + _this10.props.doc._id + '`', forumFields);
        }

        // Finished prcoessing so allow submitting again
        _this10.setState({
          processingForm: false
        });

        return res;
      });
    }

    /**
     * Insert a new document
     * @param forumFields
     */

  }, {
    key: 'submitInsertDocument',
    value: function submitInsertDocument(forumFields) {
      var _this11 = this;

      // Insert a new document
      this.props.collection.insert(forumFields, function (err, res) {
        if (err) // If there was an error
        {
          _this11.log(false, 'Error inserting forum', forumFields);
          _this11.handleSubmitError(err);

          _this11.setState({
            processingForm: false
          });
        } else {
          _this11.log(false, 'Inserted forum', forumFields);
          _this11.resetForm();
        }

        return res;
      });
    }

    /**
     * There was an error in either submitting or inserting a document, handle it here
     * @param err
     */

  }, {
    key: 'handleSubmitError',
    value: function handleSubmitError(err) {
      if (err.invalidKeys) {
        // this.log(false, err.invalidKeys); // All the errors found in the form
        // Update the input to slash the error
        this.setState(_defineProperty({}, err.invalidKeys[0].name + '_fieldError', err.message));
      } else {
        // Some error we don't know about!
        this.log(true, err);
      }
    }

    /**
     * Console.log
     * @param force
     * @param msg
     */

  }, {
    key: 'log',
    value: function log(force) {
      if (force || this.props.debug) {
        var _console;

        for (var _len = arguments.length, msg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          msg[_key - 1] = arguments[_key];
        }

        (_console = console).log.apply(_console, msg);
      }
    }

    /**
     * Reset the entire forum to default
     */

  }, {
    key: 'resetForm',
    value: function resetForm() {
      var changeStates = {
        processingForm: false
      };

      Object.keys(this.schema).map(function (fieldName) {
        changeStates[fieldName + '_fieldValue'] = null;
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
     * @returns {*}
     */

  }, {
    key: 'getStateOrDefaultSchemaValue',
    value: function getStateOrDefaultSchemaValue(fieldName, ourDefaultValue) {
      // If the state value exists
      if (typeof this.state[fieldName + '_fieldValue'] !== 'undefined' && this.state[fieldName + '_fieldValue'] !== null) {
        // Return the state value
        return this.state[fieldName + '_fieldValue'];
      }
      // Else if we're updating an existing document and the value exists here
      else if (this.props.type === 'update' && typeof this.props.doc[fieldName] !== 'undefined' && this.props.doc[fieldName] !== null) {
        // If it's a number
        if (!isNaN(parseFloat(this.props.doc[fieldName])) && isFinite(this.props.doc[fieldName])) {
          // Return it as a String
          return this.props.doc[fieldName].toString();
        } else {
          // Return normal document String
          return this.props.doc[fieldName];
        }
      } else // Else just return the Schema default value OR my hard-coded default value
      {
        return typeof this.fields[fieldName].defaultValue !== 'undefined' ? this.fields[fieldName].defaultValue : ourDefaultValue;
      }
    }

    /**
     * Gets the Schema object and then removes anything that the `props.useFields` hasn't declared
     */

  }, {
    key: 'getFields',
    value: function getFields() {
      var _this12 = this;

      this.schema = this.props.collection._c2._simpleSchema._schema; // Using the provided Collection object, get the simpleSchema object

      if (this.props.useFields) // If we're selecting which fields to use
      {
        Object.keys(this.schema).filter(function (fieldName) {
          // Filter (ie remove) this field from the schema by returning boolean
          if (_this12.props.useFields.indexOf(fieldName) === -1) // If this fieldName does not exist in the useFields array
          {
            delete _this12.schema[fieldName]; // We remove it from the forum schema
          }
        });
      }
    }

    /**
     * Get the forum class or use default class name
     * @returns {string}
     */

  }, {
    key: 'forumClass',
    value: function forumClass() {
      return this.props.formClass ? this.props.formClass : 'autoform_' + this.props.collection._name;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this13 = this;

      if (this.failedRun) // If there was an error
      {
        return _react2.default.createElement('div', null); // Return blank
      }

      return _react2.default.createElement(
        'form',
        { className: this.forumClass, onSubmit: this.handleSubmit.bind(this) },
        Object.keys(this.schema).map(function (fieldName) {
          // Loop through each schema object
          return _this13.processField(_this13.schema[fieldName], fieldName); // Return the form element
        }),
        _react2.default.createElement(_raisedButton2.default, { type: 'submit', className: 'button-submit', label: 'Submit', primary: true, onClick: this.handleSubmit.bind(this), disabled: this.state.processingForm })
      );
    }
  }]);

  return ReactAutoForm;
}(_react2.default.Component);

exports.default = ReactAutoForm;
