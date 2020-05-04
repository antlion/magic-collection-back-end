const express = require("express");
const router = express.Router();
const collectionSchema = require("../models/Collection");
const authorize = require("../middlewares/auth");

// GET ALL
router.route("/my-collection/:id/all/:with_card").get(authorize,(req, res, next) => {
    if (req.params.with_card == 'true') {
        collectionSchema.find({userId: req.params.id}  , (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                    data
                })
            }
        })
    } else{
        collectionSchema.find({userId: req.params.id}, { cardList:0 }  , (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                    data
                })
            }
        })
    }

})

// GET SINGLE
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

//PATCH
router.route("/my-collection/:id/patch").post(authorize,(req, res, next) => {

    const update = {
        cardList: req.body.cardList
    };
    let doc = collectionSchema.findByIdAndUpdate(req.body.id, update, function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

// search card collection
router.route("/my-collection/:id/search/:card_name").get(authorize,(req, res, next) => {

    let doc = collectionSchema.find(
        {
            wishList: false,
            "cardList.name": req.params.card_name },
        {_id: 0, cardList: {$elemMatch: {name:req.params.card_name}}},
        function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

// add card defualt collection
router.route("/my-collection/:id/default").post(authorize,(req, res, next) => {

    collectionSchema.findOne({name: 'My Collection'}).
        then(function (doc) {
        if (doc) {
            collectionSchema.findOne({"cardList.name": req.body.name}).then(function (element) {
                if(element && element._doc.cardList.length > 0){
                    collectionSchema.findOneAndUpdate({'cardList.name': req.body.name} , {'$set': {'cardList.$.quantity': req.body.quantityCol}}).then(
                        function (err, result) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send(result);
                            }
                        })
                } else {
                    doc.cardList.push(
                        {
                            "quantity": req.body.quantityCol,
                            "name": req.body.name,
                            "edition": req.body.edition,
                            "avatar": req.body.avatar,
                            "type": req.body.type,
                            "manaCost": req.body.manaCost,
                            "png": req.body.png
                        }
                    )
                    doc.save(function (err, result) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send(true);
                        }
                    })
                }
            })

        }
    })

})


module.exports = router;
