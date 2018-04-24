import React, { Component } from 'react';
import axios from 'axios';
import LoginForm from './containers/Login';
import Student from './containers/Student';
import Monitor from './containers/Monitor';
import Teacher from './containers/Teacher';
import './App.css';

class App extends Component {
  state = {
    ID: 0,
    Role: '',
    Name: '',
  };

  _onLogin = (username, password) => {
    axios
      .post('http://localhost:8080/login', {
        username: username,
        password: password,
      })
      .then((response) => {
        this.setState({
          ID: response.data.data[0].ID,
          Role: response.data.data[0].Role,
          Name: response.data.data[0].Name,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  _onLogout = () => {
    this.setState({
      token: 0,
      role: '',
    });
  };

  renderScreen = () => {
    const { ID, Role, Name } = this.state;
    if (Role === 'Student') {
      return <Student role={Role} id={ID} name={Name} />;
    } else if (Role === 'Monitor') {
      return <Monitor role={Role} id={ID} name={Name} />;
    } else if (Role === 'Teacher') {
      return <Teacher role={Role} id={ID} name={Name} />;
    }
    return <LoginForm onLogin={this._onLogin} />;
  };

  render() {
    return this.renderScreen();
  }
}

export default App;
