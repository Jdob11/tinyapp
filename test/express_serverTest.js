const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../express_server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('express_server.js tests\n', () => {
  describe('Testing GET request routes when logged out', () => {
    
    it('GET request to / should redirect to /login with a status code of 302 when not logged in', (done) => {
      chai.request(app)
        .get('/')
        .redirects(0)
        .end((err, res) => {
          expect(res).to.redirectTo('/login');
          expect(res).to.have.status(302);
          done();
        });
    });

    it('GET request to /urls/new should redirect to /login with a status code of 302 when not logged in', (done) => {
      chai.request(app)
        .get('/urls/new')
        .redirects(0)
        .end((err, res) => {
          expect(res).to.redirectTo('/login');
          expect(res).to.have.status(302);
          done();
        });
    });

    it('GET request to /urls/:id (existing id) should receive an error message when not logged in', (done) => {
      chai.request(app)
        .get('/urls/b6UTxQ')
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.text).to.include('You must be logged in to view and edit URLs');
          done();
        });
    });
    
    it('GET request to /urls/NOTEXISTS should receive an error message when the id does not exist', (done) => {
      chai.request(app)
        .get('/urls/NOTEXISTS')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.text).to.include(res.text, 'Requested URL does not exist.');
          done();
        });
    });
  });

    
  describe('Testing restricted URL access after login', () => {
    let agent = chai.request.agent(app);
  
    it('should login successfully and then access restricted URL with a status code of 403', () => {
      // Register a new user
      return agent
        .post('/register')
        .send({ email: 'test@example.com', password: 'test123' })
        .then(res => {
          expect(res).to.redirect;
          // Login with the newly registered user credentials
          return agent
            .post('/login')
            .send({ email: 'test@example.com', password: 'test123' });
        })
        .then(res => {
          expect(res).to.redirect;
          // Access the restricted URL after successful login
          return agent.get('/urls/b6UTxQ');
        })
        .then(res => {
          // Expecting status code 403 since the URL is restricted
          expect(res).to.have.status(403);
          expect(res.text).to.include('Users can only view URLs belonging to themselves.');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  after((done) => {
    server.close((err) => {
      if (err) {
        console.error('\nError closing server:', err);
      } else {
        console.log('\nServer closed successfully');
      }
      done(err);
    });
  });
});
