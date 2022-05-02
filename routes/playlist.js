const express = require('express');
const playlistrouter = express.Router();
require('dotenv').config()

const playlistCtrl = require('../controller/playlist');

playlistrouter.post('/playlist',playlistCtrl.addnewPlaylist);
playlistrouter.patch('/playlist',playlistCtrl.addPlaylist);
playlistrouter.get('/playlist',playlistCtrl.getPlaylist);
playlistrouter.get('/listDetails/:id',playlistCtrl.getlistDetails);
module.exports = playlistrouter;