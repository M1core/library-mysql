import React from 'react';
import axios from 'axios';

import 'react-datepicker/dist/react-datepicker.css';
import '../styles/table.css';

import deleteIMG from '../ico/PinClipart.com_cross-with-shadow-clipart_3225390.png';
import changeIMG from '../ico/edit.png';
import saveIMG from '../ico/floppy-icon.png';

export default class TableGenres extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      storedResult: [],
      isEditing: false,
      editingID: '',
      editingName: '',
      editingDesc: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.query();
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'name':
        this.setState({
          editingName: event.target.value,
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

  async query() {
    const res = await axios.get('http://localhost:3000/api/getGenres');
    this.setState({ storedResult: res.data });
    this.setState({ isLoading: false });
  }

  async delete(del) {
    console.log(del);
    axios({
      method: 'post',
      url: 'http://localhost:3000/api/delGenre',
      data: del,
    });
    setTimeout(() => {
      this.setState({ isLoading: true });
      this.query();
    }, 500);
  }

  edit(val) {
    console.log(val);
    this.setState({

      isEditing: true,
      editingID: val.id,
      editingName: val.name,
      editingDesc: val.desc,
    });
  }

  save() {
    this.setState({ isLoading: true });
    axios({
      method: 'post',
      url: 'http://localhost:3000/api/editGenre',
      data: {
        id: this.state.editingID,
        name: this.state.editingName,
        desc: this.state.editingDesc,
      },
    });
    setTimeout(() => { }, 300);
    this.setState({ isEditing: false });
    this.query();
  }

  render() {
    const user = this.props.props;
    return (
      <div style={{ width: '100%' }}>
        {
                    this.state.isLoading ? (<div>Loading...</div>) : (
                      <table className="table" style={{ width: '90%', margin: 'auto' }}>
                        <tbody>
                          <tr>
                            <th>ID</th>
                            <th className="text-center">Жанр</th>
                            <th className="text-center">Описание</th>
                            {user.role === 'admin' ? <th className="text-center">Удалить</th> : null }
                            {user.role === 'admin' ? <th className="text-center">Изменить</th> : null }
                          </tr>
                          {
                            this.state.storedResult.map((val, key) => (
                              <tr key={key}>
                                <td align="center">{val.id}</td>
                                {this.state.isEditing && val.id === this.state.editingID ? <td><input className="editingInput" name="name" onChange={this.handleChange} value={this.state.editingName} /></td> : <td>{val.name}</td>}
                                {this.state.isEditing && val.id === this.state.editingID ? <td><input className="editingInput" name="desc" onChange={this.handleChange} value={this.state.editingDesc} /></td> : <td>{val.desc}</td>}
                                {user.role === 'admin' ? <td className="deleteTD" width="2%" align="center" onClick={() => { this.delete(val); }}><img width="30%" className="deleteIMG" src={deleteIMG} alt="delete" /></td> : null }
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
