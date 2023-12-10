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

  const LocationSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    locationID: {type: Number, required: true},
    location: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    eventCount: {type: Number, required: true},
  });
  
  const Location = mongoose.model("Location", LocationSchema);

  const EventSchema = mongoose.Schema({
    eventID: {type: Number, required: true},
    title: {type: String, required: true},
    venueID: {type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true},
    date: {type: String, required: true},
    description: {type: String, required: false},
    presenter: {type: String, required: true},
    priceInStr: {type: String, required: false},
    priceInNum: [{type: Number, required: false}], // An array of different prices available
  })
  
  const Event = mongoose.model("Event", EventSchema)
  
  const CommentSchema = mongoose.Schema({
    //commentID: {type: Number, required: true, unique: true},
    comment: {type: String, required: true},
    user: {type: String, required: true}, //type: Schema.Types.ObjectId , ref:'Login'{"$oid": "Login _id"}
    locID: {type: Number, required: true}, //type: Schema.Types.ObjectId , ref:'locations'?
    date: {type: String, requred: true}//need ?
  })

  
  const Comment = mongoose.model('Comment', CommentSchema)
  
  /*
  location.find({})
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("failed to read");
  }); 
  */

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  // for the map
  app.post('/map', (req, res) => {
    Location.find({})
    .then((data) => {
      response = data;
        res.send(response);
    })
    .catch((err) => {
      console.log("failed to read");
    }); 
  })

  // for the locations list
  app.get('/locations', (req, res) => {
    Location.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    })
  })

  // for the separate view for one location
  app.post('/particularLocation', (req, res) => {
    Location.find({locationID: req.body.locationID})
    .then((data) => {
      response = data[0];
      res.send(response);
    })
    .catch((error) => {
      console.log("failed to read");
    }); 
  })

  app.post('/eventForLocation', (req,res) => {
    Event.find({venueID: req.body.venueID})
    .then((data) => {
      response = data[0];
      res.send(response);
    })
    .catch((error) => {
      res.status(404)
      console.log("failed to read");
    }); 
  })

  // for the search of location feature of the search bar
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
      Location.find({location: {$regex: searchKeywords}})
      .then((data) => {
        response = data;
        console.log(data)
        res.send(response); 
      }); 
    });

// add comment to server
app.post('/comment', (req, res) => {
  const comment = req.body.comment;
  const username = req.body.username;
  const locID = req.body.locID;
  const date = req.body.date;
  const newComment = new Comment({
      comment: comment,
      user: username,
      locID: locID,
      date: date
  })
  
  console.log(newComment)
  newComment.save()
  .then(() => {
      res.status(201);
  })
});

// show comment in each app
app.get('/listcomment/:locID',(req,res)=>{
  const resultset = []
  Comment.find({locID: {$eq: req.params.locID}})
  .then((data)=>{
    for(let i = 0; i<data.length;i++){
      const comment = data[i].comment;
      const user = data[i].user;
      const date = data[i].date;
      const commentgp = {
        comment: comment,
        user: user,
        date: date
      }
      resultset.push(commentgp)
    }
    console.log(resultset);
    res.setHeader("Content-Type", "text/plain");
    res.send(resultset);
  })
  .catch(error => {
    res.status(500).json({ error: "Failed to read events" });
  });
})


// mongodb CRUD above this
});

const server = app.listen(5000, () => {
  console.log("server running") 
});
