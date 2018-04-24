import React, { Component } from 'react';
import './Login.css';

class LoginForm extends Component {

  state = {
    username: '',
    password: '',
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { username, password } = this.state;
    this.props.onLogin(username, password);
    this.setState({
      username: '',
      password: ''
    })
  };
  
  handleChangeUsername(event) {
    this.setState({
      username: event.target.value
    });
  }
  handleChangePassword(event){
    this.setState({
      password: event.target.value
    });
  }

  render() {
    return (
      <div className="login-page">
      <div className="form">
        <h2>Trainning Point</h2>
        <form className="login-form">
          <input 
            type="text" 
            placeholder="username" 
            id="user" 
            autoFocus
            value ={this.state.username}
            onChange={(e) => this.handleChangeUsername(e)}
            />
          <input 
            type="password" 
            placeholder="password" 
            id="pass" 
            autoFocus
            value= {this.state.password}
            onChange = {(e) => this.handleChangePassword(e)}
            />
          <button type="submit" onClick={(e) => this.handleSubmit(e)}>Login</button>
        </form>
      </div>
    </div>
    );
  }
}

export default LoginForm;
