import React from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import '../styles/table.css';

import deleteIMG from '../ico/PinClipart.com_cross-with-shadow-clipart_3225390.png';
import changeIMG from '../ico/edit.png';
import saveIMG from '../ico/floppy-icon.png';

export default class TableAuthors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      storedResult: [],
      isEditing: false,
      editingID: '',
      editingFirstName: '',
      editingLastName: '',
      editingPatron: '',
      editingDB: '',
      editingDD: '',
      editingLang: '',

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTimeDB = this.handleChangeTimeDB.bind(this);
    this.handleChangeTimeDD = this.handleChangeTimeDD.bind(this);
  }

  componentDidMount() {
    this.query();
  }

  handleChangeTimeDB(date) {
    this.setState({
      editingDB: date,
    });
  }

  handleChangeTimeDD(date) {
    this.setState({
      editingDD: date,
    });
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'firstName':
        this.setState({
          editingFirstName: event.target.value,
        });
        break;
      case 'lastName':
        this.setState({
          editingLastName: event.target.value,
        });
        break;

      case 'patron':
        this.setState({
          editingPatron: event.target.value,
        });
        break;

      case 'lang':
        this.setState({
          editingLang: event.target.value,
        });
        break;
      default: alert('ti debil?');
    }
  }

  async query() {
    const res = await axios.get('http://localhost:3000/api/getAuthors');
    this.setState({ storedResult: res.data });
    this.setState({ isLoading: false });
  }

  async delete(del) {
    console.log(del);
    axios({
      method: 'post',
      url: 'http://localhost:3000/api/delAuthor',
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
      editingFirstName: val.first,
      editingLastName: val.last,
      editingPatron: val.patron,
      editingDB: val.db,
      editingDD: val.dd,
      editingLang: val.lang,
    });
  }

  save() {
    this.setState({ isLoading: true });
    axios({
      method: 'post',
      url: 'http://localhost:3000/api/editAuthor',
      data: {
        id: this.state.editingID,
        first: this.state.editingFirstName,
        last: this.state.editingLastName,
        patron: this.state.editingPatron,
        db: this.state.editingDB,
        dd: this.state.editingDD,
        lang: this.state.editingLang,
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
                            <th className="text-center">Имя</th>
                            <th className="text-center">Фамилия</th>
                            <th className="text-center">Отчество</th>
                            <th className="text-center">Дата рождения</th>
                            <th className="text-center">Дата смерти</th>
                            <th className="text-center">Язык произведений</th>
                            {user.role === 'admin' ? <th className="text-center">Удалить</th> : null }
                            {user.role === 'admin' ? <th className="text-center">Изменить</th> : null }
                          </tr>
                          {
                            this.state.storedResult.map((val, key) => (
                              <tr key={key}>
                                <td align="center">{val.id}</td>
                                {this.state.isEditing && val.id === this.state.editingID ? <td><input className="editingInput" name="firstName" onChange={this.handleChange} value={this.state.editingFirstName} /></td> : <td>{val.first}</td>}
                                {this.state.isEditing && val.id === this.state.editingID ? <td><input className="editingInput" name="lastName" onChange={this.handleChange} value={this.state.editingLastName} /></td> : <td>{val.last}</td>}
                                {this.state.isEditing && val.id === this.state.editingID ? <td><input className="editingInput" name="patron" onChange={this.handleChange} value={this.state.editingPatron} /></td> : <td>{val.patron}</td>}

                                {this.state.isEditing && val.id === this.state.editingID
                                  ? (
                                    <td>
                                      <DatePicker className="editingInput" name="DB" selected={Date.parse(this.state.editingDB)} onChange={this.handleChangeTimeDB} />
                                    </td>
                                  )
                                  : <td align="center">{val.db.slice(0, 10)}</td>}

                                {this.state.isEditing && val.id === this.state.editingID
                                  ? (
                                    <td>
                                      <DatePicker className="editingInput" name="DD" selected={Date.parse(this.state.editingDD)} onChange={this.handleChangeTimeDD} />
                                    </td>
                                  )
                                  : <td align="center">{val.dd !== null ? val.dd.slice(0, 10) : val.dd}</td>}

                                {this.state.isEditing && val.id === this.state.editingID ? <td><input className="editingInput" name="lang" onChange={this.handleChange} value={this.state.editingLang} /></td> : <td>{val.lang}</td>}

                                {user.role === 'admin' ? <td className="deleteTD" width="2%" align="center" onClick={() => { this.delete(val); }}><img width="30%" className="deleteIMG" src={deleteIMG} alt="delete" /></td> : null }
                                {user.role === 'admin' ? <td className="deleteTD" width="2%" align="center" onClick={() => { this.edit(val); }}><img width="30%" className="deleteIMG" src={changeIMG} alt="edit" /></td> : null }
                                {this.state.isEditing && val.id === this.state.editingID ? <td  width="3%" className="deleteTD" align="center" onClick={() => { this.save(); }}><img width="100%" src={saveIMG} alt="save" /></td> : null}
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
