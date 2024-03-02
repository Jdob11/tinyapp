// dependencies
const cookieParser = require('cookie-parser')
const express = require('express');
const { generateRandomString, findUserFromEmail } = require('./helpers');

// constants
const PORT = 8080;

// database of short URLs and their corresponding long URLs
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

// object to contain user information
const users = {
};

// initialize express
const app = express();

// middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');


// routes
// route for no route to redirect to urls main page
app.get('/', (req, res) => {
  res.redirect('/urls');
});

// route to display registration page to add new account
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render("register", templateVars);
});

// route to render the 'urls_index' template with urlDatabase
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user:users[req.cookies.user_id]
  };
  res.render('urls_index', templateVars);
});

// route to display page to add new url to our database
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render("urls_new", templateVars);
});

// route to render the 'urls_show' template with specific URL information
app.get('/urls/:id', (req, res) => {
  console.log(req.params);
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies.user_id],
  };
  res.render('urls_show', templateVars);
});

// route to use short url id to redirect user to longURL site
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// route to return the urlDatabase object as JSON
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// route to handle POST request to delete a URL with the specified ID from the urlDatabase object
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

// route to handle POST request to edit long url by updating long url in urlDatabase for current id
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect('/urls');
});

//route to handle POST request to edit long url from homepage by redirecting to the edit page
app.post('/urls/:id/edit', (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

// route to  handle POST request to generate short url id, pair with user given long url, and add both to urlDatabase
app.post('/urls', (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

// route to handle POST request to create cookie with username when user fills form in navbar
app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
})

// route to handle POST request to clear username cookie when logout button is pressed
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})

// route to handle POST request with user registration info
app.post('/register', (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("Please enter both an email and a password to register.");
    return;
  };
  if (findUserFromEmail(req.body.email, users)) {
    res.status(400).send('This e-mail already exists');
    return;
  }
  const userId = generateRandomString();
  const newUser = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  };
  users[userId] = newUser;
  res.cookie('user_id', userId);
  res.redirect('/urls');
  console.log(users);
})

// start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Tinyapp server listening on port ${PORT}!`);
});

module.exports = {
  users,
};