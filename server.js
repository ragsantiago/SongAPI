const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const songsPath = __dirname + '/songs.json';

app.use(bodyParser.json());
app.get('/listSongs', function (req, res) {
   fs.readFile(songsPath, 'utf8', function (err, data) {
      if (err) {
        res.status(500).send("Error reading songs data.");
        return;
      }
      const songs = JSON.parse(data);
      res.json(songs);
   });
});
app.post('/addSong', function (req, res) {
  fs.readFile(songsPath, 'utf8', function (err, data) {
    if (err) {
      res.status(500).send("Error reading songs data.");
      return;
    }
    const songs = JSON.parse(data);
    const newSong = req.body;
    newSong.id = songs.length + 1;
    songs.push(newSong);

    fs.writeFile(songsPath, JSON.stringify(songs, null, 2), function (err) {
      if (err) {
        res.status(500).send("Error writing songs data.");
        return;
      }
      res.json(newSong);
    });
  });
});
app.delete('/deleteSong/:id', function (req, res) {
  const songId = parseInt(req.params.id);

  fs.readFile(songsPath, 'utf8', function (err, data) {
    if (err) {
      res.status(500).send("Error reading songs data.");
      return;
    }

    const songs = JSON.parse(data);
    const songIndex = songs.findIndex(song => song.id === songId);

    if (songIndex !== -1) {
      const deletedSong = songs.splice(songIndex, 1)[0];

      fs.writeFile(songsPath, JSON.stringify(songs, null, 2), function (err) {
        if (err) {
          res.status(500).send("Error writing songs data.");
          return;
        }
        res.json(deletedSong);
      });
    } else {
      res.status(404).json({ message: "Song not found" });
    }
  });
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
