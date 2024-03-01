const express = require('express');
const app = express();
const PORT = 8080;

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
}

// set the view engine to EJS
app.set('view engine', 'ejs');

// set express to convert buffer into readable string
app.use(express.urlencoded({ extended: true }));

// database of short URLs and their corresponding long URLs
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

// route for no route to redirect to urls main page
app.get('/', (req, res) => {
  res.redirect('/urls');
});

// route to render the 'urls_index' template with urlDatabase
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// route to display page to add new url to our database
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// route to render the 'urls_show' template with specific URL information
app.get('/urls/:id', (req, res) => {
  console.log(req.params);
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
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

// handles POST request to delete a URL with the specified ID from the urlDatabase object
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

//handles POST request to edit long url by updating long url in urlDatabase for current id
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect('/urls');
});

//handles POST request to edit long url from homepage by redirecting to the edit page
app.post('/urls/:id/edit', (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

// handles POST request to generate short url id, pair with user given long url, and add both to urlDatabase
app.post('/urls', (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

// handles POST request to create cookie with username when user fills form in navbar
app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('Username', username);
  res.redirect('/urls');
})

// start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Tinyapp server listening on port ${PORT}!`);
});