# CSCI2720-pjt
Building Web Applications Course Project

Initial setup:
1. Open the terminal and CD to the file
2. Install all dependencies by running: npm install
3. Open MongoDB Compass and connect to mongodb://localhost:27017/project
4. Initialize locations and events collections by running: node src/setup.js
5. Exit the setup script when "All data have been saved to MongoDB. You may terminate and close setup.js now." appears in the terminal
6. [Make sure to also add in the setup instructions for the admin/user data base]

Starting the server:
1. Open the terminal and CD to the file
2. Start the Node.js server running on port 5001 by running: node src/server.js
3. Import JSON file from datajson/project.userdata.json to the collection (userdata) in local        mongodb(mongodb://localhost:27017/project)
4. Open another terminal and CD to the file
5. Start the npm server running on port 3000 by running: npm start
6. Browse the app in your web browser at http://localhost:3000/
