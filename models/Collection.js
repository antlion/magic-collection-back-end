// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cardSchema = require('../models/Card');


let collectionSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {
        type: String
    },
    wishList: {
        type: Boolean,
        default: false
    },
    cardList: {
        type: [cardSchema.Schema],
        default: []
    },
    edition: {
        type:String
    }
}, {
    collection: 'cards'
})

module.exports = mongoose.model('Collection', collectionSchema)
