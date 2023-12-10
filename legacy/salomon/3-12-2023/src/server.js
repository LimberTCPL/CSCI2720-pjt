const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ type: ["application/json", "application/csp-report"] }));
app.use(bodyParser.urlencoded({extended: false}));



const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/project');

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
  console.log("Connection is open...");

  const locationSchema = mongoose.Schema({
    locationID: {type: Number, unique: true, required: true},
    location: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
  });
  
  const location = mongoose.model('locations', locationSchema)

  location.find({})
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("failed to read");
  }); 


  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  //for map
  app.post('/map', (req, res) => {
    location.find({})
    .then((data) => {
      response = data;
        res.send(response);
    })
    .catch((err) => {
      console.log("failed to read");
    }); 
  })


  //for the separate view for one location
  app.post('/particularLocation', (req, res) => {
    location.find({locationID: req.body.locationID})
    .then((data) => {
      response = data[0];
        res.send(response);
    })
    .catch((err) => {
      console.log("failed to read");
    }); 
  })

  //for the search of location feature of the search bar
  app.post('/search', (req, res) => {
    function setUpSearch (keywords){//setting up the RegExp for finding the results
      let tempStr = "" 
      keywords.forEach(keyword => {tempStr += "(?=.*" + keyword + ")"});
      let searchRegex =  tempStr 
      console.log(searchRegex)
      return searchRegex;
    } 

      const target = req.body.name //this retrieves the contents in the search bar
      console.log(target)
      let searchKeywords = ''
      if (target){ //handles the case where the search box is non-empty => modify searchKeywords. Hence if the search box is empty searchKeywords = ''
          let keywords = target.trim().split(/[\s_()]+/)
          searchKeywords = RegExp(setUpSearch(keywords),'i');
          console.log(searchKeywords)
      }

      let response = [];
      location.find({location: {$regex: searchKeywords}})
      .then((data) => {
        response = data;
        console.log(data)
        res.send(response); 
      }); 
    });
  });

const server = app.listen(5000);
