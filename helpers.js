const users = require('./express_server');

// generate random 6 character string for shortened url
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

// search users database for user matching given email
const findUserFromEmail = (email, users) => {
  return Object.values(users).find(user => user.email === email) || null;
};

// authenticate user based on login information
const authenticateUser = (loginInfo, users) => {
  const { email, password } = loginInfo;
  const user = findUserFromEmail(email, users);

  if (!user) {
    return { error: 'No account associated with that e-mail exists.', user: null };
  }

  if (user.password !== password) {
    return { error: 'Incorrect Password.', user: null };
  }

  return { error: null, user };
};

// create a new user in the user database
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

// check if URL is valid (starts with 'http://' or 'https://')
const isValidURL = (url) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

// add URL to the database
const addURLToDatabase = (longURL, userID, urlDatabase) => {
  if (!isValidURL(longURL)) {
    return { error: 'Invalid URL. Please make sure the URL starts with http:// or https://', url: null };
  }

  const id = generateRandomString();
  urlDatabase[id] = {
    longURL: longURL,
    userID: userID
  };

  return { error: null, url: { id: id } };
};

module.exports = {
  createNewUser,
  authenticateUser,
  addURLToDatabase
}