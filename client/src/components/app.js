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
      speaker: '',
      questions: [],
      currentQuestion: false,
      results: {}
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.updateState = this.updateState.bind(this);
    this.emit = this.emit.bind(this);
    this.joined = this.joined.bind(this);
    this.updateAudience = this.updateAudience.bind(this);
    this.start = this.start.bind(this);
    this.ask = this.ask.bind(this);
    this.updateResults = this.updateResults.bind(this);
  }

  componentDidMount() {
    this.socket = io(this.socketURL);
    this.socket.on('connect', this.connect);
    this.socket.on('disconnect', this.disconnect);
    this.socket.on('welcome', this.updateState);
    this.socket.on('joined', this.joined);
    this.socket.on('audience', this.updateAudience);
    this.socket.on('start', this.start);
    this.socket.on('end', this.updateState);
    this.socket.on('ask', this.ask);
    this.socket.on('results', this.updateResults);
  }

  emit(eventName, payload) {
    this.socket.emit(eventName, payload);
  }

  connect() {
    const member = sessionStorage.member ? JSON.parse(sessionStorage.member) : null;

    if (member && member.type === 'audience') {
      this.emit('join', member);
    } else if (member && member.type === 'speaker') {
      this.emit('start', { name: member.name, title: sessionStorage.title });
    }
    this.setState({ status: 'connected' });
  }

  disconnect() {
    this.setState({
      status: 'disconnected',
      title: 'disconnected',
      speaker: ''
    });
  }

  //Receives the title from the server. The title is set by the presenter.
  updateState(serverState) {
    this.setState(serverState);
  }

  joined(member) {
    sessionStorage.member = JSON.stringify(member);
    this.setState({ member });
  }

  updateAudience(newAudience) {
    this.setState({ audience: newAudience });
  }

  start(presentation) {
    if (this.state.member.type === 'speaker') {
      sessionStorage.title = presentation.title;
    }
    this.setState(presentation);
  }
  ask(question) {
    sessionStorage.answer = '';
    this.setState({
      currentQuestion: question,
      results: { a:0, b:0, c:0, d:0 }
    });
  }

  updateResults(results) {
    this.setState({ results });
  }

  render() {
    return (
      <div className="container">
        <Header {...this.state} />
        <Switch>
          <Route exact path="/" render={props => <Audience emit={this.emit} {...this.state} />} />
          <Route path="/speaker" render={props => <Speaker emit={this.emit} {...this.state} />} />
          <Route path="/board" render={props => <Board emit={this.emit} {...this.state} />} />
          <Route component={NotFound404} />
        </Switch>
      </div>
    );
  }
}

export default App;
