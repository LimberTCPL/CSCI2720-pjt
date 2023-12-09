const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');
app.use(cors());
app.use(bodyParser.json());
const db = mongoose.connection;

const EventSchema = mongoose.Schema({
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

const UserSchema = mongoose.Schema({
    username: {
      type: String,
      required: [true,"User Name is required"],
    },
    password: {
      type: String,
      required: true,
    },
  });

const Event = mongoose.model("Event", EventSchema);
const User = mongoose.model("User",UserSchema);

app.post('/events', (req, res) => {
  const { eventID, location, quota } = req.body;
  const newEvent = new Event({ eventID, location, quota });

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

app.post('/userevents', (req, res) => {
    const { username,password} = req.body;
    const newUser = new User({ username,password });
  
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

app.get('/events', (req, res) => {
  Event.find({})
    .then(events => {
      res.json(events);
    })
    .catch(error => {
      res.status(500).json({ error: "Failed to read events" });
    });
});

app.get('/userevents', (req, res) => {
    User.find({})
      .then(user => {
        res.json(user);
      })
      .catch(error => {
        res.status(500).json({ error: "Failed to read user" });
      });
  });
  
  app.delete('/events/:eventId', (req, res) => {
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

  app.delete('/userevents/:username', (req, res) => {
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

app.put('/events/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const { location, quota } = req.body;
  
    Event.findByIdAndUpdate(
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

  app.put('/userevents/:username', (req, res) => {
    const username = req.params.username;
    const { password } = req.body;
  
    User.findOneAndUpdate(
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

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function () {
  console.log("Connection is open...");

  // Start the server
  app.listen(3001, () => {
    console.log('App listening on port 3001');
  });
});