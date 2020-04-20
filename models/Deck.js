// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cardSchema = require('../models/Card');

let deckSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {
        type: String
    },
    type: {
        type: String
    },
    creatures: {
        type: [cardSchema.Schema]
    }
}, {
    collection: 'decks'
})

module.exports = mongoose.model('Deck', deckSchema)
