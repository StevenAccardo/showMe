import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };

    this.join = this.join.bind(this);
  }

  join(e) {
    e.preventDefault();
    const memberName = this.state.name;
    this.props.emit('join', { name: memberName });
  }

  render() {
    return (
      <form onSubmit={this.join}>
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
        <button className="btn btn-primary">Join</button>
        <Link to="/speaker">Join as Speaker</Link>
      </form>
    );
  }
}

export default Join;
