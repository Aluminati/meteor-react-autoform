/**
 * Created by josh.welham on 27/05/16.
 */

import React from 'react';

const listItems = (errors, style) =>
{
  return Object.keys(errors).map(field =>
  {
    return (<li key={field} style={style.li}>{errors[field].message}</li>);
  });
};

const Errors = ({errors, style, title}) =>
  (
  <div style={style.container}>
    <h3 style={style.h3}>{title}</h3>
    <ul style={style.ul}>
      {listItems(errors, style)}
    </ul>
  </div>
);

Errors.propTypes = {
  errors: React.PropTypes.objectOf(React.PropTypes.shape({
    message: React.PropTypes.string.isRequired,
    type: React.PropTypes.string
  })).isRequired,
  style: React.PropTypes.object,
  title: React.PropTypes.string
};

Errors.defaultProps = {
  style: {
    container: {
      // background: 'green'
    },
    h3: {
      // background: 'red'
    },
    ul: {
      // background: 'purple'
    },
    li: {
      // background: 'yellow'
    }
  },
  title: 'There was an error submitting the form:'
};

export default Errors;
