import React from 'react'
import axios from 'axios';
import { connect } from 'react-redux'
import { logIn } from '../actions'
import { close } from '../actions/index'

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isError: false
        }
    }

    validateEmail(emailField) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(emailField) == false) {
            this.setState({ isError: true, message: "Неверно указанный почтовый адресс" })
            return false;
        }

        return true;

    }
    validatePass(pass) {
        var reg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}/g;

        if (reg.test(pass) == false) {
            this.setState({ isError: true, message: "Пароль должен состоять минимум из 6 символов, содержать комбинацию цифр, прописных и заглавных символов латиницы" })
            return false;
        }

        return true;

    }

    handleSubmit = (e) => {
        const { logIn } = this.props
        e.preventDefault();
        const formData = new FormData(e.target);

        if (this.validatePass(formData.get('password')) && formData.get('password') !== formData.get('confirmPassword'))
            this.setState({ isError: true, message: "Пароли не совпадают" });
        if (!(formData.get('name').length > 2)) this.setState({ isError: true, message: 'Имя пользователя должно иметь длину из не менее 3 символов' });
        if (this.validatePass(formData.get('password')) && this.validateEmail(formData.get('email')) && 
        formData.get('name').length > 2 && formData.get('password') === formData.get('confirmPassword'))
            axios({
                method: 'post',
                url: 'http://localhost:3000/api/signUp',
                data: { email: formData.get('email'), name: formData.get('name'), password: formData.get('password') },
            }).then(res => {
                console.log(res); !res.data.valid ? this.setState({ message: res.data.error.message, isError: true }) :
                    logIn({ name: res.data.data.name, role: res.data.data.role, token: res.data.data.token, remember: 'on' })
            });
    };
    render() {
        const {close} = this.props
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
                marginTop: "5%",
                boxShadow: "0 0 0 9999px rgba(0,0,0, 0.8)"
            }}>
                <a href="#" class="close" onClick={() => close('signup')} />
                <div>
                    <label style={{ color: "white" }} htmlFor="email">Email</label>
                    <input className="form-control"
                        type="email"
                        id="email"
                        name="email"
                    />
                </div>
                <div>
                    <label style={{ color: "white" }} htmlFor="email">Имя пользователя</label>
                    <input className="form-control"
                        type="text"
                        id="name"
                        name="name"
                    />
                </div>
                <div>
                    <label style={{ color: "white" }} htmlFor="password">Пароль</label>
                    <input className="form-control"
                        type="password"
                        id="password"
                        name="password"
                    />
                </div>
                <div>
                    <label style={{ color: "white" }} htmlFor="confirmPassword">Подтвердите пароль</label>
                    <input className="form-control"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                    />
                </div>
                <button className="btn btn-primary" style={{ marginTop: "10%", width: "40%" }} type="submit">Sign up</button>
                <br />
                <label style={{ color: this.state.isError ? "red" : "lightgreen" }} >{this.state.message}</label>
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
export default connect(mapStateToProps, mapDispatchToProps)(SignUp)