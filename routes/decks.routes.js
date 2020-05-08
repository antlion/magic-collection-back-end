const express = require("express");
const router = express.Router();
const deckSchema = require("../models/Deck");
const authorize = require("../middlewares/auth");

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

module.exports = router;