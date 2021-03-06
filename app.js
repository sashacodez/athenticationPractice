//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
 
//definimos el número de rondas que se realizará el salting + hashing(bcrypt)
const saltRounds = 10;
 
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


const User = new mongoose.model('User', userSchema);


app.post('/register', function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(!err){
                res.render('secrets')
            } else {
                console.log(err);
            }
        });
    });

});

app.get('/', function(req, res){
    res.render('home')
})

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});


app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, foundUser) {
        if(err) {
            console.log(err);
            console.log('This email had not been registered yet');
        } else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true) {
                        res.render('secrets');
                    } else {
                        console.log('Password does not match');
                    }
                });
            }
        }
    });
});


app.listen(3000, function(){
    console.log('Server running on port 3000')
});