const bcrypt = require('bcryptjs');

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

// search if id in url exists in urlDatabase
const findIdInDatabase = (id, urlDatabase) => {
  return Object.keys(urlDatabase).find(url => url === id) || null;
};

// authenticate user based on login information
const authenticateUser = (loginInfo, users) => {
  const { email, password } = loginInfo;
  const user = findUserFromEmail(email, users);
  const passwordCheck = bcrypt.compareSync(password, user.password);

  if (!user) {
    return { error: '<h3>No account associated with that e-mail exists.</h3>\nPlease <a href="/register">register.', user: null };
  }

  if (!passwordCheck) {
    return { error: '<h3>Incorrect Password.</h3>\nPlease <a href="/login">try again.</a>', user: null };
  }

  return { error: null, user };
};

// create a new user in the user database
const createNewUser = (userInfo, users) => {
  const { email, password } = userInfo;

  if (!email || !password) {
    return { error: '<h3>You must enter both an email and a password to register.</h3> \nPlease <a href="/register">try again.</a>', user: null };
  }

  if (findUserFromEmail(email, users)) {
    return { error: '<h3>This e-mail already exists</h3>\nPlease <a href="/register">try again</a> with a new email.', user: null };
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = generateRandomString();
  const newUser = {
    id: userId,
    email,
    password: hashedPassword
  };
  users[userId] = newUser;
  return { error: null, user: newUser };
};

// add URL to the database
const addURLToDatabase = (longURL, userID, urlDatabase) => {
  const id = generateRandomString();
  urlDatabase[id] = {
    longURL: longURL,
    userID: userID
  };

  return { error: null, url: { id: id } };
};

// retrieve only urls that belong to logged in user
const urlsForUser = (currentUser, urlDatabase) => {
  const userURLs = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === currentUser)
      userURLs[shortURL] = urlDatabase[shortURL];
  }

  if (Object.keys(userURLs).length === 0) {
    const error = '<h3>No URLs found for the current user.</h3>\nPlease add some <a href="/urls/new">URLs.</a>';
    return { error, userURLs: null};
  }
  return { error: null, userURLs };
};

module.exports = {
  createNewUser,
  authenticateUser,
  addURLToDatabase,
  urlsForUser,
  findIdInDatabase
};