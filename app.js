//jshint esversion:6
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')
 
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//hay que usar este plugin antes de crear el modelo mongoose
//para crear el modelo con el schema ya encriptado
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);


app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if(!err){
            res.render('secrets')
        } else {
            console.log(err);
        }
    });
})

app.get('/', function(req, res){
    res.render('home')
})

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});


app.post('/login', function(req, res){
    User.findOne({email: req.body.username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.render('secrets');
                } else {
                    console.log('password does not match user:' + req.body.username);
                }
            }
        }
    });
});


app.listen(3000, function(){
    console.log('Server running on port 3000')
});