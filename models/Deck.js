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
        type: [cardSchema.Schema],
        default: []
    },
    artifacts: {
        type: [cardSchema.Schema],
        default: []
    },
    enchantments: {
        type: [cardSchema.Schema],
        default: []
    },
    planeswalkers: {
        type: [cardSchema.Schema],
        default: []
    },
    spells:{
        type: [cardSchema.Schema],
        default: []
    },
    lands: {
        type: [cardSchema.Schema],
        default: []
    },
    sideboard: {
        type: [cardSchema.Schema],
        default: []
    },
    mayboard: {
        type: [cardSchema.Schema],
        default: []
    }
}, {
    collection: 'decks'
})

module.exports = mongoose.model('Deck', deckSchema)
