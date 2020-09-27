import React from 'react';
import axios from 'axios';
import { close } from '../actions/index'
import { connect } from 'react-redux'

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            receivedComments: [],
        }
    }

    handleSubmit = (e) => {
        const { logIn } = this.props
        e.preventDefault();
        const formData = new FormData(e.target);
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/sendComment',
            data: { comment: formData.get('comment'), user: this.props.user, book: this.props.book },
        }).then((res) => this.getComments())

    };
    getComments() {
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/getComments',
            data: { bookId: this.props.book },
        }).then(res => this.setState({ receivedComments: res.data }))
    }
    componentDidMount() {
        this.getComments()
    }
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
                boxShadow: "0 0 0 9999px rgba(0,0,0, 0.8)",
                zIndex: 1000,
            }}>
                <a href="#" class="close" onClick={() => close('comments')} />
                <ol style={{color: "white", listStyle: "none", height: "200px", overflowY: "scroll", paddingRight: "2%"}}>
                    {this.state.receivedComments.map(val =>
                        <li style= {{border: "1px dotted #666", padding: "1em", borderRadius: "16px"}}>
                            <h6 style={{color: "white"}}>
                                {val.author}
                                <small style={{marginLeft: "1%"}} class="text-muted">{val.date}</small>
                            </h6>
                            <p style={{color: "white"}}>{val.text}</p>
                        </li>)}
                </ol>
                {this.props.user.role === 'guest' ? null : <div style={{marginLeft: "auto", marginRight: "auto", width: "80%"}}>
                <br />
                <textarea style={{ width: "100%" }} name="comment" id="comment" required placeholder='Текст комментария' />
                <br />
                <button type="submit">отправить</button>
                </div>}
            </form>
        )
    }
}

const mapStateToProps = store => {
    return {
      session: store.session,
    }
  }
  const mapDispatchToProps = dispatch => {
    return {
        close: (window) => dispatch(close(window)),
    }
  }
  // в наш компонент App, с помощью connect(mapStateToProps)
  export default connect(mapStateToProps, mapDispatchToProps)(Comments)