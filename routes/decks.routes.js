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

module.exports = router;
