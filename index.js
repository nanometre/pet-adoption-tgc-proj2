const validate = require('./middleware/validate')
const animalSchema = require('./schema/animal-schema')
const commentSchema = require('./schema/comment-schema')
const MongoUtil = require('./MongoUtil.js');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv');
dotenv.config();

let app = express();
app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGO_URI;
const ANIMALS_COLLECTION_NAME = 'animals';

async function main() {
    await MongoUtil.connect(mongoUri, 'pet_adoption')

    // Default page
    app.get("/", function (req, res) {
        try {
            res.send("Express app is functional")
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })
    // ===========================================================================
    // ====================== Routes for animals collection ======================
    // ===========================================================================
    // POST: Add new animals in the DB (CREATE)
    app.post("/animals", validate.validate(animalSchema.postAnimalSchema), async function (req, res) {
        try {
            let db = MongoUtil.getDB();

            let name = req.body.name;
            let img_url = req.body.img_url;
            let gender = req.body.gender;
            let date_of_birth = new Date(req.body.date_of_birth);
            let species = req.body.species;
            let status_tags = req.body.status_tags;
            let description = req.body.description;
            let adopt_foster = req.body.adopt_foster;
            let _id;
            let caretaker_name = req.body.current_caretaker.caretaker_name;
            let email = req.body.current_caretaker.email;

            let animalRecord = await db.collection(ANIMALS_COLLECTION_NAME)
                .findOne({
                    "current_caretaker.email": {
                        '$regex': email,
                        '$options': 'i'
                    }
                });
            if (!animalRecord) {
                _id = new ObjectId()
            } else {
                _id = ObjectId(animalRecord.current_caretaker._id)
            }

            let current_caretaker = { _id, caretaker_name, email };

            await db.collection(ANIMALS_COLLECTION_NAME).insertOne({
                name, img_url, gender, date_of_birth, species, status_tags,
                description, adopt_foster, current_caretaker
            })
            res.send("New animal added")
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }

    })

    // GET: Return all animals in the DB (READ)
    app.get("/animals", async function (req, res) {
        try {
            let db = MongoUtil.getDB();
            let queryResults = await db.collection(ANIMALS_COLLECTION_NAME)
                .find()
                .toArray()

            res.json(queryResults)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })

    // GET: Using GET request to pass data thru query and get search results
    app.get("/animals/search", async function (req, res) {
        try {
            let criteria = {};
            if (req.query.searchterm) {
                criteria['$or'] = [
                    {
                        'name': {
                            '$regex': `${req.query.searchterm}`,
                            '$options': 'i'
                        }
                    },
                    {
                        'species.breed': {
                            '$regex': `${req.query.searchterm}`,
                            '$options': 'i'
                        }
                    },
                    {
                        'description': {
                            '$regex': `${req.query.searchterm}`,
                            '$options': 'i'
                        }
                    }
                ]
            };
            if (req.query.gender) {
                criteria['gender'] = {
                    '$in': req.query.gender
                }
            };
            if (req.query.gteyear && !req.query.lteyear) {
                criteria['date_of_birth'] = {
                    '$gte': new Date(req.query.gteyear)
                }
            } else if (!req.query.gteyear && req.query.lteyear) {
                criteria['date_of_birth'] = {
                    '$lte': new Date(req.query.lteyear)
                }
            } else if (req.query.gteyear && req.query.lteyear) {
                criteria['date_of_birth'] = {
                    '$gte': new Date(req.query.gteyear),
                    '$lte': new Date(req.query.lteyear)
                }
            };
            if (req.query.species_name) {
                criteria['species.species_name'] = {
                    '$in': req.query.species_name
                }
            };
            if (req.query.status_tags) {
                criteria['status_tags'] = {
                    '$in': req.query.status_tags
                }
            };
            if (req.query.adopt_foster) {
                criteria['adopt_foster'] = {
                    '$in': req.query.adopt_foster
                }
            };

            let db = MongoUtil.getDB();
            let queryResults = await db.collection(ANIMALS_COLLECTION_NAME)
                .find(criteria)
                .toArray()

            res.json(queryResults)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })

    // GET: Using GET request to get all user listings
    app.get("/animals/user_listings", async function (req, res) {
        try {
            let criteria = {};
            criteria['current_caretaker.email'] = {
                '$regex': `^${req.query.email}$`,
                '$options': 'i'
            }
            let db = MongoUtil.getDB();
            let queryResults = await db.collection(ANIMALS_COLLECTION_NAME)
                .find(criteria)
                .toArray()

            res.json(queryResults)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })


    // PATCH: Edit animals in DB by ID (UPDATE)
    app.patch("/animals/:_id", validate.validate(animalSchema.putAnimalSchema), async function (req, res) {
        try {
            let {
                name, img_url, gender, date_of_birth, species, status_tags,
                description, adopt_foster
            } = req.body
            let db = MongoUtil.getDB();
            await db.collection(ANIMALS_COLLECTION_NAME)
                .updateOne({
                    _id: ObjectId(req.params._id)
                }, {
                    $set: {
                        name: name,
                        img_url: img_url,
                        gender: gender,
                        date_of_birth: new Date(date_of_birth),
                        species: species,
                        status_tags: status_tags,
                        description: description,
                        adopt_foster: adopt_foster
                    }
                })
            res.send(`Animal record (ID: ${req.params._id}) updated`)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })

    // DELETE: Delete animals in DB by ID (DELETE)
    app.delete("/animals/:_id", validate.validate(animalSchema.animalIdSchema), async function (req, res) {
        try {
            let db = MongoUtil.getDB()
            await db.collection(ANIMALS_COLLECTION_NAME).deleteOne({
                _id: ObjectId(req.params._id)
            });
            res.send(`Animal record (ID: ${req.params._id}) deleted`)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })

    // ===========================================================================
    // =========================== Routes for comments ===========================
    // ===========================================================================
    // POST: Add new comment for an animal in DB
    app.post("/comments/:animal_id", validate.validate(commentSchema.postCommentSchema), async function (req, res) {
        try {
            let db = MongoUtil.getDB();

            let _id = new ObjectId();
            let commenter_name = req.body.commenter_name;
            let content = req.body.content;
            let rating = req.body.rating;
            let date_of_comment = new Date().toISOString();

            await db.collection(ANIMALS_COLLECTION_NAME).updateOne({
                _id: ObjectId(req.params.animal_id)
            }, {
                $push: {
                    comments: {_id, commenter_name, content, rating, date_of_comment}
                }
            })
            res.send("New comment added")
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact adminstrator.")
        }
    })

    // GET: Return all the comments from all animals in the DB (READ)
    app.get("/comments", async function (req, res) {
        try {
            let db = MongoUtil.getDB();
            let queryResults = await db.collection(ANIMALS_COLLECTION_NAME)
                .find({
                    comments: {$exists: true}
                }, {
                    projection: {comments: 1}
                })
                .toArray()

            res.json(queryResults)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact adminstrator.")
        }
    })

    // Deployment port: process.env.PORT
    // Testing port: 8888
    app.listen(process.env.PORT, () => {
        console.log('Server has started')
    })
}

main();