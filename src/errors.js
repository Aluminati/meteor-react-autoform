/**
 * Created by josh.welham on 27/05/16.
 */

import React from 'react';

const defaultStyle = {
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
};

const getStyle = (style, className) =>
{
  return style[className] ? style[className] : defaultStyle[className];
};

const Errors = ({errors, style = {}}) =>
  (
  <div style={getStyle(style, 'container')}>
    <h3 style={getStyle(style, 'h3')}>There was an error submitting the forum:</h3>
    <ul style={getStyle(style, 'ul')}>
      {
        Object.keys(errors).map((key) =>
        {
          return (<li key={key} style={getStyle(style, 'li')}>{errors[key]}</li>);
        })
      }
    </ul>
  </div>
);

Errors.propTypes = {
  errors: React.PropTypes.object.isRequired,
  style: React.PropTypes.array
};

export default Errors;
