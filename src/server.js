const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(bodyParser.json({ type: ["application/json", "application/csp-report"] }));
app.use(bodyParser.urlencoded({ extended: false }));
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
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    locationID: { type: Number, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    eventCount: { type: Number, required: true },
  });

  const Location = mongoose.model("Location", LocationSchema);

  const EventSchema = mongoose.Schema({
    eventID: { type: Number, required: true },
    title: { type: String, required: true },
    venueID: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    date: { type: String, required: true },
    description: { type: String, required: false },
    presenter: { type: String, required: true },
    priceInStr: { type: String, required: false },
    priceInNum: [{ type: Number, required: false }], // An array of different prices available
  })

  const Event = mongoose.model("Event", EventSchema);

  const CommentSchema = mongoose.Schema({
    //commentID: {type: Number, required: true, unique: true},
    comment: { type: String, required: true },
    user: { type: String, required: true }, //type: Schema.Types.ObjectId , ref:'Login'{"$oid": "Login _id"}
    locID: { type: Number, required: true }, //type: Schema.Types.ObjectId , ref:'locations'?
    date: { type: String, requred: true }//need ?
  })

  const Comment = mongoose.model('Comment', CommentSchema);

  const FavoriteLocationSchema = mongoose.Schema({
    user: { type: String, required: true, unique: true },
    locations: { type: Array, required: true }

  })

  const FavoriteLocation = mongoose.model("FavoriteLocation", FavoriteLocationSchema);

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
    Location.find({ locationID: req.body.locationID })
      .then((data) => {
        response = data[0];
        res.send(response);
      })
      .catch((error) => {
        console.log("failed to read");
      });
  })

  //for favourite locations
  app.post('/addToFavorite', (req, res) => {
    FavoriteLocation.updateOne(
      { user: req.body.username },
      { $addToSet: { locations: req.body.locationID } },
      { upsert: true })
      .then((data) => {
        console.log('added')
      })
      .catch((error) => {
      });
  })

  app.post('/removeFromFavorite', (req, res) => {
    FavoriteLocation.updateOne(
      { user: req.body.username },
      { $pull: { locations: { $eq: req.body.locationID } } }
    )
      .then((data) => {
        console.log('removed')
      })
      .catch((error) => {
      });
  })

  app.post('/favoriteList', (req, res) => {
    const username = req.body.username
    FavoriteLocation.find({ user: { $eq: username } })
      .then((data) => {
        let response = data[0];
        if (!response) { response = JSON.parse({ locations: [] }) }
        res.send(response);
      })
      .catch((error) => {
        const response = JSON.stringify({ locations: [] })
        res.send(response)
      });
  })

  app.post('/favoriteLocations', (req, res) => {
    const username = req.body.username
    console.log(username)
    let locationList = []
    FavoriteLocation.findOne({ user: { $eq: username } })
      .then((data) => {
        locationList = data.locations;
        if (!locationList) { locationList = [] }
        Location.find({ locationID: { $in: locationList } })
          .then((data) => {
            console.log(data)
            res.send(data);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
          })
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      });
    console.log(locationList)

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
    function setUpSearch(keywords) { // setting up the RegExp for finding the results
      let tempStr = ""
      keywords.forEach(keyword => { tempStr += "(?=.*" + keyword + ")" });
      let searchRegex = tempStr;
      console.log(searchRegex);
      return searchRegex;
    }

    const target = req.body.name // this retrieves the contents in the search bar
    console.log(target);
    let searchKeywords = ''
    if (target) { // handles the case where the search box is non-empty => modify searchKeywords. Hence if the search box is empty searchKeywords = ''
      let keywords = target.trim().split(/[\s_()]+/)
      searchKeywords = RegExp(setUpSearch(keywords), 'i');
      console.log(searchKeywords);
    }

    let response = [];
    Location.find({ location: { $regex: searchKeywords } })
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
  app.get('/listcomment/:locID', (req, res) => {
    const resultset = []
    Comment.find({ locID: { $eq: req.params.locID } })
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
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
    try {
      User.findOne({ username: req.body.username, password: req.body.password }).then((data) => {
        if (data) {
          // generate an accessToken
          const accessToken = jwt.sign({ userId: data._id, username: data.username, role: data.role }, data.priKey, { expiresIn: '5m' });
          const refreshToken = jwt.sign({ userId: data._id, username: data.username, role: data.role }, data.priKey);
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
      res.json({ accessToken: jwt.sign({ userId: data._id, username: data.username, role: data.role }, data.priKey, { expiresIn: '5m' }) });
    })
  });

  app.post('/logout', (req, res) => {
    // remove the refeshToken from array to proceed the logout command
    refreshTokenList = refreshTokenList.filter((token) => token !== req.body.refreshToken);
    // send back a successful process
    res.json({ message: 'You have logged out successfully' });
  });

  //mongodb CRUD



  app.post('/adminevents', async (req, res) => {
    const { title, date, venueID, description, presenter, priceInStr } = req.body;

    let eventID;
    Event.find({})
    .sort({ eventID: -1 })
    .limit(1)
    .exec()
    .then((latestEvent) => {
      eventID = parseInt(latestEvent[0].eventID) + 1;
    })

    //const eventID = 1;
    //const priceInNum = parseInt(priceInStr);
    const priceInNum = [];
    
    // Find out the price (in an array of numbers) according to the price (in string) given
    if (priceInStr) { // The price of the event is given
      if (priceInStr.includes("Free") || priceInStr.includes("free")) { // The price is said to be free
        priceInNum.push(0);
      }

      const regEx1 = /\$\d+/g; // With dollar signs $, and without thousands separators ,
      const regEx2 = /\$\d{1,3}(?:,\d{3})*/g; // With dollar signs $, and with thousands separators ,
      const regEx3 = /[,;]\s\d+/g; // Without dollar signs $ for the middle parts, and without thousands separators ,

      if (/.*\$\d+(?:[,;]\s\d+)+/.test(priceInStr)) { // Test: True when there is only one $ at the beginning, while , or ; separates the prices
        priceInNum.push(...priceInStr.match(regEx1).concat(priceInStr.match(regEx3)).map(prices => prices.replace(/[\s$,;]/g, '')));
      } else if (/.*\$\d{1,3}(?:,\d{3})+/.test(priceInStr)) { // Test: True when there are thousands separators in the price
        priceInNum.push(...priceInStr.match(regEx2).map(prices => prices.replace(/[\s$,;]/g, '')));
      } else if (/.*\$\d+/.test(priceInStr)) { // Test: True when there is dollar sign
        priceInNum.push(...priceInStr.match(regEx1).map(prices => prices.replace(/[\s$,;]/g, '')));
      };
    };

    // Update eventCount of the specified location
    try {
      const updatedLocation = await Location.findOneAndUpdate(
        { locationID: venueID },
        { $inc: { eventCount: 1 } }
      );
    } catch (error) {
      console.log(error);
    }

    try {
      const location = await Location.findOne({ locationID: venueID });

      if (!location) {
        console.log('Location not found.');
        res.status(404).json({ error: 'Location not found.' });
        return;
      }

      const event = new Event({
        eventID,
        title,
        venueID: location._id,
        date,
        description,
        presenter,
        priceInStr,
        priceInNum,
      });

      await event.save();
      console.log('Event created successfully!');
      res.status(200).json({ message: 'Event created successfully!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to create event.' });
    }
  });

  app.post('/users', (req, res) => {
    const { username, password, role } = req.body;
    const priKey = "1357924680";
    const newUser = new User({ username, password, role, priKey });

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

  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const priKey = "1357924680";
    const role = 'user';
    const newUser = new User({ username, password, role, priKey });

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

  app.get('/adminevents', (req, res) => {
    Event.find({})
      .then(events => {
        res.json(events);
      })
      .catch(error => {
        res.status(500).json({ error: "Failed to read events" });
      });
  });

  app.get('/locations', (req, res) => {
    Location.find({})
      .then(locations => {
        res.json(locations);
      })
      .catch(error => {
        res.status(500).json({ error: "Failed to read locations" });
      });
  });

  app.get('/users', (req, res) => {
    User.find({})
      .then(user => {
        res.json(user);
      })
      .catch(error => {
        res.status(500).json({ error: "Failed to read user" });
      });
  });

  app.delete('/adminevents/:eventId', (req, res) => {
    const eventId = req.params.eventId;

    Event.findByIdAndDelete(eventId)
      .then(() => {
        console.log('Event deleted successfully');
        res.json({ message: 'Event deleted successfully' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete event' });
      });
  });

  app.delete('/users/:username', (req, res) => {
    const username = req.params.username;

    User.findOneAndDelete({ username: username })
      .then(() => {
        console.log('User deleted successfully');
        res.json({ message: 'User deleted successfully' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
      });
  });

  app.put('/adminevents/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const { title, venueID, date, description, presenter, priceInStr, priceInNum } = req.body;

    Event.findByIdAndUpdate(
      { _id: eventId },
      { title, venueID, date, description, presenter, priceInStr, priceInNum },
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

  app.put('/users/:username', (req, res) => {
    const username = req.params.username;
    const { password, role } = req.body;

    User.findOneAndUpdate(
      { username: username },
      { password, role },
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
