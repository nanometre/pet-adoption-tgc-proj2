const validate = require('./middleware/validate')
const schema = require('./schema/animal-schema')
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
const COLLECTION_NAME = 'animals';

// res.json is only needed for POST and PUT requests
// res.json is not needed for GET and DELETE requests
async function main() {
    await MongoUtil.connect(mongoUri, 'pet_adoption')

    // Default page
    app.get("/", function (req, res) {
        res.send("Express app is functional")
    })

    // POST: Add new animals in the DB (CREATE)
    app.post("/animals/add", validate.validate(schema.postAnimalSchema), async function (req, res) {
        let {
            name, img_url, gender, date_of_birth, species, status_tags,
            description, adopt_foster, current_caretaker
        } = req.body

        let db = MongoUtil.getDB();
        await db.collection(COLLECTION_NAME).insertOne({
            name, img_url, gender, date_of_birth, species, status_tags,
            description, adopt_foster, current_caretaker
        })
        res.send("New animal added")
    })

    // GET: Return all animals in the DB (READ)
    // To edit. Look at tgc16-mongo 07-api, GET request is combined with search??
    app.get("/animals/show", async function (req, res) {
        let db = MongoUtil.getDB();
        let animalRecords = await db.collection(COLLECTION_NAME)
            .find()
            .toArray();
        res.json(animalRecords)
    })

    // GET: Return one animal in the DB by ID (READ)
    // Might not be require, better to find by search terms
    app.get("/animals/show/:_id", validate.validate(schema.animalIdSchema), async function (req, res) {
        try {
            let db = MongoUtil.getDB();
            let animalRecord = await db.collection(COLLECTION_NAME)
                .findOne({
                    _id: new ObjectId(req.params._id)
                });
            res.json(animalRecord)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })

    // PUT: Edit animals in DB by ID (UPDATE)
    app.put("/animals/edit/:_id", validate.validate(schema.putAnimalSchema), async function (req, res) {
        try {
            let {
                name, img_url, gender, date_of_birth, species, status_tags,
                description, adopt_foster, current_caretaker
            } = req.body
            let db = MongoUtil.getDB();
            let updateAnimalRecord = await db.collection(COLLECTION_NAME)
                .updateOne({
                    _id: ObjectId(req.params._id)
                }, {
                    $set: {
                        name, img_url, gender, date_of_birth, species,
                        status_tags, description, adopt_foster, current_caretaker
                    }
                })
            res.send(`Animal record (ID: ${req.params._id}) updated`)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })

    // DELETE: Delete animals in DB by ID (DELETE)
    app.delete("/animals/delete/:_id", validate.validate(schema.animalIdSchema), async function (req, res) {
        try {
            let db = MongoUtil.getDB()
            await db.collection(COLLECTION_NAME).deleteOne({
                _id: ObjectId(req.params._id)
            });
            res.send(`Animal record (ID: ${req.params._id}) deleted`)
        } catch (err) {
            res.status(500)
            res.send("Internal server error. Please contact administrator.")
        }
    })

    // test for query
    app.get("/querytest", async function (req, res) {
        let criteria = {}
        let gender
        // console.log(req.query.gender)
        if (!req.query.gender){
            gender = ""
        }else{
            gender = req.query.gender
        }
        if (req.query.search) {
            criteria['description'] = {
                $regex: req.query.search,
                $options: 'i'
            }
            criteria['gender'] = {
                $regex: gender,
                $options: 'i'
            }
        };

        let db = MongoUtil.getDB();
        let queryResults = await db.collection(COLLECTION_NAME)
            .find(criteria)
            .toArray()

        res.send(queryResults) // returns {"description":"dog","name":"bob"}
    })

    app.listen(process.env.PORT, () => {
        console.log('Server has started')
    })
}

main();