/**
 * Created by josh.welham on 18/03/2016.
 */

const React = require('react');
const RadioButton = require('material-ui/lib/radio-button');
const RadioButtonGroup = require('material-ui/lib/radio-button-group');

class RadioFieldInput extends React.Component {
  constructor(props) {
    super(props);
  }

  createItems(options) {
    const menuItems = [];

    _.each(options, (buttonOptions, key) => {
      menuItems.push(this.createItem(buttonOptions));
    });

    return menuItems;
  }

  createItem(buttonOptions) {
    return (
      <RadioButton key={buttonOptions.value} {...buttonOptions} />
    )
  }

  render() {
    return (
      <div key={this.props.inputKey}>
        <label>{this.props.floatingLabelText}</label>
        <RadioButtonGroup name={this.props.inputKey} {...this.props.groupOptions}>
          {this.createItems(this.props.options)}
        </RadioButtonGroup>
      </div>
    );
  }
}

export default RadioFieldInput;
