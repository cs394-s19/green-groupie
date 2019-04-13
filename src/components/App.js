import React from 'react';
import { withStyles, MuiThemeProvider} from '@material-ui/core';
import NavBar from './NavBar';
import {theme as Theme} from '../index';
import Header from './Header';
import { Route } from 'react-router-dom';
import CreateEvent from './Pages/CreateEvent/_CreateEvent';
import Profile from './Pages/Profile/_Profile'
import Agenda from './Pages/Agenda/_Agenda';
import AuthContext from './util/AuthContext';
import firebase from 'firebase';

const styles = {
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3f51b5'
  },
  icon: {
    color: '#fff'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {currentUser: null};

    firebase.auth().onAuthStateChanged(((user) => {
      this.setState({currentUser: user});
    }).bind(this));
  }

  render() {
  return (
      <AuthContext.Provider value={this.state.currentUser}>
        <MuiThemeProvider theme={Theme}>
            <Header />
            <Route path="/profile/" component={Profile} />
            <Route path="/create-event/" exact component={CreateEvent} />
            <Route path="/agenda/" component={Agenda} />
            <NavBar />
        </MuiThemeProvider>
      </AuthContext.Provider>
    );
  }
}

export default withStyles(styles)(App);
