const userObject = require('./express_server');

// function to generate random 6 character string for shortened url
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  const stringLength = 6;
  
  for (let i = 0; i < stringLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

const findUserFromEmail = (email, userObject) => {
  for (const userID in userObject) {
    const user = userObject[userID];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

module.exports = {
  generateRandomString,
  findUserFromEmail
}