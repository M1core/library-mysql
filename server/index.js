const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require('cors');
const moment = require('moment')
const jwt = require('jsonwebtoken');

app.listen(3000);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "library",
        password: "root",
        connectTimeout: 86400000,
    }).promise();

app.get('/api/getBooks', (req, res) => {

    const arr = [];
    connection.query(`SELECT books.id_book, books.description, books.release_date, books.name AS \`books\`, author.first_name AS \`firstName\`, 
    author.last_name AS \`lastName\`, genre.name_genre AS \`genre\`
    FROM books INNER JOIN author ON (books.id_author = author.id_author)
    INNER JOIN genre ON (books.id_genre = genre.id_genre)
    GROUP BY books.id_book 
    `)
        .then(([rows, fields]) => {
            rows.map((val, key) => arr.push({
                id: val.id_book,
                name: val.books,
                desc: val.description,
                date: val.release_date,
                author: val.firstName + " " + val.lastName,
                genre: val.genre
            }));
            res.send(arr)
        })
        .catch(err => {
            console.log(err);
        }); 
})

app.post('/api/delBooks', (req, res) => {
    connection.query(`DELETE books.* FROM books WHERE books.id_book = ${req.body.id}`).catch(err => console.log(err))  
});

app.post('/api/sendBook', (req, res) => {    const [firstName, lastName] = req.body.author.split(' ')
    const date = req.body.date.slice(0, 10)

    connection.query(`INSERT INTO books(NAME, release_date, description, id_author, id_genre)
	VALUES ("${req.body.name}", "${date}", "${req.body.desc}", 
	(SELECT author.id_author FROM author
	WHERE author.first_name = "${firstName}" AND author.last_name = "${lastName}"),
	(SELECT genre.id_genre FROM genre
	WHERE genre.name_genre = "${req.body.genre}"))`).catch(err => console.log(err))   
})

app.post('/api/editBook', (req, res) => {    const [firstName, lastName] = req.body.author.split(' ')
    const date = req.body.date.slice(0, 10)

    connection.query(`UPDATE books
	SET books.name = "${req.body.name}", books.release_date = "${date}", books.description = "${req.body.desc}", 
	id_author = (SELECT author.id_author FROM author
	WHERE author.first_name = "${firstName}" AND author.last_name = "${lastName}"),
	books.id_genre = (SELECT genre.id_genre FROM genre
    WHERE genre.name_genre = "${req.body.genre}")
    WHERE books.id_book = "${req.body.id}"`).catch(err => console.log(err))   
})

app.get('/api/getAuthors', (req, res) => {

    const arr = [];
    connection.query("SELECT * FROM author")
        .then(([rows, fields]) => {

            rows.map((val, key) => arr.push(
                {
                    id: val.id_author,
                    first: val.first_name,
                    last: val.last_name,
                    patron: val.patronymic,
                    db: val.date_of_birth,
                    dd: val.date_of_death,
                    lang: val.language_of_works
                }
            ));
            res.send(arr)
        })
        .catch(err => {
            console.log(err);
        });    
})

app.post('/api/sendAuthor', (req, res) => {    
    connection.query(`INSERT INTO author(first_name, last_name, patronymic, date_of_birth, ${req.body.dd == null ? '' : 'date_of_death,'} language_of_works)
    VALUES ("${req.body.first}", "${req.body.last}", "${req.body.patron}", 
    "${moment(req.body.db).format("YYYY-MM-DD").slice(0, 10)}", "${req.body.dd == null ? '' : moment(req.body.dd).format("YYYY-MM-DD").slice(0, 10) + ','}" "${req.body.lang}")`)
    .catch(err => console.log(err)) 
})

app.post('/api/editAuthor', (req, res) => {

    connection.query(`UPDATE author SET 
    author.last_name = "${req.body.first}", 
    author.first_name = "${req.body.last}", 
    author.patronymic = "${req.body.patron}", 
    author.date_of_birth = "${moment(req.body.db).format("YYYY-MM-DD").slice(0, 10)}", 
    ${req.body.dd == null ? '' : `author.date_of_death = "${moment(req.body.dd).format("YYYY-MM-DD").slice(0, 10)}",`} 
    author.language_of_works = "${req.body.lang}"
    WHERE author.id_author = "${req.body.id}"`).catch(err => console.log(err))   
})

app.post('/api/delAuthor', (req, res) => {
    connection.query(`DELETE author.* FROM author WHERE author.id_author = ${req.body.id}`)
    .catch(err => console.log(err)) 
});

app.get('/api/getGenres', (req, res) => {

    const arr = [];
    connection.query("SELECT * FROM genre")
        .then(([rows, fields]) => {

            rows.map((val, key) => arr.push({
                id: val.id_genre,
                name: val.name_genre,
                desc: val.description_genre
            }));
            res.send(arr)
        })
        .catch(err => {
            console.log(err);
        });   
})

