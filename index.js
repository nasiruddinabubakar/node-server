const express = require('express');
const app = express();
const port = 8000;
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { uuid } = require('uuidv4');

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moviesdb',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

app.get('/register', (req, res) => {});

app.post('/get-user-movies',async (req, res) => {
  const { user_id } = req.body;
    console.log("Reqqqq ",user_id);
  const movies = await new Promise((resolve, reject) => {
    db.query(
      'SELECT name FROM movie WHERE user_id = ?',
      [user_id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  }); 

  const movieNames = movies.map(row => row.name);
  try{
  const response = await fetch('http://localhost:5000/api/recommendMovies',{
    method: 'POST',
    body: JSON.stringify({watchedMovies: movieNames} ),
    headers: {
      'Content-Type': 'application/json',
    },
  });
    const recommendedMovies = await response.json();
    res.send(recommendedMovies);
  }catch(err){
    res.send([]);
  }  

})
  


app.post('/savemovie', (req, res) => {
  const { user_id, movie } = req.body;
  db.query(
    'INSERT INTO movie (movie_id,name,user_id) VALUES(?,?,?) ',
    [uuid(), movie, user_id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.send('Movie added to database');
    }
  );
});

app.get('/login', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`);
});
