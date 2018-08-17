import React, { Component } from 'react';
import Display from './Display';

class Ask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      choices: [],
      answer: null
    };

    this.addChoiceButton = this.addChoiceButton.bind(this);
    this.select = this.select.bind(this);
  }

  UNSAFE_componentWillReceiveProps() {
    this.setUpChoices();
  }

  componentDidMount() {
    this.setUpChoices();
  }

  setUpChoices() {
    const choices = Object.keys(this.props.question);
    choices.shift();
    this.setState({ choices, answer: sessionStorage.answer });
  }

  addChoiceButton(choice, i) {
    const buttonTypes = ['primary', 'success', 'warning', 'danger'];
    return (
      <button
        className={`col-xs-12 col-sm-6 btn btn-${buttonTypes[i]}`}
        key={i}
        onClick={() => {
          this.select(choice);
        }}
      >
        {choice}: {this.props.question[choice]}
      </button>
    );
  }

  select(choice) {
    this.setState({ answer: choice });
    sessionStorage.answer = choice;
    this.props.emit('answer', {
      question: this.props.question,
      choice: choice
    });
  }

  render() {
    return (
      <div id="currentQuestion">
        <Display if={this.state.answer}>
          <h3>You answered: {this.state.answer}</h3>
          <p>{this.props.question[this.state.answer]}</p>
        </Display>

        <Display if={!this.state.answer}>
          <h2>{this.props.question.q}</h2>
          <div className="row">{this.state.choices.map(this.addChoiceButton)}</div>
        </Display>
      </div>
    );
  }
}

export default Ask;
