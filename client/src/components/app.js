import React, { Component } from 'react';
import io from 'socket.io-client';
import { Route, Switch } from 'react-router-dom';
import Header from './header';
import Audience from './audience';
import Speaker from './speaker';
import Board from './board';
import NotFound404 from './404';

class App extends Component {
  constructor(props) {
    super(props);
    this.socketURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

    this.state = {
      status: 'disconnected',
      title: '',
      member: {},
      audience: [],
      speaker: {}
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.welcome = this.welcome.bind(this);
    this.emit = this.emit.bind(this);
    this.joined = this.joined.bind(this);
    this.updateAudience = this.updateAudience.bind(this);
  }

  componentDidMount() {
    this.socket = io(this.socketURL);
    this.socket.on('connect', this.connect);
    this.socket.on('disconnect', this.disconnect);
    this.socket.on('welcome', this.welcome);
    this.socket.on('joined', this.joined);
    this.socket.on('audience', this.updateAudience);
  }

  emit(eventName, payload) {
    this.socket.emit(eventName, payload);
  }

  connect() {
    const member = sessionStorage.member ? JSON.parse(sessionStorage.member) : null;

    if (member) {
      this.emit('join', member);
    }
    this.setState({ status: 'connected' });
  }

  disconnect() {
    this.setState({ status: 'disconnected' });
    console.log(this.state.status);
  }

  //Receives the title from the server. The title is set by the presenter.
  welcome({ title }) {
    this.setState({ title });
  }

  joined(member) {
    sessionStorage.member = JSON.stringify(member);
    this.setState({ member });
  }

  updateAudience(newAudience) {
    this.setState({ audience: newAudience });
  }

  render() {
    return (
      <div>
        <Header title={this.state.title} status={this.state.status} />
        <Switch>
          <Route exact path="/" render={props => <Audience emit={this.emit} {...this.state} />} />
          <Route path="/speaker" render={props => <Speaker emit={this.emit} {...this.state} />} />
          <Route path="/board" component={Board} />
          <Route component={NotFound404} />
        </Switch>
      </div>
    );
  }
}

export default App;
