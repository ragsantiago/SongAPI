const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
let songs = JSON.parse(fs.readFileSync('songs.json', 'utf8'));
app.get('/api/songs', (req, res) => {
  res.json(songs);
});
app.get('/api/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);
  const song = songs.find((s) => s.id === songId);

  if (!song) {
    res.status(404).send('Song not found');
  } else {
    res.json(song);
  }
});
app.post('/api/songs', (req, res) => {
  const newSong = req.body;
  songs.push(newSong);
  fs.writeFileSync('songs.json', JSON.stringify(songs));
  res.json(newSong);
});
app.put('/api/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);
  const updatedSong = req.body;
  const songIndex = songs.findIndex((s) => s.id === songId);

  if (songIndex === -1) {
    res.status(404).send('Song not found');
  } else {
    songs[songIndex] = { ...songs[songIndex], ...updatedSong };
    fs.writeFileSync('songs.json', JSON.stringify(songs));
    res.json(songs[songIndex]);
  }
});
app.delete('/api/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);
  const songIndex = songs.findIndex((s) => s.id === songId);

  if (songIndex === -1) {
    res.status(404).send('Song not found');
  } else {
    songs.splice(songIndex, 1);
    fs.writeFileSync('songs.json', JSON.stringify(songs));
    res.send('Song deleted');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
