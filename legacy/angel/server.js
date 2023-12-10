const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ type: ["application/json", "application/csp-report"] }));
app.use(bodyParser.urlencoded({extended: false}));
const { DOMParser } = require('xmldom');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/project');

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
  console.log("Connection is open...");
  
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

  const LocationSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    locationID: {type: Number, required: true},
    location: {type: String, required: true},
    latitude: {type: Number, required: false},
    longitude: {type: Number, required: false},
  });
  
  const Event = mongoose.model("Event", EventSchema);
  const Location = mongoose.model("Location", LocationSchema);



  // Fetching the venue data from the government website and store in MongoDB
  fetch("https://www.lcsd.gov.hk/datagovhk/event/venues.xml")
  .then(response => response.text())
  .then(data => {
    const venueXmlDoc = new DOMParser().parseFromString(data, 'text/xml');

    const venueElements = venueXmlDoc.getElementsByTagName("venue");

    for (var i = 0; i < venueElements.length; i++) {
      let newLocation = new Location({
        _id: new mongoose.Types.ObjectId(),
        locationID: venueElements[i].getAttribute("id"),
        location: venueXmlDoc.getElementsByTagName("venuee")[i].textContent,
        latitude: venueXmlDoc.getElementsByTagName("latitude")[i].textContent,
        longitude: venueXmlDoc.getElementsByTagName("longitude")[i].textContent,
      });

      // Turn the code below into a comment block to stop creating new locations in the database
      // /*
      newLocation
        .save()
        .then(() => console.log("a new location created successfully"))
        .catch((error) => console.log("failed to save new location" + error));
      // */
    }
  })
  .catch(error => {
    console.error("Error loading venue XML file: ", error);
  })

  // Fetching the event data from the government website and store in MongoDB
  fetch("https://www.lcsd.gov.hk/datagovhk/event/events.xml")
  .then(response => response.text())
  .then(data => {
    const eventXmlDoc = new DOMParser().parseFromString(data, 'text/xml');

    const eventElements = eventXmlDoc.getElementsByTagName("event");

    const priceInStr = [];
    const priceInNum = [];
    
    for (var i = 0; i < eventElements.length; i++) {
      priceInStr[i] = eventXmlDoc.getElementsByTagName("pricee")[i].textContent;
      priceInNum[i] = [];
    
      if (priceInStr[i]) {
        if (priceInStr[i].includes("Free") || priceInStr[i].includes("free")) {
          priceInNum[i].push(0);
        }

        const regEx1 = /\$\d+/g; // With dollar signs $, and without thousands separators ,
        const regEx2 = /\$\d{1,3}(?:,\d{3})*/g; // With dollar signs $, and with thousands separators ,
        const regEx3 = /[,;]\s\d+/g; // Without dollar signs $ for the middle parts, and without thousands separators ,

        if (/.*\$\d+(?:[,;]\s\d+)+/.test(priceInStr[i])) { // Test: True when there is only one $ at the beginning, while , or ; separates the prices
            priceInNum[i].push(...priceInStr[i].match(regEx1).concat(priceInStr[i].match(regEx3)).map(prices => prices.replace(/[\s$,;]/g, '')));
        } else if (/.*\$\d{1,3}(?:,\d{3})+/.test(priceInStr[i])) { // Test: True when there are thousands separators in the price
            priceInNum[i].push(...priceInStr[i].match(regEx2).map(prices => prices.replace(/[\s$,;]/g, '')));
        } else if (/.*\$\d+/.test(priceInStr[i])) { // Test: True when there is dollar sign
            priceInNum[i].push(...priceInStr[i].match(regEx1).map(prices => prices.replace(/[\s$,;]/g, '')));
        };
      };

      //console.log("Price Text: " + priceInStr[i] + "; Price Array: " + priceInNum[i]);
      
      let newEvent = new Event({
        eventID: eventElements[i].getAttribute("id"),
        title: eventXmlDoc.getElementsByTagName("titlee")[i].textContent,
        //venueID: venue._id,
        date: eventXmlDoc.getElementsByTagName("predateE")[i].textContent,
        description: eventXmlDoc.getElementsByTagName("desce")[i].textContent,
        presenter: eventXmlDoc.getElementsByTagName("presenterorgc")[i].textContent,
        priceInStr: priceInStr[i],
        priceInNum: priceInNum[i],
      });
      
      Location.findOne({ locationID: eventXmlDoc.getElementsByTagName("venueid")[i].textContent })
      .then((venue) => {
        newEvent.venueID = venue._id;
        
        // Turn the code below into a comment block to stop creating new locations in the database
        // /*
        newEvent
        .save()
        .then(() => console.log("a new event created successfully"))
        .catch((error) => console.log("failed to save new event" + error));
        // */
      })
      .catch((error) => console.log(error));
    }
  })
  .catch(error => {
    console.error("Error loading event XML file: ", error);
  })





  // List all locations in a table
  const aggregateEvents = () => {
    return Event.aggregate([
      {
        $group: {
          _id: "$venueID",
          count: { $sum: 1 }
        }
      }
    ])
    .exec();
  };

  /*
  aggregateEvents()
  .then(locationList => {
    //console.log(locationList);
  })
  .catch((error) => { console.log("Error in aggregation: ", error); });
  */
  
  app.all('/locationList', async (req, res) => {
    try {
      const locationList = await aggregateEvents();
      //res.status(200).json(locationList);
      let html = `
      <html>
        <head>
          <title> Location List </title>
          <!-- Include Bootstrap CSS -->
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">

          <style>
            table.dataTable thead .sorting:after,
            table.dataTable thead .sorting:before,
            table.dataTable thead .sorting_asc:after,
            table.dataTable thead .sorting_asc:before,
            table.dataTable thead .sorting_asc_disabled:after,
            table.dataTable thead .sorting_asc_disabled:before,
            table.dataTable thead .sorting_desc:after,
            table.dataTable thead .sorting_desc:before,
            table.dataTable thead .sorting_desc_disabled:after,
            table.dataTable thead .sorting_desc_disabled:before {
              bottom: .5em;
            }
          </style>
        </head>
        <body class="m-5">
          <h1> Location List </h1>
          <table id="locationTable" class="table table-bordered table-striped table-sm table-primary">
            <thead>
              <tr>
                <th class="text-center">Locations</th>
                <th class="text-center">Number of Events</th>
              </tr>
            </thead>
            <tbody>`;

      for (const i in locationList) {
        try {
          const venue = await Location.findOne({ _id: locationList[i]._id });
          html += `
                  <tr>
                    <td class="text-left">${venue.location}</td>
                    <td class="text-center">${locationList[i].count}</td>
                  </tr>`;
        } catch (error) {
          console.log(error);
        }
      }

      // Include the DataTables library in html to allow sorting in the location table
      html += `
            </tbody>
          </table>

          <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.css" />

          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
          <script src="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css"></script>
          <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
          <script src="https://cdn.datatables.net/1.11.3/js/dataTables.bootstrap5.min.js"></script>
          
          <script>
            $(document).ready(function() {
              $('#locationTable').DataTable();
            });
          </script>
        </body>
      </html>`;
      //console.log(html);
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } catch (error) {
      res.status(500).json({error: "Error in aggregation"});
    }
  });



  app.all('/eventList', async (req, res) => {
    try {
      // Show events whose price under a specific number (e.g., <= 100)
      Event.find({ priceInNum: { $lte: 100 } })
      .then((data) => {
        console.log("the event with price lower than or equal to 100:", data);
        let html = `
          <html>
            <body>
            </body>
          </html>`;
      })
      .catch((error) => console.log(error));
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } catch (error) {
      res.status(500).json(error);
    }
  });





  Location.find({})
  .then((data) => {
    //console.log(data);
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

  //for the search of location feature of the search bar
  app.post('/locations', (req, res) => {
    function setUpSearch (keywords){//setting up the RegExp for finding the results
      let tempStr = "" 
      keywords.forEach(keyword => {tempStr += "(?=.*" + keyword + ")"});
      let searchRegex =  tempStr 
      //console.log(searchRegex)
      return searchRegex;
    } 

      const target = req.body.name //this retrieves the contents in the search bar
      console.log(target)
      let searchKeywords = ''
      if (target){ //handles the case where the search box is non-empty => modify searchKeywords. Hence if the search box is empty searchKeywords = ''
          let keywords = target.trim().split(/[\s_()]+/)
          searchKeywords = RegExp(setUpSearch(keywords),'i');
          //console.log(searchKeywords)
      }

      let response = [];
      Location.find({ location: {$regex: searchKeywords}})
      .then((data) => {
        response = data;
        res.send(response); 
      }); 
    });
  });

const server = app.listen(5000);
