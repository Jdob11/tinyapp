// dependencies
const cookieParser = require('cookie-parser')
const express = require('express');
const { createNewUser, generateRandomString, findUserFromEmail } = require('./helpers');

// constants
const PORT = 8080;

// database of short URLs and their corresponding long URLs
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

// object to contain user information
const users = {};

// initialize express
const app = express();

// middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');


// GET routes
// route for no route to redirect to urls main page
app.get('/', (req, res) => {
  return res.redirect('/urls');
});

// route to display registration page to add new account
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  return res.render("register", templateVars);
});

// route to display login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  return res.render("login", templateVars);
});

// route to render the 'urls_index' template with urlDatabase
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user:users[req.cookies.user_id]
  };
  return res.render('urls_index', templateVars);
});

// route to display page to add new url to our database
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  return res.render("urls_new", templateVars);
});

// route to render the 'urls_show' template with specific URL information
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies.user_id],
  };
  return res.render('urls_show', templateVars);
});

// route to use short url id to redirect user to longURL site
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
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
  delete urlDatabase[id];
  return res.redirect('/urls');
});

// route to handle POST request to edit long url by updating long url in urlDatabase for current id
app.post('/urls/:id', (req, res) => {
  const { id } = req.params;
  urlDatabase[id] = req.body.longURL;
  return res.redirect('/urls');
});

//route to handle POST request to edit long url from homepage by redirecting to the edit page
app.post('/urls/:id/edit', (req, res) => {
  const { id } = req.params;
  return res.redirect(`/urls/${id}`);
});

// route to  handle POST request to generate short url id, pair with user given long url, and add both to urlDatabase
app.post('/urls', (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  return res.redirect(`/urls/${id}`);
});

// route to handle POST request to create cookie with user_id when user logs in to website
app.post('/login', (req, res) => {
  const user = findUserFromEmail(req.body.email, users);
  if (!findUserFromEmail(req.body.email, users)) {
    return res.status(403).send('No account associated with that e-mail exists.');
  }
  const userID = user.id;
  if (findUserFromEmail(req.body.email, users) && req.body.password !== users[userID].password) {
    return res.status(403).send("Incorrect Password.");
  };
  res.cookie('user_id', user.id);
  return res.redirect('/urls');
});

// route to handle POST request to clear user_id cookie when logout button is pressed
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  return res.redirect('/login');
})

// route to handle POST request with user registration info
app.post('/register', (req, res) => {
  const { error, user } = createNewUser(req.body, users);

  if (error) {
    return res.status(400).send(error);
  }

  res.cookie('user_id', user.id);
  return res.redirect('/urls');
});

// start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Tinyapp server listening on port ${PORT}!`);
});

module.exports = {
  users,
};