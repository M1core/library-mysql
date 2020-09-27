import React from 'react';
import {
  InputGroup, Button, Dropdown, DropdownButton,
} from 'react-bootstrap';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/table.css';

export default class Custom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qString: '',
      orderField: 'Выберите поле для сортировки',
      storedResult: [],
      isLoading: false,

      firstName: false,
      lastName: false,
      patron: false,
      db: false,
      dd: false,
      lang: false,
      bookName: false,
      bookDesc: false,
      bookDate: false,
      genreName: false,
      genreDesc: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'orderBy':
        this.setState({
          orderField: event.target.value,
        });
        break;
      case 'firstName':
        this.setState({
          qString: `${this.state.qString} author.first_name,`,
          firstName: true,
        });
        break;
      case 'lastName':
        this.setState({
          qString: `${this.state.qString} author.last_name,`,
          lastName: true,
        });
        break;
      case 'patron':
        this.setState({
          qString: `${this.state.qString} author.patronymic,`,
          patron: true,
        });
        break;
      case 'db':
        this.setState({
          qString: `${this.state.qString} author.date_of_birth,`,
          db: true,
        });
        break;
      case 'dd':
        this.setState({
          qString: `${this.state.qString} author.date_of_death,`,
          dd: true,
        });
        break;
      case 'lang':
        this.setState({
          qString: `${this.state.qString} author.lang,`,
          lang: true,
        });
        break;
      case 'bookName':
        this.setState({
          qString: `${this.state.qString} books.name,`,
          bookName: true,
        });
        break;
      case 'relDate':
        this.setState({
          qString: `${this.state.qString} books.release_date,`,
          bookDate: true,
        });
        break;
      case 'bookDesc':
        this.setState({
          qString: `${this.state.qString} books.description,`,
          bookDesc: true,
        });
        break;
      case 'genreName':
        this.setState({
          qString: `${this.state.qString} genre.name_genre,`,
          genreName: true,
        });
        break;
      case 'genreDesc':
        this.setState({
          qString: `${this.state.qString} genre.description_genre,`,
          genreDesc: true,
        });
        break;

      default: alert(event.target.value);
    }
  }

  query() {
    this.setState({ isLoading: true });
    const qString = `SELECT ${this.state.qString.length ? this.state.qString.slice(0, this.state.qString.length - 1) : 'books.id_book'}
    FROM books INNER JOIN author ON (books.id_author = author.id_author)
    INNER JOIN genre ON (books.id_genre = genre.id_genre)
    ${this.state.orderField !== 'Выберите поле для сортировки' ? `ORDER BY ${this.state.orderField} ${this.state.isDesc ? 'DESC' : ''}` : ''}
    `;
    axios({
      method: 'post',
      url: 'http://localhost:3000/api/custom',
      data: {
        string: qString,
      },
    }).then((res) => {
      this.setState({
        storedResult: res.data,
      });
    });

    this.setState({ isLoading: false });
  }

  render() {
    return (
      <div style={{ marginBottom: '3%' }}>
        <InputGroup style={{ width: '100%' }}>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="firstName" />
            <InputGroup.Text>
              Имя
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="lastName" />
            <InputGroup.Text>
              Фамилия
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="patron" />
            <InputGroup.Text>
              Отчество
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="db" />
            <InputGroup.Text>
              Год рождения
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="dd" />
            <InputGroup.Text>
              Год смерти
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="lang" />
            <InputGroup.Text>
              Язык произведений
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="bookName" />
            <InputGroup.Text>
              Название книги
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="relDate" />
            <InputGroup.Text>
              Дата публикации
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="bookDesc" />
            <InputGroup.Text>
              Описание книги
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="genreName" />
            <InputGroup.Text>
              Название жанра
            </InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Prepend>
            <InputGroup.Checkbox onChange={this.handleChange} name="genreDesc" />
            <InputGroup.Text>
              Описание жанра
            </InputGroup.Text>
          </InputGroup.Prepend>
        </InputGroup>
        <DropdownButton title={this.state.orderField}>
          <Dropdown.Item disabled> Выберите поле для сортировки  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'Выберите поле для сортировки' })}> none  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'author.first_name' })}> Имя  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'author.last_name' })}> Фамилия  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'author.patronymic' })}> Отчество  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'author.date_of_birth' })}> Год рождения  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'author.date_of_death' })}> Год смерти </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'author.language_of_works' })}> Язык произведений  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'books.name' })}> Название книги  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'books.release_date' })}> Дата публикации  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'books.description' })}> Описание книги  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'genre.name_genre' })}> Название жанра  </Dropdown.Item>
          <Dropdown.Item onClick={() => this.setState({ orderField: 'author.description_genre' })}> Описание жанра  </Dropdown.Item>
        </DropdownButton>
        <Button onClick={() => { this.query(); }}>Подтвердить</Button>
        {this.state.isLoading ? <div>Loading...</div>
          : (
            <table className="table" style={{ width: '90%', margin: 'auto', marginTop: '2%' }}>

              <tbody>
                <tr>
                  {this.state.firstName ? <th className="text-center">Имя</th> : null}
                  {this.state.lastName ? <th className="text-center">Фамилия</th> : null}
                  {this.state.patron ? <th className="text-center">Отчество</th> : null}
                  {this.state.db ? <th className="text-center">Год рождения</th> : null}
                  {this.state.dd ? <th className="text-center">Год смерти</th> : null}
                  {this.state.lang ? <th className="text-center">Язык произведений</th> : null}
                  {this.state.bookName ? <th className="text-center">Название книги</th> : null}
                  {this.state.bookDate ? <th className="text-center">Дата публикации</th> : null}
                  {this.state.bookDesc ? <th className="text-center">Описание книги</th> : null}
                  {this.state.genreName ? <th className="text-center">Название жанра</th> : null}
                  {this.state.genreDesc ? <th className="text-center">Описание жанра</th> : null}
                </tr>
                {
                        this.state.isLoading ? null : this.state.storedResult.map((val, key) => (
                          <tr key={key}>
                            {this.state.firstName ? <td>{val.firstName}</td> : null}
                            {this.state.lastName ? <td>{val.lastName}</td> : null}
                            {this.state.patron ? <td>{val.patron}</td> : null}
                            {this.state.db ? <td>{val.db.slice(0, 10)}</td> : null}
                            {this.state.dd ? <td>{val.dd.slice(0, 10)}</td> : null}
                            {this.state.lang ? <td>{val.lang}</td> : null}
                            {this.state.bookName ? <td>{val.bookName}</td> : null}
                            {this.state.bookDate ? <td>{val.bookDate.slice(0, 10)}</td> : null}
                            {this.state.bookDesc ? <td>{val.bookDesc}</td> : null}
                            {this.state.genreName ? <td>{val.genreName}</td> : null}
                            {this.state.genreDesc ? <td>{val.genreDesc}</td> : null}
                          </tr>
                        ))
                    }
              </tbody>
            </table>
          )}
      </div>
    );
  }
}
