CSCI2720-pjt
Building Web Applications Course Project

Initial setup:

Open the terminal and CD to the file
Install all dependencies by running: npm install
Open MongoDB Compass and connect to mongodb://localhost:27017/project
Initialize locations and events collections by running: node src/setup.js
Exit the setup script when "All data have been saved to MongoDB. You may terminate and close setup.js now." appears in the terminal
Start the Node.js server running on port 5001 by running: node src/server.js
Import JSON file using datajson/project.userdata.json to the collection (userdata) in local mongodb(mongodb://localhost:27017/project)
Starting the server:

Open another terminal and CD to the file
Start the npm server running on port 3000 by running: npm start
Browse the app in your web browser at http://localhost:3000/
Login as User with (username: user, password: password), Admin with (username: admin, password: password)
