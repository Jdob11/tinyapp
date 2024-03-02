const users = require('./express_server');

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

const findUserFromEmail = (email, users) => {
  return Object.values(users).find(user => user.email === email) || null;
};

const createNewUser = (userInfo, users) => {
  const { email, password } = userInfo;

  if (!email || !password) {
    return { error: "Please enter both an email and a password to register.", user: null };
  }

  if (findUserFromEmail(email, users)) {
    return { error: 'This e-mail already exists', user: null };
  }

  const userId = generateRandomString();
  const newUser = {
    id: userId,
    email,
    password
  };
  users[userId] = newUser;
  return { error: null, user: newUser };
};

module.exports = {
  createNewUser,
  generateRandomString,
  findUserFromEmail
}