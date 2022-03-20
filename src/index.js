
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

    // GET: Return all animals in the DB
    app.get("/animals", async function (req, res){
        let db = MongoUtil.getDB();
        let animalRecords = await db.collection(COLLECTION_NAME)
                                    .find()
                                    .toArray();
        res.json(animalRecords)
    })

    // POST: Add new animals in the DB
    app.post("/animals", async function (req, res) {
        let {name, gender} = req.body

        let db = MongoUtil.getDB();
        await db.collection(COLLECTION_NAME).insertOne({
            name,
            gender
        })
        res.send("Response received")
    })

    app.listen(8888, () => {
        console.log('Server has started')
    })
}

main();