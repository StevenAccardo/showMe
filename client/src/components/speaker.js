import React from 'react';
import Display from './display';
import JoinSpeaker from './joinSpeaker';

const Speaker = props => {
  return (
    <div>
      <Display if={props.status === 'connected'}>
        <Display if={props.member.name && props.member.type === 'speaker'}>
          <p>Questions</p>
          <p>Attendance</p>
        </Display>

        <Display if={!props.member.name}>
          <h2>Start the presentation</h2>
          <JoinSpeaker emit={props.emit} />
        </Display>
      </Display>
    </div>
  );
};

export default Speaker;
