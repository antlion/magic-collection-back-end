// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cardSchema = new Schema({
    name: {
        type: String
    },
    edition: {
        type: String
    },
    avatar: {
        type: String
    },
    quantity: {
        type: Number
    },
    rarity: {
        type: String
    },
    price: {
        type: Number
    },
    set_number: {
        type: Number
    }
}, {
    collection: 'cards'
})

module.exports = mongoose.model('Card', cardSchema)
