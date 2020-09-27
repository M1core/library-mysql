import React from 'react'
import axios from 'axios';
import { connect } from 'react-redux'
import { logIn } from '../actions'
import { close } from '../actions/index'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isError: false
        }
    }

    handleSubmit = (e) => {
        const {logIn} = this.props
        e.preventDefault();
        const formData = new FormData(e.target);
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/LogIn',
            data: { email: formData.get('email'), password: formData.get('password') },
          }).then(res => !res.data.valid ? this.setState({message: res.data.message, isError: true }) :  
          logIn({name: res.data.data.name, role: res.data.data.role, token: res.data.data.token, remember: formData.get('remember')}) 
          );
    };
    render() {
        const { close } = this.props
        return (
            <form className="form-group bg-dark" onSubmit={this.handleSubmit} style={{
                width: "30%",
                position: "fixed",
                padding: "5%",
                borderRadius: "5%",
                border: "1px solid white",
                margin: "auto",
                right: "0",
                left: "0",
                marginTop: "10%",
                boxShadow: "0 0 0 9999px rgba(0,0,0, 0.8)"
            }}>
                <a href="#" class="close" onClick={() => close('login')} />
                <div>
                    <label style={{ color: "white" }} htmlFor="email">Email</label>
                    <input className="form-control"
                        type="email"
                        id="email"
                        name="email"
                    />
                </div>
                <div>
                    <label style={{ color: "white" }} htmlFor="password">Password</label>
                    <input className="form-control"
                        type="password"
                        id="password"
                        name="password"
                    />
                </div>
                <br />
                <div>
                    <label style={{ color: "white" }} htmlFor="remember">Запомнить меня</label>
                    <input className="form-check-label" style={{ width: "40px", marginLeft: "3%" }}
                        type="checkbox"
                        id="remember"
                        name="remember"
                    />
                </div>
                <button className="btn btn-primary" style={{ marginTop: "10%", width: "40%" }} type="submit">Log in</button>
                <br />
                <label style={{color: this.state.isError ? "red" : "lightgreen"}} >{this.state.message}</label>
            </form>
        );
    }
}

const mapStateToProps = store => {
    return {
      session: store.session,
      windows: store.windows
    }
  }
  const mapDispatchToProps = dispatch => {
    return {
      logIn: (user) => dispatch(logIn(user)),
      close: (window) => dispatch(close(window)),
    }
  }
  // в наш компонент App, с помощью connect(mapStateToProps)
  export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)