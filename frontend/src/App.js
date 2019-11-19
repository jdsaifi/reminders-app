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



class App extends React.Component {
  render(){
    return (
      <Provider store={store}>
        <Router>
          <HeaderMenu />
          {/* <Link to="/">Home</Link>&nbsp;&nbsp;&nbsp;
          <Link to="/login">Login</Link>&nbsp;&nbsp;&nbsp;
          <Link to="/me">My Profile</Link> */}
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={Login} />
            <Route path="/me" component={Profile} />
            <Route exact path="/users/:username" component={UserProfile} />
            <Route path="/logout" component={Logout} />
            <Route path="/set-reminder" component={SetReminder} />
            <Route exact path="/search/:q" component={UserSearch} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

// const fbRes = ( res ) => {
//   console.log(res);
// }
// const responseGoogle = (response) => {
//   console.log(response);
// }
// function App() {
//   return (
//     <Router>
//     <div className="container">
//         <h2 className="text-center">Welcome to Remind.me</h2>
//         <hr />
//         <div className="jumbotron">
//           <p><strong>Ready to begin? Signin to set reminder and collaborate with your friends and colleagues!</strong></p>
//             <FacebookLogin
//               appId="860969304305165" //APP ID NOT CREATED YET
//               fields="name,email,picture"
//               callback={fbRes}
//               cssClass="loginBtn loginBtn--facebook"
//               autoLoad={true}
//             />
//             {/* <GoogleLogin
//               clientId="604433154038-357srq78dgd0jiji0fs7s8rme0k5uu0u.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
//               // buttonText="LOGIN WITH GOOGLE"
//               onSuccess={responseGoogle}
//               onFailure={responseGoogle}
//               className="loginBtn loginBtn--google"
//               autoLoad={true}
//             /> */}
//         </div>
//       </div>
//     </Router>
//   );
// }

export default App;
