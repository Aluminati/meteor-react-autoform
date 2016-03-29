/**
 * Created by josh.welham on 17/03/2016.
 */

const React = require('react');
const SelectField = require('material-ui/lib/select-field');
const MenuItem = require('material-ui/lib/menus/menu-item');

class SelectFieldInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.value ? this.props.value : null};
  }

  handleChange(event, index, value) {
    this.setState({value});
  }

  createItems(options) {
    const menuItems = [];

    _.each(options, (item, key) => {
      menuItems.push(this.createItem(item.label, item.value));
    });

    return menuItems;
  }

  createItem(label, value) {
    return (
      <MenuItem key={value} value={value} label={label} primaryText={label}/>
    )
  }

  render() {
    return (
      <div key={this.props.inputKey}>
        <input type="hidden" name={this.props.name} value={this.state.value} readOnly />
        <SelectField value={this.state.value} onChange={this.handleChange.bind(this)} {...this.props.selectOptions}>
          {this.createItems(this.props.options)}
        </SelectField>
      </div>
    );
  }
}

export default SelectFieldInput;
