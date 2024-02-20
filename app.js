const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const path = require('path')
db = null
const dbPath = path.join(__dirname, 'moviesData.db')
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at https://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// Getting all movies names.
app.get('/movies/', async (request, response) => {
  const getAllMoviesQuery = `
    SELECT movie_name FROM movie;`
  const moviesNames = await db.all(getAllMoviesQuery)
  response.send(moviesNames)
})

// creating new movie name
app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovieQuery = `
  INSERT INTO movie (director_id, movie_name, lead_actor)
  VALUES
  (${directorId},'${movieName}', '${leadActor}');`
  const dbResponse = await db.run(addMovieQuery)
  const movieId = dbResponse.lastID
  response.send('Movie Successfully Added')
})

// Return the movie based on movieId
app.get('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `
  SELECT * from movie where movie_id=${movieId};`
  const data = await db.get(getMovieQuery)
  response.send(data)
})

// update the movie details based on movieId
app.put('/movies/:movieId', async (request, response) => {
  const movieId = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const updateQuery = `
  UPDATE movie
  SET 
  director_id=${directorId},
  movie_name='${movieName}',
  lead_actor='${leadActor}'
  WHERE movie_id=${movieId};`
  await db.run(updateQuery)
  response.send('Movie Details Updated')
})
module.exports = app
