import React, { Component } from 'react';

class JoinSpeaker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      title: ''
    };

    this.start = this.start.bind(this);
  }

  start(e) {
    e.preventDefault();
    const memberName = this.state.name;
    const title = this.state.title;
    this.props.emit('start', { name: memberName, title });
  }

  render() {
    return (
      <form onSubmit={this.start}>
        <label>Full Name</label>
        <input
          type="text"
          onChange={e => {
            this.setState({ name: e.target.value });
          }}
          value={this.state.name}
          className="form-control"
          placeholder="Enter your full name...."
          required
        />
        <label>Presentation Title</label>
        <input
          type="text"
          onChange={e => {
            this.setState({ title: e.target.value });
          }}
          value={this.state.title}
          className="form-control"
          placeholder="Enter a Title for this Presentation...."
          required
        />
        <button className="btn btn-primary">Start</button>
      </form>
    );
  }
}

export default JoinSpeaker;
