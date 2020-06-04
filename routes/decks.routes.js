const express = require("express");
const router = express.Router();
const deckSchema = require("../models/Deck");
const authorize = require("../middlewares/auth");
var mongoose = require('mongoose');

// DELETE DECK
router.route("/my-decks/:id_user/:id_deck/delete").get(authorize,(req, res, next) => {
    deckSchema.findByIdAndRemove(req.params.id_deck , (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data
            })
        }
    })
})


router.post("/my-decks/:id/patch",(req, res, next) => {

    const filter = { _id: req.body.id };
    const update = {
        creatures: req.body.creatures,
        artifacts: req.body.artifacts,
        enchantments: req.body.enchantments,
        planeswalkers: req.body.planeswalkers,
        spells: req.body.spells,
        lands: req.body.lands,
        sideboard: req.body.sideboard,
        mayboard: req.body.mayboard
    };
    let doc = deckSchema.findByIdAndUpdate(req.body.id, update, function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.route('/my-decks/:id/:id_deck').get(authorize, (req, res, next) => {
    deckSchema.findById(req.params.id_deck, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data
            })
        }
    })
})


// Get Single User
router.route('/my-decks/:id').get(authorize, (req, res, next) => {
    deckSchema.find({userId: req.params.id} , (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data
            })
        }
    })
})

router.post("/my-decks/:id/add",(req, res, next) => {

    var filter = {_id:   req.body._id == undefined ? new mongoose.mongo.ObjectID() : req.body._id},
        update = { name: req.body.name,
        type: req.body.type,
        userId: req.params.id},
        options = { upsert: true, new: true};


    deckSchema.findOneAndUpdate(filter, update, options).then((response) => {
        res.status(201).json({
            message: "Deck Added!",
            result: response
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
})

module.exports = router;
