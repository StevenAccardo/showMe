import React from 'react';
import Display from './Display';
import Join from './join';

const Audience = props => {
  return (
    <div>
      <Display if={props.status === 'connected'}>
        <Display if={props.member.name}>
          <h2>Welcome {props.member.name}</h2>
          <p>{props.audience.length} audience members connected.</p>
          <p>Questions will appear here.</p>
        </Display>

        <Display if={!props.member.name}>
          <h1>Join the Session</h1>
          <Join emit={props.emit} />
        </Display>
      </Display>
    </div>
  );
};

export default Audience;