app.post('/api/sendGenre', (req, res) => {
    connection.query(`INSERT INTO genre(name_genre, description_genre)
    VALUES ("${req.body.name}", "${req.body.desc}")`).catch((err) => console.log(err))
    .catch(err => console.log(err))  
})

app.post('/api/editGenre', (req, res) => {

    connection.query(`UPDATE genre SET 
    genre.name_genre = "${req.body.name}", 
    genre.description_genre = "${req.body.desc}" 
    WHERE genre.id_genre = "${req.body.id}"`)
    .catch(err => console.log(err)) 
})

app.post('/api/delGenre', (req, res) => {
    connection.query(`DELETE genre.* FROM genre WHERE genre.id_genre = ${req.body.id}`)
    .catch(err => console.log(err))
    
});

app.post('/api/custom', (req, res) => {
    const arr = [];
    connection.query(req.body.string)
        .then(([rows, fields]) => {
            rows.map((val, key) => arr.push(
                {
                    firstName: val.first_name,
                    lastName: val.last_name,
                    patron: val.patronymic,
                    db: val.date_of_birth,
                    dd: val.date_of_death,
                    lang: val.language_of_works,
                    bookName: val.name,
                    bookDesc: val.description,
                    bookDate: val.release_date,
                    genreName: val.name_genre,
                    genreDesc: val.description_genre
                }
            ));
            res.send(arr)
        })
        .catch(err => {
            console.log(err);
        }); 
})

app.post('/api/LogIn', (req, res) => {
    const updateToken = (user, token) => {
        connection.query(`UPDATE users 
            SET users.token = "${token}" WHERE users.name = "${user}"
            `).catch(err => console.log(err))
        
    }
    const arr = [];
    let token;
    let name;

    connection.query(`SELECT users.name, users.token, users.role FROM users
        WHERE users.email = "${req.body.email}" and users.password = "${req.body.password}"
    `)
        .then(([rows, fields]) => {
            if (!rows.length) res.send({ valid: false, message: "Неверная комбинация электронной почты и пароля" })
            else {
                rows.map((val, key) => arr.push({
                    name: val.name,
                    role: val.role
                }));
                token = jwt.sign({ name: arr[0].name }, "m1core");
                name = arr[0].name
                res.send({ valid: true, data: { name: name, role: arr[0].role, token: token }, message: "Успешно авторизованы, вход..." })
                updateToken(name, token);
            }
        })
        .catch(err => {
            console.log(err);
        });   
})

app.post('/api/LogInByToken', (req, res) => {    
    connection.query(`SELECT users.name, users.token, users.role FROM users
        WHERE users.token = "${req.body.token}"
    `)
        .then(([rows, fields]) => {
            if (!rows[0]) res.send({ valid: false })
            else
                res.send({ valid: true, data: { name: rows[0].name, role: rows[0].role, token: rows[0].token } })
        })
        .catch(err => {
            console.log(err);
        });    
})

app.post('/api/SignUp', (req, res) => {
    const answer = (token) => {
        connection.query(`SELECT users.name, users.role, users.token FROM users 
            WHERE users.token = "${token}"
        `).then(([rows, fields]) => res.send({ valid: true, data: { name: rows[0].name, role: rows[0].role, token: rows[0].token } }))
            .catch(err => res.send(err))   
    }
    
    const token = jwt.sign({ name: req.body.name }, 'm1core')
    connection.query(`INSERT INTO users (users.name, users.email, users.password, users.token) 
                        VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}", "${token}")
    `)
        .then(([rows, fields]) => answer(token))
        .catch(err => {
            console.log(err);
            res.send({ valid: false, error: err });
        });
})

app.post('/api/getComments', (req, res) => {

    const arr = [];
    connection.query(`SELECT * FROM comments WHERE comments.book = "${req.body.bookId}"`)
        .then(([rows, fields]) => {
            
            rows.map((val, key) => arr.push({
                id: val.id,
                text: val.text,
                author: val.author,
                date: moment(val.date).format('MMMM Do YYYY, h:mm:ss a')

            }));
            res.send(arr.length > 0 ? arr : [])
        })
        .catch(err => {
            console.log(err);
        });   
})

app.post('/api/sendComment', (req, res) => {
    console.log(req.body)
    const arr = [];
    connection.query(`INSERT INTO comments (comments.author, comments.text, comments.book) 
    VALUES ("${req.body.user.name}", "${req.body.comment}", "${req.body.book}")`)
        .then(res.send({status: 200}))
        .catch(err => {
            console.log(err);
        });   
})