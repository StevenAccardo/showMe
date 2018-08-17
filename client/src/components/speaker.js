import React from 'react';
import Display from './display';
import JoinSpeaker from './joinSpeaker';
import Attendance from './attendance';
import Questions from './questions';

const Speaker = props => {
  return (
    <div>
      <Display if={props.status === 'connected'}>
        <Display if={props.member.name && props.member.type === 'speaker'}>
          <Questions questions={props.questions} emit={props.emit} />
          <Attendance audience={props.audience} />
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
