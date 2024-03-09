// dependencies
const cookieSession = require('cookie-session');
const express = require('express');
const { createNewUser,
  addURLToDatabase,
  authenticateUser,
  urlsForUser,
  findIdInDatabase, 
  getUserByEmail} = require('./helpers');

// constants
const PORT = 8080;

// database of short URLs and their corresponding long URLs
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// object to contain user information
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "$2a$10$RpJU9UsYhjwkmRDeQFrqTO4dpc2CZYsxS8y5MvWl5TH8JsfdD8BmK"
  }
};

// initialize express
const app = express();

// middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['banana', 'mongoose', 'typewriter'],

  // cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.set('view engine', 'ejs');

// GET routes
// route for no route to redirect to urls main page
app.get('/', (req, res) => {
  const user = req.session.userId;
  if (user) {
    return res.redirect('/urls');
  }
  return res.redirect('/login');
});

// route to display registration page to add new account
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.userId],
  };

  if (req.session.userId) {
    return res.redirect('/urls');
  }

  return res.render('register', templateVars);
});

// route to display login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.userId],
  };

  if (req.session.userId) {
    return res.redirect('/urls');
  }
  
  return res.render("login", templateVars);
});

// route to render the 'urls_index' template with urlDatabase
app.get('/urls', (req, res) => {
  const userId = req.session.userId;
  const { error, userURLs } = urlsForUser(userId, urlDatabase);
  const templateVars = {
    urls: userURLs,
    user: users[userId],
    error: error
  };

  if (!userId) {
    templateVars.error = '<h5>You must be <a href="/login">logged in</a> to view URLs.</h5>'
    return res.status(403).render('error', templateVars);
  }

  if (error) {
    return res.status(403).render('error', templateVars);
  }

  return res.render('urls_index', templateVars);
});

// route to display page to add new url to our database
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session.userId],
  };

  if (!req.session.userId) {
    return res.redirect('/login');
  }
  return res.render('urls_new', templateVars);
});

// route to render the 'urls_show' template with specific URL information
app.get('/urls/:id', (req, res) => {
  const userId = req.session.userId;
  const id = req.params.id;
  const urlExists = findIdInDatabase(id, urlDatabase);
  let templateVars = { 
    user: userId,
    error: ""
  };

  if (!urlExists) {
    templateVars.error = '<h5>The requested URL does not exist.</h5> \nPlease add some <a href="/urls/new">URLs.</a>'
    return res.status(404).render('error', templateVars);
  }
  
  if (!userId) {
    templateVars.error = '<h5>You must be logged in to view and edit URLs.</h5> \nPlease <a href="/login">login</a> or <a href="/register">register.</a>'
    return res.status(403).render('error', templateVars);
  }
  
  if (userId !== urlDatabase[id].userId) {
    templateVars.error = '<h5>Users can only view URLs belonging to themselves.</h5> \nPlease add some <a href="/urls/new">URLs.</a>';
    templateVars.user = users[userId];
    return res.status(403).render('error', templateVars);
  }
  
  templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.userId],
  };
  
  return res.render('urls_show', templateVars);
});

// route to use short url id to redirect user to longURL site
app.get('/u/:id', (req, res) => {
  const userId = req.session.userId;
  const shortURL = req.params.id;
  const templateVars = { 
    user: users[userId],
    error: ''
  };
  let longURL = urlDatabase[shortURL] ? urlDatabase[shortURL].longURL : null;

  if (!longURL) {
    templateVars.error = '<h5>404 not found: requested URL does not exist</h5>';
    return res.status(404).render('error', templateVars);
  }

  if (!longURL.startsWith('http://') && !longURL.startsWith('https://')) {
    longURL = 'http://' + longURL;
  }

  return res.redirect(longURL);
});

// route to return the urlDatabase object as JSON
app.get('/urls.json', (req, res) => {
  return res.json(urlDatabase);
});

// POST routes
// route to handle POST request to delete a URL with the specified ID from the urlDatabase object
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  const userId = req.session.userId;
  if (!userId) {
    return res.status(403).send('You must be logged in to view and edit URLs.');
  }
  
  if (userId !== urlDatabase[id].userId) {
    return res.status(403).send('Users can only view or edit URLs belonging to themselves.');
  }

  if (!findIdInDatabase(id, urlDatabase)) {
    return res.status(403).send('The requested URL does not exist.');
  }

  delete urlDatabase[id];
  return res.redirect('/urls');
});

// route to handle POST request to edit long url by updating long url in urlDatabase for current id
app.post('/urls/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(403).send('You must be logged in to view and edit URLs.');
  }
  
  if (userId !== urlDatabase[id].userId) {
    return res.status(403).send('Users can only view or edit URLs belonging to themselves.');
  }

  if (!findIdInDatabase(id, urlDatabase)) {
    return res.status(403).send('The requested URL does not exist.');
  }

  urlDatabase[id].longURL = req.body.longURL;
  return res.redirect('/urls');
});

//route to handle POST request to edit long url from homepage by redirecting to the edit page
app.post('/urls/:id/edit', (req, res) => {
  const { id } = req.params;
  return res.redirect(`/urls/${id}`);
});

// route to handle POST request to generate short url id, pair with user given long url, and add both to urlDatabase
app.post('/urls', (req, res) => {
  const userId = req.session.userId;
  const longURL = req.body.longURL;

  if (!userId) {
    return res.status(403).send('You must be logged in to create URLs.');
  }

  const { error, url } = addURLToDatabase(longURL, userId, urlDatabase);

  if (error) {
    return res.status(400).send(error);
  }

  return res.redirect(`/urls/${url.id}`);
});

// route to handle POST request to create cookie with userId when user logs in to website
app.post('/login', (req, res) => {
  const loginInfo = { email: req.body.email, password: req.body.password };
  const { error, user } = authenticateUser(loginInfo, users);

  if (error) {
    return res.status(403).send(error);
  }

  req.session.userId = user.id;
  return res.redirect('/urls');
});

// route to handle POST request to clear userId cookie when logout button is pressed
app.post('/logout', (req, res) => {
  req.session = null;
  return res.redirect('/login');
});

// route to handle POST request with user registration info
app.post('/register', (req, res) => {
  const email = req.body.email;
  const { error } = createNewUser(req.body, users);
  const user = getUserByEmail(email, users);
  const templateVars = {
    user,
    error
  };

  if (error) {
    return res.status(400).render('error', templateVars);
  }

  req.session.userId = user.id;
  return res.redirect('/urls');
});

// start the server and listen on the specified port
const server = app.listen(PORT, () => {
  console.log(`Tinyapp server listening on port ${PORT}!`);
});

module.exports = {
  app,
  server
};