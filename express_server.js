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

// route to return the urlDatabase object as JSON
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// endpoint to generate short url id, pair with user given long url, and add both to urlDatabase
app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  console.log(urlDatabase);
  res.send("Ok");
});

// start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});