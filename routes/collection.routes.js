const express = require("express");
const router = express.Router();
const collectionSchema = require("../models/Collection");
const authorize = require("../middlewares/auth");

// GET ALL
router.route("/my-collection/:id/all").get(authorize,(req, res, next) => {
    collectionSchema.find({userId: req.params.id} , (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data
            })
        }
    })
})

// GET
router.route('/my-collection/:id/:id_deck').get(authorize, (req, res, next) => {
    collectionSchema.findById(req.params.id_deck, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data
            })
        }
    })
})

// ADD
router.route("/my-collection/:id/add").post(authorize,(req, res, next) => {
    const deck = new collectionSchema({
        name: req.body.name,
        wishList: req.body.wishList,
        userId: req.params.id
    });
    deck.save().then((response) => {
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
