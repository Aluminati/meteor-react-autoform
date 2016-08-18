/**
 * Created by josh.welham on 15/03/2016.
 */

import React from 'react';
import Errors from './errors';
import {Grid, Cell} from 'react-mdl';
import Form from './form';

/**
 * Class to translate SimpleSchema to Material-UI fields
 */
class ReactAutoForm extends React.Component {
  static style()
  {
    return {
      noPaddingNoMargin: {
        padding: 0,
        margin: 0,
        width: '100%'
      }
    };
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

  renderForm(viewType)
  {
    return (
      <Form
        buttonComponent={this.props.buttonComponent}
        buttonIcon={this.props.buttonIcon}
        buttonLabel={this.props.buttonLabel}
        buttonParentStyle={this.props.buttonParentStyle}
        buttonProps={this.props.buttonProps}
        buttonType={this.props.buttonType}
        debug={this.props.debug}
        disabled={this.props.disabled}
        doc={this.props.doc}
        formClass={this.props.formClass}
        formStyle={this.props.formStyle}
        fullWidth={this.props.fullWidth}
        muiTheme={this.props.muiTheme}
        onSubmit={this.props.onSubmit}
        onSubmitExtra={this.props.onSubmitExtra}
        schema={this.props.schema}
        showToolTips={this.props.showToolTips}
        type={this.props.type}
        useFields={this.props.useFields}
        viewType={viewType}
      />
    );
  }

  render()
  {
    this.processErrors();

    return (
      <div>
        {
          this.props.errors ? <Errors errors={this.props.errors} style={this.props.errorsStyle} title={this.props.errorsTitle} /> : null
        }
        <Grid style={this.constructor.style().noPaddingNoMargin}>
          <Cell
            col={12}
            hidePhone={true}
            key="desktopForm"
            style={this.constructor.style().noPaddingNoMargin}
            tablet={8}
          >
            {this.renderForm('desktop')}
          </Cell>
          <Cell
            col={4}
            hideDesktop={true}
            hideTablet={true}
            key="mobileForm"
            style={this.constructor.style().noPaddingNoMargin}
          >
            {this.renderForm('mobile')}
          </Cell>
        </Grid>
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
  fullWidth: React.PropTypes.bool,
  muiTheme: React.PropTypes.bool,
  onSubmit: React.PropTypes.func.isRequired,
  onSubmitExtra: React.PropTypes.object,
  schema: React.PropTypes.object.isRequired,
  showToolTips: React.PropTypes.oneOf([true, false, 'hint', 'description']),
  type: React.PropTypes.oneOf(['update', 'insert']),
  useFields: React.PropTypes.array
};

ReactAutoForm.defaultProps = {
  buttonProps: {},
  debug: false,
  disabled: false,
  errors: false,
  fullWidth: false,
  formClass: 'autoform',
  formStyle: {},
  onSubmitExtra: {},
  muiTheme: false,
  showToolTips: false,
  type: 'insert'
};

ReactAutoForm.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default ReactAutoForm;
