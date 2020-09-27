import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, } from 'react-router-dom';
import { connect } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';

import TableBook from '../containers/TableBook';
import RowForm from '../containers//RowForm';
import TableAuthors from '../containers//TableAuthors';
import TableGenres from '../containers//TableGenres';
import Custom from '../containers//Custom';
import FormLogIn from './FormLogIn'
import FormSignUp from './FormSignUp'
import { logOut, logIn } from '../actions'
import session from '../reducers/session';
import { hasToken } from '../functions/authToken'
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogInForm: false,
      showSignUpForm: false,
      user: {},

    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.session.showLogIn !== this.state.showLogInForm || nextProps.session.showSignUp !== this.state.showSignUpForm) {
      this.setState({
        showLogInForm: nextProps.session.showLogIn,
        showSignUpForm: nextProps.session.showLogIn,
      });
    }
    if (nextProps.windows.showLogIn !== this.state.showLogInForm || nextProps.windows.showSignUp !== this.state.showSignUpForm) {
      this.setState({
        showLogInForm: nextProps.windows.showLogIn,
        showSignUpForm: nextProps.windows.showLogIn,
      });
    }
  }
  componentDidMount() {
    const { logIn } = this.props
    if (hasToken())
      axios({
        method: 'post',
        url: 'http://localhost:3000/api/LogInByToken',
        data: { token: hasToken() },
      }).then(res => { res.data.valid ? logIn(res.data.data) : logOut() });
  }

  render() {
    const { session, logOut } = this.props

    return (
      <Router>
        <div>
          <nav className="navbar bg-dark">
            <ul>
              <li className="nav-item" style={{ display: 'inline-block', marginLeft: '40px' }}>
                <Link style={{ color: 'white' }} className="nav-link" to="/">Books</Link>
              </li>
              <li style={{ display: 'inline-block', marginLeft: '40px' }}>
                <Link style={{ color: 'white' }} className="nav-link" to="/authors">Authors</Link>
              </li>
              <li style={{ display: 'inline-block', marginLeft: '40px' }}>
                <Link style={{ color: 'white' }} className="nav-link" to="/genres">Genres</Link>
              </li>
              {session.user.role === 'admin' ? <li style={{ display: 'inline-block', marginLeft: '40px' }}>
                <Link style={{ color: 'white' }} className="nav-link" to="/new">New</Link>
              </li> : null}
              <li style={{ display: 'inline-block', marginLeft: '40px' }}>
                <Link style={{ color: 'white' }} className="nav-link" to="/custom">Custom</Link>
              </li>
            </ul>
            <div>
              {session.user.role === 'guest' ? <div>
                <button className="btn btn-outline-success" onClick={() => this.setState({ showLogInForm: true })}>Войти</button>
                <span> </span>
                <button className="btn btn-outline-success" onClick={() => this.setState({ showSignUpForm: true })}>Зарегистрироваться</button>
              </div> : <div><label style={{color: "white", fontFamily: "sans-serif", fontStyle: "verdana"}}>{session.user.name}</label><span> &#4448;&#4448;</span><button className="btn btn-outline-success" onClick={() => logOut()}>Log Out</button></div>}

            </div>
          </nav>
          {this.state.showLogInForm ? <FormLogIn /> : null}
          {this.state.showSignUpForm ? <FormSignUp /> : null}
          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/">
              <TableBook props={session.user} />
            </Route>
            <Route path="/new">
              <RowForm props={session.user} />
            </Route>
            <Route path="/genres">
              <TableGenres props={session.user} />
            </Route>
            <Route path="/authors">
              <TableAuthors props={session.user} />
            </Route>
            <Route exact path="/custom">
              <Custom props={session.user} />
            </Route>
          </Switch>
        </div>
      </Router>
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
    logOut: () => dispatch(logOut()),
    close: (window) => dispatch(close(window)),
  }
}
// в наш компонент App, с помощью connect(mapStateToProps)
export default connect(mapStateToProps, mapDispatchToProps)(App)