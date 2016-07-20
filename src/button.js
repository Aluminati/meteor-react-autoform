/**
 * Created by josh.welham on 21/06/16.
 */

import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Helmet from 'react-helmet';

class Button extends React.Component {
  constructor(props)
  {
    super(props);
  }

  buttonProps()
  {
    return {
      disabled: true,
      icon: this.icon(),
      label: this.props.label,
      labelPosition: 'before',
      primary: this.isPrimary()
    };
  }

  isPrimary()
  {
    if(typeof this.props.extraProps === 'undefined')
    {
      return true;
    }
    else if(this.props.extraProps.secondary)
    {
      return false;
    }

    return true;
  }

  icon()
  {
    if(this.props.icon)
    {
      return (
        <FontIcon className="material-icons">{this.props.icon}</FontIcon>
      );
    }

    return null;
  }

  button()
  {
    switch(this.props.type)
    {
      case 'FlatButton':
        return this.flatButton();
      case 'IconButton':
        return this.iconButton();
      case 'RaisedButton':
      default:
        return this.raisedButton();
    }
  }

  flatButton()
  {
    return (
      <FlatButton {...this.buttonProps()} {...this.props.extraProps} type="submit" />
    );
  }

  iconButton()
  {
    return (
      <IconButton {...this.buttonProps()} type="submit">
        {this.icon()}
      </IconButton>
    );
  }

  raisedButton()
  {
    return (
      <RaisedButton {...this.buttonProps()} {...this.props.extraProps} type="submit" />
    );
  }

  render()
  {
    return (
      <div style={this.props.buttonParentStyle}>
        <Helmet
          link={[
             {rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'}
          ]}
        />
        {this.button()}
      </div>
    );
  }
}

Button.propTypes = {
  buttonParentStyle: React.PropTypes.object,
  extraProps: React.PropTypes.object,
  icon: React.PropTypes.string,
  label: React.PropTypes.string,
  type: React.PropTypes.oneOf(['FlatButton', 'RaisedButton', 'IconButton'])
};

Button.defaultProps = {
  label: 'Submit',
  type: 'RaisedButton'
};

export default Button;
