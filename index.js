var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var download = require('./routes/download');
var upload = require('./routes/upload');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',(req, res)=>{
    res.send('<p>You are on the homepage, please use postman to send requests</p>');
})

app.use('/', upload);
app.use('/', download);
app.listen(process.env.PORT || 4000, () => {
    console.log("Server has Started on https://localhost:4000/");
});