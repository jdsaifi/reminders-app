import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Provider } from 'react-redux';

// import GoogleLogin from 'react-google-login';
import store from './redux/store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/** Import Components */
import HeaderMenu from './components/header/menu.component';
import NotFound from './components/not-found/not-found.component';
import Login from './components/login/login.component';
import Logout from './components/login/logout.component';
import Profile from './components/profile/profile.component';
import UserProfile from './components/profile/user-profile.component';
import HomePage from './components/home/home-page.component';
import SetReminder from './components/reminders/set-reminder.component';
import UserSearch from './components/search/users-search.component';
import { BASE_URL } from './utils/utils'


class App extends React.Component {
  
  render(){
    // console.log(`${window.location.origin.toString()}`);
    return (
      <Provider store={store}>
        <Router>
          <HeaderMenu />          
          <Switch>
            <Route exact path={`${BASE_URL}`} component={HomePage} />
            <Route path={`${BASE_URL}login`} component={Login} />
            <Route path={`${BASE_URL}me`} component={Profile} />
            <Route exact path={`${BASE_URL}users/:username`} component={UserProfile} />
            <Route path={`${BASE_URL}logout`} component={Logout} />
            <Route path={`${BASE_URL}set-reminder`} component={SetReminder} />
            <Route exact path={`${BASE_URL}search/:q`} component={UserSearch} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
export default App;
