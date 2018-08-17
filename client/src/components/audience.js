import React from 'react';
import Display from './Display';
import Join from './join';
import Ask from './ask';

const Audience = props => {
  return (
    <div>
      <Display if={props.status === 'connected'}>
        <Display if={props.member.name}>
          <Display if={!props.currentQuestion}>
            <h2>Welcome {props.member.name}</h2>
            <p>{props.audience.length} audience members connected.</p>
            <p>Questions will appear here.</p>
          </Display>

          <Display if={props.currentQuestion}>
            <Ask question={props.currentQuestion} emit={props.emit} />
          </Display>
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
