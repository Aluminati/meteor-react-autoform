/**
 * Created by josh.welham on 27/05/16.
 */

import React from 'react';

const listItems = (errors, style) =>
{
  const mappedErrors = [];

  errors.map((error) =>
  {
    mappedErrors[error.name] = error.message;
  });

  return Object.keys(mappedErrors).map((key) =>
  {
    return (<li key={key} style={style.li}>{mappedErrors[key]}</li>);
  });
};

const Errors = ({errors, style = {}, title}) =>
  (
  <div style={style.container}>
    <h3 style={style.h3}>{title}</h3>
    <ul style={style.ul}>
      {listItems(errors, style)}
    </ul>
  </div>
);

Errors.propTypes = {
  errors: React.PropTypes.array.isRequired,
  style: React.PropTypes.object,
  title: React.PropTypes.string
};

Errors.defaultProps = {
  style: {
    container: {
      background: 'green'
    },
    h3: {
      background: 'red'
    },
    ul: {
      background: 'purple'
    },
    li: {
      background: 'yellow'
    }
  },
  title: 'There was an error submitting the form:'
};

export default Errors;
