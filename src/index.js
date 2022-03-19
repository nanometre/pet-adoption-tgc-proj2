const express = require('express')
const { append, render } = require('express/lib/response')

let app = express()

app.get("/", function(req, res){
    res.send("Hello World")
})

app.listen(3000, () =>{
    console.log('Server has started')
})