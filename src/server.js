const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(bodyParser.json({ type: ["application/json", "application/csp-report"] }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

var refreshTokenList = [];
let user

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
  
  const Event = mongoose.model("Event", EventSchema);
  
  const CommentSchema = mongoose.Schema({
    //commentID: {type: Number, required: true, unique: true},
    comment: {type: String, required: true},
    user: {type: String, required: true}, //type: Schema.Types.ObjectId , ref:'Login'{"$oid": "Login _id"}
    locID: {type: Number, required: true}, //type: Schema.Types.ObjectId , ref:'locations'?
    date: {type: String, requred: true}//need ?
  })
  
  const Comment = mongoose.model('Comment', CommentSchema);
  
  const AdminEventSchema = mongoose.Schema({
    eventID: {
      type: Number,
      required: [true, "Event ID is required"],
    },
    location: {
      type: String,
      required: true,
    },
    quota: {
      type: Number,
      required: true,
    },
  });

  const AdminEvent = mongoose.model("AdminEvent", AdminEventSchema);

  const AdminUserSchema = mongoose.Schema({
    username: {
      type: String,
      required: [true,"User Name is required"],
    },
    password: {
      type: String,
      required: true,
    },
  });

  const AdminUser = mongoose.model("AdminUser",AdminUserSchema);

  const FavoriteLocationSchema = mongoose.Schema({
    user: {type: String, required: true, unique: true},
    locations: {
      location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true}
    }
  })

  const FavoriteLocation = mongoose.model("FavoriteLocation",FavoriteLocationSchema);

    const UserSchema = mongoose.Schema(
    {
       username: {
          type: String,
          required: [true, "Name is required"],
          unique: true,
       },
       password: {
          type: String,
          required: [true, "Password is required"],
       },
       role: {
          type: String,
          default: 'user',
       },
       priKey: {
          type: String,
          default: "1357924680",
       },
    },
    { collection: 'userdata' },
 )

 const User = mongoose.model("userSchema", UserSchema);


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
    let response;
    Location.find({})
    .then((data) => {
        response = data;
        res.send(response);
    })
    .catch((err) => {
      console.log("failed to read");
    }); 
  })

  // for the location list
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
    let response;
    Location.find({locationID: req.body.locationID})
    .then((data) => {
      response = data[0];
      res.send(response);
    })
    .catch((error) => {
      console.log("failed to read");
    }); 
  })

  app.post('/addToFavorite', (req, res) => {
    Location.find({locationID: req.body.locationID})
    .then((data) => {
      
    })
    .catch((error) => {
      console.log("failed to read");
    }); 
  })


  // for the filtered event list
  app.post('/events', (req, res) => {
    const price = req.body.price; // this retrieves the price in the event filter bar

    if (price == "") { // Respond with the whole event list
      Event.find({})
      .populate({
        path: "venueID",
        select: "locationID location"
      })
      .exec()
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      })
    } else { // Find the event with specified price
      Event.find({ priceInNum: { $lte: price } })
      .populate({
        path: "venueID",
        select: "locationID location"
      })
      .exec()
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      })
    }
  })

  /*
  // for the events for a specific location
  app.post('/eventForLocation', (req, res) => {
    Event.find({venueID: req.body.venueID})
    .then((data) => {
      response = data;
      res.send(response);
    })
    .catch((error) => {
      res.status(404)
      console.log("failed to read");
    }); 
  })
  */
  
  // for the search of location feature of the search bar
  app.post('/search', (req, res) => {
    function setUpSearch (keywords) { // setting up the RegExp for finding the results
      let tempStr = "" 
      keywords.forEach(keyword => {tempStr += "(?=.*" + keyword + ")"});
      let searchRegex =  tempStr;
      console.log(searchRegex);
      return searchRegex;
    } 

    const target = req.body.name // this retrieves the contents in the search bar
    console.log(target);
    let searchKeywords = ''
    if (target) { // handles the case where the search box is non-empty => modify searchKeywords. Hence if the search box is empty searchKeywords = ''
      let keywords = target.trim().split(/[\s_()]+/)
      searchKeywords = RegExp(setUpSearch(keywords),'i');
      console.log(searchKeywords);
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
      res.json({ message: 'comment saved!' });
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

//login system
app.post('/login', (req, res) => {
  try{
     User.findOne({ username: req.body.username, password: req.body.password }).then((data) => {
        if (data) {
           // generate an accessToken
           const accessToken = jwt.sign({ userId:data._id, username: data.username, role: data.role }, data.priKey, { expiresIn: '5m' });
           const refreshToken = jwt.sign({ userId:data._id, username: data.username, role: data.role }, data.priKey);
           refreshTokenList.push(refreshToken);
           res.json({
              accessToken,
              refreshToken,
           });
        }  
        else {
           res.status(401).json({ message: 'Username or password incorrect' });
        }
     })
  } catch (err) {
     console.log(err);
  }
});

app.post('/refresh', (req, res) => {
const refreshToken = req.body.refreshToken;

//get username from refreshToken
const payload = jwt.decode(refreshToken);


if (!refreshToken) {
  // if there is no refreshToken, raise unautorized status
  return res.status(401).json({ message: 'You are not unautorized yet!' });
}

if (!refreshTokenList.includes(refreshToken)) {
  // if the refreshToken is not included in the array, raise forbidden status
  return res.status(403).json({ message: 'You are not allowed to access this page!' });;
}
// get prikey from database
User.findOne({ username: payload.username }).then((data) => {
  // verify the refreshToken
  jwt.verify(refreshToken, data.priKey, (err, user) => {
     if (err) {
        // if the refreshToken is not valid, raise forbidden status
        return res.status(403).json({ message: 'You are not allowed to access this page!' });
     }
  })
  // generate a new accessToken if no error occurs
  // send the new accessToken back
  res.json({accessToken: jwt.sign({ userId:data._id, username: data.username, role: data.role }, data.priKey, { expiresIn: '5m' })});
})
});

app.post('/logout', (req, res) => {
// remove the refeshToken from array to proceed the logout command
refreshTokenList = refreshTokenList.filter((token) => token !== req.body.refreshToken);
// send back a successful process
res.json({ message: 'You have logged out successfully' });
});  

//mongodb CRUD


app.post('/Adminevents', (req, res) => {
  const { eventID, location, quota } = req.body;
  const newEvent = new AdminEvent({ eventID, location, quota });

  newEvent.save()
    .then(() => {
      console.log("A new event created successfully");
      res.json({ message: 'Event created successfully' });
    })
    .catch((error) => {
      console.log("Failed to save new event");
      res.status(500).json({ error: 'Failed to create event' });
    });
});

app.post('/Adminuserevents', (req, res) => {
    const { username,password} = req.body;
    const newUser = new AdminUser({ username,password });
  
    newUser.save()
      .then(() => {
        console.log("A new user created successfully");
        res.json({ message: 'User created successfully' });
      })
      .catch((error) => {
        console.log("Failed to save new user");
        res.status(500).json({ error: 'Failed to create user' });
      });
  });

app.get('/Adminevents', (req, res) => {
  AdminEvent.find({})
    .then(events => {
      res.json(events);
    })
    .catch(error => {
      res.status(500).json({ error: "Failed to read events" });
    });
});

app.get('/Adminuserevents', (req, res) => {
  AdminUser.find({})
      .then(user => {
        res.json(user);
      })
      .catch(error => {
        res.status(500).json({ error: "Failed to read user" });
      });
  });
  
  app.delete('/Adminevents/:eventId', (req, res) => {
    const eventId = req.params.eventId;
  
    AdminEvent.findByIdAndDelete(eventId)
      .then(() => {
        console.log('Event deleted successfully');
        res.json({ message: 'Event deleted successfully' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete event' });
      });
  });

  app.delete('/Adminuserevents/:username', (req, res) => {
    const username = req.params.username;
  
    AdminUser.findOneAndDelete({ username: username })
      .then(() => {
        console.log('User deleted successfully');
        res.json({ message: 'User deleted successfully' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
      });
  });

app.put('/Adminevents/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const { location, quota } = req.body;
  
    AdminEvent.findByIdAndUpdate(
      { _id: eventId },
      { location, quota },
      { new: true }
    )
      .then((updatedEvent) => {
        if (updatedEvent) {
          console.log('Event updated successfully:', updatedEvent);
          res.json({ message: 'Event updated successfully' });
        } else {
          res.status(404).json({ error: 'Event not found' });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to update event' });
      });
  });

  app.put('/Adminuserevents/:username', (req, res) => {
    const username = req.params.username;
    const { password } = req.body;
  
    AdminUser.findOneAndUpdate(
      { username: username },
      { password: password },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          console.log('User updated successfully:', updatedUser);
          res.json({ message: 'User updated successfully' });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
      });
  });

});

const server = app.listen(5001, () => {
  console.log("server running") 
});
