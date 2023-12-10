const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const priKey = '1357924680';

const users = [
   {
      username: 'user',
      userpassword: 'password',
      role: 'user',
   },
   {
      username: 'admin',
      userpassword: 'password',
      role: 'admin',
   },
];

const refreshTokenList = [];

app.post('/login', (req, res) => {
   // check the user info is correct or not
   const user = users.find((user) =>
      user.username === req.body.username &&
      user.userpassword === req.body.userpassword
   );

   if (!user) {
   // indicate an insuccessful login 
   return res.status(401).json({ message: 'You have logged in successfully!' });;
   }

   // generate accessToken with duration of 5 min and refreshToken with duration of 1 day
   const accessToken = jwt.sign(
      { username: user.username, role: user.role }, 
      priKey, 
      { expiresIn: '5m' }
   );

   const refreshToken = jwt.sign(
      { username: user.username, role: user.role }, 
      priKey, 
      { expiresIn: '1d' }
   );

   // push the refreshToken into the refreshToken array
   refreshTokenList.push(refreshToken);

   // send back the respone to client
   res.json({ accessToken, refreshToken });
});

app.post('/refresh', (req, res) => {
   const refreshToken = req.body.token;

   if (!refreshToken) {
      // if there is no refreshToken, raise unautorized status
      return res.status(401).json({ message: 'You are not unautorized yet!' });
   }

   if (!refreshTokenList.includes(refreshToken)) {
      // if the refreshToken is not included in the array, raise forbidden status
      return res.status(403).json({ message: 'You are not allowed to access this page!' });;
   }

   jwt.verify(refreshToken, priKey, (err, user) => {
      if (err) {
         // if there is some problems in the verification of refreshToken, raise the forbidden status
         return res.status(403).json({ message: 'You cannot pass the verification!' });;
      }

      // generate a new accessToken if no error occurs
      const accessToken = jwt.sign({ username: user.username, role: user.role }, priKey, { expiresIn: '5m' });

      // send the new accessToken back
      res.json({ accessToken });
   });
});

app.post('/logout', (req, res) => {
   // remove the refeshToken from array to proceed the logout command
   refreshTokenList = refreshTokenList.filter((token) => token !== req.body.token);
   // send back a successful process
   res.status(204).json({ message: 'You have logged out successfully' });
});

app.listen(3001, () => console.log('Server is running on port 3001'));