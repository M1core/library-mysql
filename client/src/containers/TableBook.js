import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/table.css';

import deleteIMG from '../ico/PinClipart.com_cross-with-shadow-clipart_3225390.png';
import changeIMG from '../ico/edit.png';
import saveIMG from '../ico/floppy-icon.png';
import Comments from './Comments';
import session from '../reducers/session';
import windows from '../reducers/windows'

class TableBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      storedResult: [],
      storedAuthors: [],
      storedGenres: [],

      showComments: false,
      selectedBook: null,

      isEditing: false,
      editingID: '',
      editingName: '',
      editingDesc: '',
      editingDate: '',
      editingAuthor: '',
      editingGenre: '',

    };
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.windows.showComments !== this.state.showComments) {
      this.setState({
        showComments: nextProps.windows.showComments,
      });
    }
  }

  componentDidMount() {
    this.query();
    this.getAuthorsAndGenres();
  }

  async getAuthorsAndGenres() {
    const resA = await axios.get('http://localhost:3000/api/getAuthors');
    this.setState({ storedAuthors: resA.data });
    const resG = await axios.get('http://localhost:3000/api/getGenres');
    this.setState({ storedGenres: resG.data });
    this.setState({ isLoading: false });
  }

  async query() {
    const res = await axios.get('http://localhost:3000/api/getBooks');
    this.setState({ storedResult: res.data });
    this.setState({ isLoading: false });
  }

  async delete(del) {
    console.log(del);
    axios({
      method: 'post',
      url: 'http://localhost:3000/api/delBooks',
      data: del,
    });
    setTimeout(() => {
      this.setState({ isLoading: true });
      this.query();
    }, 500);
  }

  edit(val) {
    this.setState({
      isEditing: true,
      editingID: val.id,
      editingName: val.name,
      editingDesc: val.desc,
      editingDate: val.date,
      editingAuthor: val.author,
      editingGenre: val.genre,
    });
  }

  save() {
    this.setState({ isLoading: true });
    axios({
      method: 'post',
      url: 'http://localhost:3000/api/editBook',
      data: {
        id: this.state.editingID,
        name: this.state.editingName,
        author: this.state.editingAuthor,
        genre: this.state.editingGenre,
        desc: this.state.editingDesc,
        date: this.state.editingDate,
      },
    });
    setTimeout(() => { }, 300);
    this.setState({ isEditing: false });
    this.query();
  }

  handleChangeTime(date) {
    this.setState({
      editingDate: date,
    });
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'name':
        this.setState({
          editingName: event.target.value,
        });
        break;
      case 'author':
        this.setState({
          editingAuthor: event.target.value,
        });
        break;

      case 'genre':
        this.setState({
          editingGenre: event.target.value,
        });
        break;

      case 'desc':
        this.setState({
          editingDesc: event.target.value,
        });
        break;
      default: alert('ti debil?');
    }
  }

  render() {
    const user = this.props.props;
    return (
      <div style={{ width: '100%' }}>
        {this.state.showComments ? <Comments  user = {user} book={this.state.selectedBook}/> : null}
        {
                    this.state.isLoading ? (<div>Loading...</div>) : (
                      <table className="table" style={{ width: '90%', margin: 'auto' }}>
                        <tbody>
                          <tr>
                            <th>ID</th>
                            <th className="text-center">Название книги</th>
                            <th className="text-center">Описание</th>
                            <th className="text-center">Дата издания</th>
                            <th className="text-center">Автор</th>
                            <th className="text-center">Жанр</th>
                            <th className="text-center">Комментарии</th>
                            {user.role === 'admin' ? <th className="text-center">Удалить</th> : null}
                            {user.role === 'admin' ? <th className="text-center">Изменить</th> : null}
                            
                          </tr>
                          {
                            this.state.storedResult.map((val, key) => (
                              <tr key={key}>
                                <td align="center">{val.id}</td>
                                {this.state.isEditing && val.id === this.state.editingID ? <td><input className="editingInput" name="name" onChange={this.handleChange} value={this.state.editingName} /></td> : <td>{val.name}</td>}
                                {this.state.isEditing && val.id === this.state.editingID ? <td><input className="editingInput" name="desc" onChange={this.handleChange} value={this.state.editingDesc} /></td> : <td>{val.desc}</td>}
                                {this.state.isEditing && val.id === this.state.editingID
                                  ? (
                                    <td>
                                      <DatePicker className="editingInput" name="date" selected={Date.parse(this.state.editingDate)} onChange={this.handleChangeTime} />
                                    </td>
                                  )
                                  : <td align="center">{val.date}</td>}

                                {this.state.isEditing && val.id === this.state.editingID
                                  ? (
                                    <td>
                                      <select className="editingInput" name="author" type="select" onChange={this.handleChange} value={this.state.editingAuthor}>
                                        {this.state.storedAuthors.map(((val, key) => <option key={key} value={`${val.first} ${val.last}`}>{`${val.first} ${val.last}`}</option>))}
                                      </select>
                                    </td>
                                  )
                                  : <td>{val.author}</td>}
                                {this.state.isEditing && val.id === this.state.editingID
                                  ? (
                                    <td>
                                      <select className="editingInput" name="genre" onChange={this.handleChange} value={this.state.editingGenre}>
                                        {this.state.storedGenres.map(((val, key) => <option key={key} defaultValue={val.name}>{val.name}</option>))}
                                      </select>
                                    </td>
                                  )
                                  : <td>{val.genre}</td>}
                                  <td className="text-center deleteTD" onClick={()=>this.setState({showComments: true, selectedBook: val.id})} >показать</td>
                                {user.role === 'admin' ? <td className="deleteTD" width="2%" align="center" onClick={() => { this.delete(val); }}><img width="30%" className="deleteIMG" src={deleteIMG} alt="delete" /></td> : null}
                                {user.role === 'admin' ? <td className="deleteTD" width="2%" align="center" onClick={() => { this.edit(val); }}><img width="30%" className="deleteIMG" src={changeIMG} alt="edit" /></td> : null}
                                {this.state.isEditing && val.id === this.state.editingID ? <td className="deleteTD" width="3%" align="center" onClick={() => { this.save(); }}><img width="100%" src={saveIMG} alt="save" /></td> : null}
                              </tr>
                            ))
                        }
                        </tbody>
                      </table>
                    )
                }
                
      </div>
    );
  }
}


const mapStateToProps = store => {
  console.log(store) // посмотрим, что же у нас в store?
  return {
    windows: store.windows,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    logIn: (user) => dispatch(logIn(user)),
    logOut: () => dispatch(logOut()),
  }
}
// в наш компонент App, с помощью connect(mapStateToProps)
export default connect(mapStateToProps, mapDispatchToProps)(TableBook)