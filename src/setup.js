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
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    eventCount: {type: Number, required: true},
  });
  
  const Event = mongoose.model("Event", EventSchema);
  const Location = mongoose.model("Location", LocationSchema);

  // Fetching the event and venue data from the government website and store in MongoDB
  Promise.all([fetch("https://www.lcsd.gov.hk/datagovhk/event/events.xml"), fetch("https://www.lcsd.gov.hk/datagovhk/event/venues.xml")])
  .then(responses => Promise.all(responses.map(response => response.text())))
  .then(xmlDataArray => {
    const [eventXmlData, venueXmlData] = xmlDataArray;
    const eventXmlDoc = new DOMParser().parseFromString(eventXmlData, 'text/xml');
    const venueXmlDoc = new DOMParser().parseFromString(venueXmlData, 'text/xml');
    
    const eventElements = eventXmlDoc.getElementsByTagName("event");
    const venueElements = venueXmlDoc.getElementsByTagName("venue");
    
    // Count the number of events for each location
    const eventCounts = {};
    const venueIDArray = eventXmlDoc.getElementsByTagName("venueid");

    for (var i = 0; i < eventElements.length; i++) {
      const venueID = venueIDArray[i].textContent;

      if (eventCounts[venueID]) { // The venue exists in eventCounts already
        eventCounts[venueID] += 1;
      } else {
        eventCounts[venueID] = 1; // Initialize the event count of the venue
      }
    }
    
    console.log("Finished counting the number of events for each location");
    
    async function processData() {
      const pushPromises = [];

      // Choose 10 venues to be shown in app
      const venueChosen = []; // Store the venues that have been chosen
      const locationArray = venueXmlDoc.getElementsByTagName("venuee");
      const latitudeArray = venueXmlDoc.getElementsByTagName("latitude");
      const longitudeArray = venueXmlDoc.getElementsByTagName("longitude");

      for (var i = 0; i < venueElements.length; i++) {
        const venueID = venueElements[i].getAttribute("id");
        const location = locationArray[i].textContent;
        const latitude = latitudeArray[i].textContent;
        const longitude = longitudeArray[i].textContent;
        
        if (latitude && longitude) { // Check if both latitude and longitude exist
          // Check if the new location does not have the same latitude and longitude as any chosen locations and there are at least 3 events held in that location
          if (!venueChosen.some(venue => venue.latitude == latitude && venue.longitude == longitude) && eventCounts[venueID] >= 3) {
            let newLocation = new Location({
              _id: new mongoose.Types.ObjectId(),
              locationID: venueID,
              location: location,
              latitude: latitude,
              longitude: longitude,
              eventCount: eventCounts[venueID]
            });
            
            // Push the new chosen location into the venueChosen array
            venueChosen.push(newLocation);
            console.log("A new location chosen:\n" + newLocation);
            
            pushPromises.push(new Promise((resolve, reject) => {
              // Save the new location to MongoDB
              newLocation
              .save()
              .then(() => {
                console.log("A new location created successfully:\n" + newLocation);
                resolve();
              })
              .catch((error) => {
                console.log("Failed to save new location: " + error);
                reject();
              });
            }))

            // Break the loop when 10 venues have been chosen
            if (venueChosen.length >= 10) {
              break;
            }
          }
        }
      }
      
      // Find all the events corresponding to the 10 chosen locations and store in MongoDB
      const priceInStr = [];
      const priceInNum = [];

      // Wait for saving all the loctaions to MongoDB
      await Promise.all(pushPromises);

      let totalEvents = 0; // Record the total number of events corresponding to the 10 chosen venues
      let savedEvents = 0; // Record the number of events saved to MongoDB

      for (var i = 0; i < eventElements.length; i++) {
        if (venueChosen.some(venue => venue.locationID == eventXmlDoc.getElementsByTagName("venueid")[i].textContent)) { // The event is held in the 10 venues chosen
          priceInStr[i] = eventXmlDoc.getElementsByTagName("pricee")[i].textContent;
          priceInNum[i] = [];
          totalEvents++;
            
          // Find out the price (in an array of numbers) according to the price (in string) given
          if (priceInStr[i]) { // The price of the event is given
            if (priceInStr[i].includes("Free") || priceInStr[i].includes("free")) { // The price is said to be free
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
            
          // Find the ObjectId of the corresponding location of the event
          Location.findOne({ locationID: eventXmlDoc.getElementsByTagName("venueid")[i].textContent })
          .then((venue) => {
            newEvent.venueID = venue._id;
            
            // Save the new event to MongoDB
            newEvent
            .save()
            .then(() => {
              console.log("A new event created successfully:\n" + newEvent);
              savedEvents++;

              if (savedEvents == totalEvents) {
                console.log("All data have been saved to MongoDB. You may terminate and close setup.js now.");
              }
            })
            .catch((error) => {
              console.log("Failed to save new event: " + error);
            });
          })
          .catch((error) => console.log(error));
        }
      }
    }

    processData();
  })
  .catch(error => {
    console.error("Error loading XML files: ", error);
  })
});
