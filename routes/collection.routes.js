const express = require("express");
const router = express.Router();
const collectionSchema = require("../models/Collection");
const cardSchema = require("../models/Card");

const authorize = require("../middlewares/auth");

// add card to collection set
router.route("/my-collection/:id/collectionCode").post(authorize, (req, res, next) => {
    collectionSchema.findOne({edition: req.body.edition, userId: req.params.id}).then(function (doc) {
        if (doc) { // collezione trovata
            collectionSchema.findOne({
                edition: req.body.edition, userId: req.params.id,
                "cardList.name": req.body.name
            }).then(function (element) {
                if (element != null && element._doc.cardList.length > 0) { // carta trovata
                    if (req.body.quantity > 0) {
                        collectionSchema.findOneAndUpdate({'cardList.name': req.body.name}, {'$inc': {'cardList.$.quantity': req.body.quantity}}).then(
                            function (result, err) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send(result);
                                }
                            })
                    }

                } else {
                    doc.cardList.push(
                        {
                            "quantity": req.body.quantity,
                            "name": req.body.name,
                            "edition": req.body.edition,
                            "avatar": req.body.avatar,
                            "type": req.body.type,
                            "manaCost": req.body.manaCost,
                            "png": req.body.png,
                            "price": req.body.price,
                            "rarity": req.body.rarity,
                            "set_number": req.body.set_number
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

        } // non esiste
        else {

            const deck = new collectionSchema({
                name: req.body.edition + " Collection",
                wishList: false,
                userId: req.params.id,
                edition: req.body.edition
            });
            deck.save().then((response) => {
                response.cardList.push(
                    {
                        "quantity": req.body.quantity,
                        "name": req.body.name,
                        "edition": req.body.edition,
                        "avatar": req.body.avatar,
                        "type": req.body.type,
                        "manaCost": req.body.manaCost,
                        "png": req.body.png,
                        "price": req.body.price,
                        "rarity": req.body.rarity,
                        "set_number": req.body.set_number
                    }
                )
                response.save(function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(true);
                    }
                })
            }).catch(error => {
                res.status(500).json({
                    error: error
                });
            });
        }
    })

})




//push card in collection
router.route("/my-collection/:id/:id_collection/push").post(authorize, (req, res, next) => {
    let card = req.body
    collectionSchema.findById(req.params.id_collection).then(function (doc) {
        if (doc) {
            const card = new cardSchema({
                name: req.body.name,
                edition: req.body.edition,
                avatar: req.body.avatar,
                quantity: req.body.quantity,
                rarity: req.body.rarity
            });
            doc.cardList.push(req.body)
            doc.save().then((response) => {
                res.status(201).json({
                    message: "Deck Added!",
                    result: response
                });
            })
        }
    });
});

//patch card in collection
router.route("/my-collection/:id/:id_collection/patchCard").post(authorize, (req, res, next) => {

    collectionSchema.update(
        {
            _id: req.params.id_collection,
            "cardList.name": req.body.name
        },
        {"$set": {"cardList.$.quantity": req.body.quantity}},
        function (err, company) {
            if (err) {
                res.send(err);
            } else {
                res.send(company)
            }
        })


});

//delete card in collection
router.route("/my-collection/:id/:id_collection/deleteCard").post(authorize, (req, res, next) => {

    collectionSchema.updateOne(
        {
            _id: req.params.id_collection,
        },
        { $pull: {            "cardList": {name: req.body.name}
            } },
        function (err, company) {
            if (err) {
                res.send(err);
            } else {
                res.send(company)
            }
        })


});

// delete
router.route("/my-collection/:id/delete/:id_collection").delete(authorize, (req, res, next) => {
    collectionSchema.findByIdAndRemove(req.params.id_collection, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data
            })
        }
    })
});

