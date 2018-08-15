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
      dance: 'yessssss'
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.welcome = this.welcome.bind(this);
  }

  componentDidMount() {
    this.socket = io(this.socketURL);
    this.socket.on('connect', this.connect);
    this.socket.on('disconnect', this.disconnect);
    this.socket.on('welcome', this.welcome);
  }

  connect() {
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

  render() {
    return (
      <div>
        <Header title={this.state.title} status={this.state.status} />
        <Switch>
          <Route exact path="/" render={props => <Audience {...this.state} />} />
          <Route path="/speaker" render={props => <Speaker {...this.state} />} />
          <Route path="/board" component={Board} />
          <Route component={NotFound404} />
        </Switch>
      </div>
    );
  }
}

export default App;
