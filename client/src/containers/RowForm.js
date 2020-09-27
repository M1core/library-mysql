import React from 'react';
import { FormControl, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class RowForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      storedAuthors: [],
      storedGenres: [],
      choosenForm: '1',

      startDate: new Date(),
      inputBookName: null,
      inputAuthor: null,
      inputGenre: null,
      inputDesc: null,

      inputFirstName: null,
      inputLastName: null,
      inputPatron: null,
      inputLang: null,
      inputDB: null,
      inputDD: null,

      inputGenreName: null,
      inputGenreDesc: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeTimeDD = this.handleChangeTimeDD.bind(this);
    this.handleChangeTimeDB = this.handleChangeTimeDB.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getAuthorsAndGenres();
  }

  async getAuthorsAndGenres() {
    const resA = await axios.get('http://localhost:3000/api/getAuthors');
    this.setState({ storedAuthors: resA.data });
    const resG = await axios.get('http://localhost:3000/api/getGenres');
    this.setState({ storedGenres: resG.data });
    this.setState({ isLoading: false });
  }

  async sendForm() {
    switch (this.state.choosenForm) {
      case '1':
        axios({
          method: 'post',
          url: 'http://localhost:3000/api/sendBook',
          data: {
            name: this.state.inputBookName,
            author: this.state.inputAuthor,
            genre: this.state.inputGenre,
            desc: this.state.inputDesc,
            date: this.state.startDate,
          },
        });
        break;
      case '2':
        console.log(this.state.inputDD);
        axios({
          method: 'post',
          url: 'http://localhost:3000/api/sendAuthor',
          data: {
            first: this.state.inputFirstName,
            last: this.state.inputLastName,
            patron: this.state.inputPatron,
            db: this.state.inputDB,
            dd: this.state.inputDD === '' ? null : this.state.inputDD,
            lang: this.state.inputLang,
          },
        });
        break;
      case '3':
        axios({
          method: 'post',
          url: 'http://localhost:3000/api/sendGenre',
          data: {
            name: this.state.inputGenreName,
            desc: this.state.inputGenreDesc,
          },
        })
        break;
      default: alert('chtoto poshlo ne tak, blyat');
    }
  }

  handleChange(event) {
    console.log(event.target.name);

    switch (event.target.name) {
      case 'choosenForm':
        this.setState({
          choosenForm: event.target.value,
        });
        break;
      case 'bookName':
        this.setState({
          inputBookName: event.target.value,
        });
        break;
      case 'author':
        this.setState({
          inputAuthor: event.target.value,
        });
        break;

      case 'genre':
        this.setState({
          inputGenre: event.target.value,
        });
        break;

      case 'desc':
        this.setState({
          inputDesc: event.target.value,
        });
        break;
      case 'firstName':
        this.setState({
          inputFirstName: event.target.value,
        });
        break;
      case 'lastName':
        this.setState({
          inputLastName: event.target.value,
        });
        break;
      case 'patron':
        this.setState({
          inputPatron: event.target.value,
        });
        break;
      case 'db':
        this.setState({
          inputDB: event.target.value,
        });
        break;
      case 'dd':
        this.setState({
          inputDD: event.target.value,
        });
        break;
      case 'lang':
        this.setState({
          inputLang: event.target.value,
        });
        break;
      case 'genreName':
        this.setState({
          inputGenreName: event.target.value,
        });
        break;
      case 'genreDesc':
        this.setState({
          inputGenreDesc: event.target.value,
        });
        break;
      default: alert('ti debil?');
    }
  }

  handleChangeTimeDB(date) {
    this.setState({
      inputDB: date,
    });
  }

  handleChangeTimeDD(date) {
    this.setState({
      inputDD: date,
    });
  }

  handleChangeTime(date) {
    this.setState({
      startDate: date,
    });
  }

  handleSubmit(event) {
    this.sendForm();
    event.preventDefault();
  }

  renderSwitch() {
    switch (this.state.choosenForm) {
      case '1': return (
        <div>
          <Form.Label>Введите информацию о книге</Form.Label>
          <FormControl name="bookName" style={{ marginBottom: '5%' }} required type="text" value={this.state.inputBookName} onChange={this.handleChange} placeholder="Название книги" />
          <FormControl name="author" style={{ marginBottom: '5%' }} required as="select" value={this.state.inputAuthor} onChange={this.handleChange}>
            <option disabled selected defaultValue="null">Выберите автора</option>
            {this.state.isLoading ? <option disabled>Loading...</option>
              : this.state.storedAuthors.map(((val, key) => (
                <option key={key} value={`${val.first} ${val.last}`}>
                  {`${val.first} ${val.last}`}
                  {' '}

                </option>
              )))}
          </FormControl>
          <FormControl name="genre" style={{ marginBottom: '5%' }} required as="select" value={this.state.inputGenre} onChange={this.handleChange}>
            <option disabled selected defaultValue="null">Выберите жанр</option>
            {this.state.isLoading ? <option disabled>Loading...</option>
              : this.state.storedGenres.map(((val, key) =><option key={key} defaultValue={val.name}>{val.name}</option>))}
          </FormControl>
          <FormControl name="desc" style={{ marginBottom: '5%' }} required as="textarea" value={this.state.inputDesc} onChange={this.handleChange} placeholder="Описание" />
          <Form.Label style={{ paddingRight: '24%' }}>Дата публикации</Form.Label>
          <FormControl name="date" as={DatePicker} style={{ width: '100%' }} value={this.inputDate} selected={this.state.startDate} onChange={this.handleChangeTime} />
          <br />
          <Button style={{ marginTop: '5%' }} type="submit" value="submit">Добавить</Button>
        </div>
      );

      case '2': return (
        <div>
          <Form.Label>Введите информацию об Авторе</Form.Label>
          <FormControl name="firstName" style={{ marginBottom: '5%' }} required type="text" value={this.state.inputFirstName} onChange={this.handleChange} placeholder="Имя" />
          <FormControl name="lastName" style={{ marginBottom: '5%' }} required type="text" value={this.state.inputLastName} onChange={this.handleChange} placeholder="Фамилия" />
          <FormControl name="patron" style={{ marginBottom: '5%' }} required type="text" value={this.state.inputPatron} onChange={this.handleChange} placeholder="Отчество" />

          <Form.Label style={{ paddingRight: '24%' }}>Дата рождения</Form.Label>
          <br />
          <FormControl name="db" as={DatePicker} style={{ width: '100%' }} value={this.inputDate} selected={this.state.inputDB} onChange={this.handleChangeTimeDB} />
          <br />
          <Form.Label style={{ paddingRight: '24%' }}>Дата смерти</Form.Label>
          <br />
          <FormControl name="dd" as={DatePicker} style={{ width: '100%' }} value={this.inputDate} selected={this.state.inputDD} onChange={this.handleChangeTimeDD} />
          <br />
          <FormControl name="lang" style={{ marginBottom: '5%', marginTop: '5%' }} required type="text" value={this.state.inputLang} onChange={this.handleChange} placeholder="Язык произведений" />
          <Button type="submit" value="submit">Добавить</Button>
        </div>
      );

      case '3': return (
        <div>
          <Form.Label>Введите информацию о жанре</Form.Label>
          <FormControl name="genreName" style={{ marginBottom: '5%' }} required type="text" value={this.state.inputGenreName} onChange={this.handleChange} placeholder="Название" />
          <FormControl name="genreDesc" style={{ marginBottom: '5%' }} required type="text" value={this.state.inputGenreDesc} onChange={this.handleChange} placeholder="Описание" />
          <Button type="submit" value="submit">Добавить</Button>
        </div>
      );

      default: return (<div />);
    }
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit} style={{ width: '40%', margin: 'auto', paddingBottom: '10%' }}>
          <Form.Label>Выберите в какую таблицу добавить запись</Form.Label>
          <FormControl name="choosenForm" style={{ marginBottom: '5%' }} required as="select" value={this.state.choosenForm} onChange={this.handleChange}>
            <option value="1"> Книги </option>
            <option value="2"> Авторы </option>
            <option value="3"> Жанры </option>
          </FormControl>

          {this.renderSwitch()}

        </Form>

      </div>
    );
  }
}