// GET ALL
router.route("/my-collection/:id/all/:with_card").get(authorize, (req, res, next) => {
    if (req.params.with_card == 'true') {
        collectionSchema.find({userId: req.params.id}, (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                    data
                })
            }
        })
    } else {
        collectionSchema.find({userId: req.params.id}, {cardList: 0}, (error, data) => {
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
router.route("/my-collection/:id/add").post(authorize, (req, res, next) => {
    const deck = new collectionSchema({
        name: req.body.name,
        wishList: req.body.wishList,
        userId: req.params.id,
        edition: req.params['edition']
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
router.route("/my-collection/:id/patch").post(authorize, (req, res, next) => {

    const update = {
        cardList: req.body.cardList
    };
    let doc = collectionSchema.findByIdAndUpdate(req.body.id, update, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})


router.route("/my-collection/:id/searchCards/:id_collection/:query").get(authorize, (req, res, next) => {

    let doc = collectionSchema.find(
        {
            _id: req.params.id_collection,
            "cardList.name": new RegExp(".*" + req.params.query + ".*", "i")
        },
        {_id: 0, cardList: {$elemMatch: {name: new RegExp(".*" + req.params.query + ".*", "i")}}},
        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
});

// search card in all collection
router.route("/my-collection/:id/searchCardsAmongCollection/:query").get(authorize, (req, res, next) => {

    let doc = collectionSchema.find(
        {
            userId: req.params.id,
            "cardList.name": new RegExp(".*" + req.params.query + ".*", "i")
        },
        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
});

// search card collection
router.route("/my-collection/:id/search/:card_name/:wishlist").get(authorize, (req, res, next) => {

    if (req.params.card_name.indexOf("$") > -1) {
        req.params.card_name = req.params.card_name.replace("$", '//');
    }
    let doc = collectionSchema.find(
        {
            userId: req.params.id,
            wishList: req.params.wishlist === 'true',
            "cardList.name": req.params.card_name
        },
        {_id: 0, cardList: {$elemMatch: {name: req.params.card_name}}},
        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
})

// add card defualt collection
router.route("/my-collection/:id/default/:wishList").post(authorize, (req, res, next) => {
    collectionSchema.findOne({name: req.params.wishList == 'false' ? 'My Collection' : 'Wishlist'}).then(function (doc) {
        if (doc) {
            collectionSchema.findOne({
                name: req.params.wishList == 'false' ? 'My Collection' : 'Wishlist',
                "cardList.name": req.body.name
            }).then(function (element) {
                if (element != null && element._doc.cardList.length > 0) {
                    if (req.body.quantityCol > 0) {
                        collectionSchema.findOneAndUpdate({'cardList.name': req.body.name}, {'$set': {'cardList.$.quantity': req.body.quantityCol, 'cardList.$.price': req.body.price }}).then(
                            function (result, err) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send(result);
                                }
                            })
                    } else {
                        for (let i = 0; i < element._doc.cardList.length; i++) {
                            if (element._doc.cardList[i].name === req.body.name) {
                                element._doc.cardList.splice(i--, 1);
                            }
                        }
                        element.save(function (err, result) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send(result);
                            }
                        })
                    }

                } else {
                    doc.cardList.push(
                        {
                            "quantity": req.body.quantityCol,
                            "name": req.body.name,
                            "edition": req.body.edition,
                            "avatar": req.body.avatar,
                            "type": req.body.type,
                            "manaCost": req.body.manaCost,
                            "png": req.body.png,
                            "price": req.body.price,
                            "rarity": req.body.rarity,
                            "set_number": req.body.set_number
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

        } // non esiste
        else {
            const cardList = [];
            cardList.push({
                "quantity": req.body.quantityCol,
                "name": req.body.name,
                "edition": req.body.edition,
                "avatar": req.body.avatar,
                "type": req.body.type,
                "manaCost": req.body.manaCost,
                "png": req.body.png,
                "price": req.body.price,
                "rarity": req.body.rarity,
                "set_number": req.body.set_number
            })
            const deck = new collectionSchema({
                name: req.params.wishList == 'false' ? 'My Collection' : 'Wishlist',
                wishList: req.params.wishList == 'false' ? false : true,
                userId: req.params.id,
            });
            deck.save().then((response) => {
                response.cardList.push(
                    {
                        "quantity": req.body.quantityCol,
                        "name": req.body.name,
                        "edition": req.body.edition,
                        "avatar": req.body.avatar,
                        "type": req.body.type,
                        "manaCost": req.body.manaCost,
                        "png": req.body.png,
                        "price": req.body.price,
                        "rarity": req.body.rarity,
                        "set_number": req.body.set_number
                    }
                )
                response.save(function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(true);
                    }
                })
            }).catch(error => {
                res.status(500).json({
                    error: error
                });
            });
        }
    })

})


module.exports = router;
