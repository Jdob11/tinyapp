# TinyApp

TinyApp is a simple URL shortening web application that allows users to shorten long URLs to more manageable lengths.

## Introduction

TinyApp uses EJS (Embedded JavaScript) templates for rendering dynamic content and forms across various pages. Below are the EJS files and their functionalities within the project.

## Final Product

!["Screenshot of URLs page"](https://github.com/Jdob11/tinyapp/blob/main/docs/urls_index.png?raw=true)
!["Screenshot of URL edit page"](https://github.com/Jdob11/tinyapp/blob/main/docs/urls_show.png?raw=true)
!["Screenshot of error when registering"](https://github.com/Jdob11/tinyapp/blob/main/docs/register_error.png?raw=true)

## Project Information

This project was developed as part of the curriculum at Lighthouse Labs. It represents an educational exercise and may contain specific requirements or constraints imposed by the course instructors.

### Note to Contributors

If you're considering contributing to this project or using it as a reference, please be aware that it was created for educational purposes and may not adhere to all industry standards or best practices. While contributions and feedback are welcome, please keep in mind the context in which this project was developed.

## File Structure

### Root Folder (`/`)
- `.gitignore`: Contains a list of files and directories that Git should ignore.
- `express_server.js`: Main server file containing the Express application logic.
- `helpers.js`: File containing helper functions used in the application.
- `LICENSE.txt`: License file detailing the project's licensing information.
- `package-lock.json`: Auto-generated file for npm's dependency tree.
- `package.json`: File containing project metadata and dependencies.
- `README.md`: README file providing information about the project.

### Test Folder (`/test`)
- `express_serverTest.js`: Test file for testing the `express_server.js` file.
- `helpersTest.js`: Test file for testing the `helpers.js` file.

### Views Folder (`/views`)
- `login.ejs`: Renders the login page and form.
- `register.ejs`: Renders the registration page and form.
- `urls_index.ejs`: Renders a list of the user's URLs. Each URL entry includes an edit button, which navigates to `urls_show.ejs` for editing, and a delete button to remove the URL.
- `urls_new.ejs`: Renders a page to create a new URL, along with a form for submission.
- `urls_show.ejs`: Displays existing URL information and provides a form for editing.

### Partial Views Folder (`/views/partial`)
- `_header.ejs`: Displays a header with navigation links. If a user is logged in, it also shows the username and a logout button.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Jdob11/tinyapp.git
```

2. Navigate to the project directory:

```bash
cd tinyapp
```

3. Install dependencies:

```bash
npm install
```

## Usage

1. Start the server:

```bash
npm start
```

2. Open your web browser and navigate to [http://localhost:8080](http://localhost:8080).

3. Register for an account or login if you already have one.

4. Shorten URLs and manage them in your dashboard.

## Pages

- `/register`: Displays the registration page to add a new account.

- `/login`: Displays the login page.

- `/urls`: Renders the URLs main page where users can manage their URLs.

- `/urls/new`: Displays the page to add a new URL to the database.

- `/urls/:id`: Renders the page with specific URL information.

- `/u/:id`: Redirects the user to the long URL corresponding to the short URL.

- `/urls.json`: Returns the URL database object as JSON.

## Dependencies

- [cookie-session](https://www.npmjs.com/package/cookie-session): Express middleware for managing session cookies.
- [express](https://www.npmjs.com/package/express): Web framework for Node.js.

- [ejs](https://www.npmjs.com/package/ejs): Embedded JavaScript templates.

## Testing

Unit tests are included to ensure the functionality of the application.

To run tests:

```bash
npm test
```

## Contributors

- Jeff Dobson (https://github.com/Jdob11)

## Acknowledgments

This project includes code provided by [Lighthouse Labs](https://www.lighthouselabs.ca/).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
