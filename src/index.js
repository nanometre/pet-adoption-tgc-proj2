const validate = require('../middleware/validate')
const schema = require('../schema/animal-schema')

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

async function main() { 
    await MongoUtil.connect(mongoUri, 'pet_adoption')

    // test page for default link
    app.get("/", function (req, res) {
        res.send("Express app is functional")
    })

    // GET: Return all animals in the DB (READ)
    app.get("/animals", async function (req, res){
        let db = MongoUtil.getDB();
        let animalRecords = await db.collection(COLLECTION_NAME)
                                    .find()
                                    .toArray();
        res.json(animalRecords)
    })

    // GET: Return one animal in the DB by ID (READ)
    // Might not be require, better to find by search terms
    app.get("/animals/:_id", async function (req, res){
        let db = MongoUtil.getDB();
        let animalRecord = await db.collection(COLLECTION_NAME)
                                   .findOne({
                                       _id: new ObjectId(req.params._id)
                                   });
        res.json(animalRecord)
    })

    // POST: Add new animals in the DB (CREATE)
    app.post("/animals", validate.validate(schema.animalSchema), async function (req, res) {
        let {
            name,
            img_url,
            gender,
            date_of_birth,
            species,
            status_tags,
            description,
            adopt_foster,
            current_caretaker
        } = req.body

        let db = MongoUtil.getDB();
        await db.collection(COLLECTION_NAME).insertOne({
            name,
            img_url,
            gender,
            date_of_birth,
            species,
            status_tags,
            description,
            adopt_foster,
            current_caretaker
        })
        res.send("New animal added")
    })

    // PATCH/PUT: Edit animals in DB by ID (UPDATE)
    // 

    // DELETE: Delete animals in DB by ID (DELETE)
    app.delete("/animals/:_id", async function(req, res){
        let db = MongoUtil.getDB()
        await db.collection(COLLECTION_NAME).deleteOne({
            _id: ObjectId(req.params._id)
        });
        // res.status(200)
        res.send(`Animal record (ID: ${req.params._id}) deleted`)
    })

    app.listen(8888, () => {
        console.log('Server has started')
    })
}

main();