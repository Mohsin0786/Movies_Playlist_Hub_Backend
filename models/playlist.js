const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const playlistSchema = mongoose.Schema({
    userId: {
        type: 'string',
        require: true
    },
    title: {
        type: 'string',
        require: true
    },
    visibility: {
        type: 'string',
        require: true
    },
    movies:{
        type: [Object],
        require: true
    }
});

playlistSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Playlist', playlistSchema);