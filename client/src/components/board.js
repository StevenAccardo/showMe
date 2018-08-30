import React from 'react';
import Display from './display';
import { BarChart } from 'react-easy-chart';

function barGraphData(results) {
  return Object.keys(results).map(choice => {
    return {
      x: choice,
      y: results[choice]
    }
  });
}

const Board = props => {
  console.log(props.results);
  return (
    <div id="scoreboard">
      <Display if={props.status === 'connected' && props.currentQuestion}>
        <BarChart axes axisLabels={{x: 'Questions', y: '# of Answers'}} data={barGraphData(props.results)} height={window.innerHeight * 0.6} width={window.innerWidth * 0.6}></BarChart>
      </Display>
      <Display if={props.status === 'connected' && !props.currentQuestion}>
        <h3>Awaiting a Question...</h3>
      </Display>
    </div>
  )
};

export default Board;
