// dependencies
const cookieParser = require('cookie-parser')
const express = require('express');
const { createNewUser,
  addURLToDatabase,
  authenticateUser,
  urlsForUser } = require('./helpers');

// constants
const PORT = 8080;

// database of short URLs and their corresponding long URLs
const urlDatabase = {};

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
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };

  if (req.cookies.user_id) {
    return res.redirect('/urls');
  }

  return res.render('register', templateVars);
});

// route to display login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };

  if (req.cookies.user_id) {
    return res.redirect('/urls');
  }
  
  return res.render("login", templateVars);
});

// route to render the 'urls_index' template with urlDatabase
app.get('/urls', (req, res) => {
  const userId = req.cookies.user_id;
  const { error, userURLs } = urlsForUser(userId, urlDatabase)
  const templateVars = {
    urls: userURLs,
    user:users[userId]
  };
  if (error) {
    return res.status(403).send(error);
  }
  if (!userId) {
    return res.status(403).send('<h3>You must be <a href="/login">logged in</a> to view URLs.</h3>');
  }
  return res.render('urls_index', templateVars);
});

// route to display page to add new url to our database
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };

  if (!req.cookies.user_id) {
    return res.redirect('/login');
  }
  return res.render('urls_new', templateVars);
});

// route to render the 'urls_show' template with specific URL information
app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies.user_id],
  };
  const user_id = req.cookies.user_id;
  const id = req.params.id;

  if (!user_id) {
    return res.status(403).send('<h3>You must be logged in to view and edit URLs.</h3> \nPlease <a href="/login">login</a> or <a href="/register">register.</a>');
  };
  
  if (user_id !== urlDatabase[id].userID) {
    return res.status(403).send('<h3>Users can only view URLs belonging to themselves.</h3> \nPlease add some <a href="/urls/new">URLs.</a>');
  }

  return res.render('urls_show', templateVars);
});

// route to use short url id to redirect user to longURL site
app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!longURL) {
    return res.status(404).send('404 not found: requested url does not exist')
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
  delete urlDatabase[id];
  return res.redirect('/urls');
});

// route to handle POST request to edit long url by updating long url in urlDatabase for current id
app.post('/urls/:id', (req, res) => {
  const { id } = req.params;
  const user_id = req.cookies.user_id;
  const longURL = req.body.longURL
  const { error } = addURLToDatabase(longURL, user_id, urlDatabase);
  
  if (error) {
    return res.status(400).send(error);
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
  const user_id = req.cookies.user_id;
  const longURL = req.body.longURL

  if (!user_id) {
    return res.status(403).send('<h3>You must be logged in to create URLs.</h3> \nPlease <a href="/login">login</a> or <a href="/register">register.</a>');
  };

  const { error, url } = addURLToDatabase(longURL, user_id, urlDatabase);

  if (error) {
    return res.status(400).send(error);
  }

  return res.redirect(`/urls/${url.id}`);
});

// route to handle POST request to create cookie with user_id when user logs in to website
app.post('/login', (req, res) => {
  const loginInfo = { email: req.body.email, password: req.body.password };
  const { error, user } = authenticateUser(loginInfo, users);

  if (error) {
    return res.status(403).send(error);
  }

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
  const { error } = createNewUser(req.body, users);

  if (error) {
    return res.status(400).send(error);
  }

  return res.redirect('/login');
});

// start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Tinyapp server listening on port ${PORT}!`);
});

module.exports = {
  users,
};