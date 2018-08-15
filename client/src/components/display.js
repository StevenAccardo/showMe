import React from 'react';

const Display = props => {
  return props.if ? <div>{props.children}</div> : null;
};

export default Display;
