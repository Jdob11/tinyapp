const express = require('express');
const app = express();
const PORT = 8080;

// set the view engine to EJS
app.set('view engine', 'ejs');

// database of short URLs and their corresponding long URLs
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

// route for the homepage
app.get('/', (req, res) => {
  res.send('Hello!');
});

// route to display a simple HTML page with "Hello World"
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// route to render the 'urls_index' template with urlDatabase
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// route to render the 'urls_show' template with specific URL information
app.get('/urls/:id', (req, res) => {
  console.log(req.params);
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render('urls_show', templateVars);
});

// route to return the urlDatabase object as JSON
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});