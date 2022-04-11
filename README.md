# Paw Pals' RESTful API 

>Note: This is a bootcamp project where an interactive web application was created using React, Express.js and MongoDB

## RESTful API using MongoDB and Express.js

This is a simple RESTful API project built using MongoDB and Express.js for a pet adoption website, Paw Pals, as part of Trent Global College's Diploma in Web Application Development Project 2. The frontend interface was created with React and the repository can be found [here](https://github.com/nanometre/pet-adoption-tgc-proj2-react).

## Index

1. [Context](#1-context)
2. [Document Design](#2-document-design)
3. [Endpoints](#3-endpoints)
4. [Technologies Used](#4-technologies-used)
5. [Acknowledgements](#5-acknowledgements)

## 1. Context

This is a custom RESTful API built for the [Paw Pals](https://paw-pals.netlify.app/) project. The API has CRUD functions which is used to manage a collection of animals. The application is built with [MongoDB](https://www.mongodb.com/) and [Express.js](https://expressjs.com/). The API is hosted on Heroku and can be accessed [here](https://pet-adoption-tgc-proj2-express.herokuapp.com/).

## 2. Document Design

The database has one collection that is being used by the API. The collection hold a list of animal records and the API fully supports CRUD operations on the collection.

Each animal record has the following structure:
```
{
    "_id": <id of the animal record>,
    "name": <name of the animal>,
    "img_url": <image url of the animal>,
    "gender": <gender of the animal>,
    "date_of_birth": <date of birth of the animal>,
    "species": {
        "species_name": <species of the animal. can be "Dog", "Cat", "Hamster", or "Others>,
        "breed": <breed of the animal>,
    "status_tags": <array of status tags tagged to the animal. can be "Microchipped", "HDB Approved", "Vaccinated", or/and "Sterilised">,
    "description": <description of the animal>,
    "adopt_foster": <array of values. can be "Adopt", or/and "Foster",
    "current_caretaker": {
        "_id": <id of the caretaker>,
        "caretaker_name": <name of the caretaker>,
        "email": <email of the caretaker>},
    "comments":
        [
            {"_id": <id of individual comment for the specific animal record>,
            "commenter_name": <name of commenter>,
            "content": <content of comment>,
            "rating": <rating of comment. can be 1, 2, 3, 4, or 5>,
            "date_of_comment": <date of comment posted>}
        ]
}
```

## 3. Endpoints

### 3.1 Get the list of animal records
#### Request
```
GET /animals/
```
#### Response
Returns an array of all the animal records in the database so far.

Sample output:
```
[   
    {...},
    {
	    "_id": "623bd2b766f3c35a312c2fee",
	    "name": "Snowy",
	    "img_url": "https://images.pexels.com/photos/5894897/pexels-photo-5894897.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
	    "gender": "Female",
	    "date_of_birth": "2022-03-22T00:00:00.000Z",
	    "species": {
		    "species_name": "Cat",
		    "breed": "Persian"
	    },
	    "status_tags": [
		    "Microchipped",
		    "HDB Approved",
		    "Vaccinated",
		    "Sterilised"
	    ],
	    "description": "Snowy is a Persian with white fluffy fur. She is shy but is playful when she opens up",
	    "adopt_foster": [
		    "Adopt",
		    "Foster"
	    ],
	    "current_caretaker": {
		    "_id": "623bd2b766f3c35a312c2fed",
		    "caretaker_name": "Kevin Goh",
		    "email": "keving@gmail.com"
	    },
	    "comments": [
            {...},
		    {
			    "_id": "624a9f6d2232e82e87f9b84f",
			    "commenter_name": "John Doe",
			    "content": "On our visit to the shelter, Snowy only took 15 mins to warm up to us and was really playful throughout the rest of our visit.",
			    "rating": 5,
			    "date_of_comment": "2022-04-04T07:34:05.515Z"
		    },
            {...}
	    ]
    },
    {...}
]
```

### 3.2 Get the list of animal records based on search queries
#### Request
```
GET /animals/search
```
#### Response
Returns an array of all the animal records which matches the search queries.

### 3.3 Get the list of animal records based on a specific current caretaker email address
#### Request
```
GET /animals/user_listings
```
#### Response
Returns an array of all the animal records which matches the specified current caretaker email address.

### 3.4 Create a new animal record
#### Request
```
POST /animals/
```
Sample body:
```
{
    "name": "The one and only",
    "img_url": "https://images.pexels.com/photos/9013077/pexels-photo-9013077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "gender": "Male",
    "date_of_birth": "2022-03-25",
    "species": {
        "species_name": "Cat",
        "breed": "Egyptian"
    },
    "status_tags": [
        "Vaccinated",
        "HDB Approved",
        "Microchipped",
        "Sterilised"
    ],
    "description": "The one and only cat you ever need in your life",
    "adopt_foster": [
        "Adopt"
    ],
    "current_caretaker": {
        "caretaker_name": "Pet Sanctuary",
        "email": "PET_SANCTUARY@gmail.com"
    }
}
```
#### Response
```
New animal added
```

### 3.5 Edit animal records based on ID of animal record
#### Request
```
PATCH /animals/:_id
```
Sample body:
```
{
    "name": "The one and only DOG",
    "img_url": "https://images.pexels.com/photos/9013077/pexels-photo-9013077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "gender": "Female",
    "date_of_birth": "2022-03-26",
    "species": {
        "species_name": "Dog",
        "breed": "Egyptian DOG"
    },
    "status_tags": [],
    "description": "The one and only DOG you ever need in your life ",
    "adopt_foster": ["Adopt", "Foster"]
}
```
#### Response
```
Animal record (ID: _id) updated
```

### 3.6 Delete animal records based on ID of animal record
#### Request
```
DELETE /animals/:_id
```
#### Response
```
Animal record (ID: _id) deleted
```

### 3.7 Create comment of an animal record based on ID of animal record
#### Request
```
POST /comments/:animal_id
```
Sample body:
```
{
    "commenter_name": "John Doe",
    "content": "My daughter loves Goldie so much that she wants to adopt her right away",
    "rating": 5
}
```
#### Response
```
New comment added
```

### 3.8 Get list of all comments for all animals
#### Request
```
GET /comments/
```
#### Response
```
[
    {...},
	{
		"_id": "623bd2b766f3c35a312c2fee",
		"comments": [
            {...},
			{
				"_id": "624a9f6d2232e82e87f9b84f",
				"commenter_name": "John Doe",
				"content": "On our visit to the shelter, Snowy only took 15 mins to warm up to us and was really playful throughout the rest of our visit.",
				"rating": 5,
				"date_of_comment": "2022-04-04T07:34:05.515Z"
			},
            {...}
		]
	},
    {...}
]
```

### 3.9 Delete animal comment based on ID of comment
#### Request
```
DELETE /comments/:_id
```
#### Response
```
Comment (ID: _id) deleted
```

## 4. Technologies Used

- [Express.js](https://expressjs.com/)

  This API uses Express.js, a fast, unopinionated, minimalist web framework for Node.js. CRUD routes for the animals collection was created using the framework.

- [MongoDB](https://www.mongodb.com/)

  This API uses MongoDB, a document-oriented database, where the animals collection is stored.

- [yup](https://github.com/jquense/yup)

  This API uses yup, a schema validation library for Node.js, which is used as a middleware for validating HTTP requests' body, query, and parameter headers.

## 5. Acknowledgements

- Backend schema validation with yup and Express.js guide from [Francisco Mendes](https://dev.to/franciscomendes10866/schema-validation-with-yup-and-express-js-3l19).

- YouTube and Stack Overflow community for guidance on various issues faced.