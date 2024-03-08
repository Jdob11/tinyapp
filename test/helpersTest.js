const { assert } = require('chai');
const bcrypt = require('bcryptjs');
const {
  generateRandomString,
  getUserByEmail,
  findIdInDatabase,
  authenticateUser,
  createNewUser,
  addURLToDatabase,
  urlsForUser
} = require('../helpers.js');

describe('helper.js tests\n', () => {
  describe('generateRandomString', () => {
    it('should return a string of length 6', () => {
      const result = generateRandomString();
      assert.strictEqual(result.length, 6);
    });
  });

  describe('getUserByEmail', () => {
    const testUsers = {
      'userRandomID': {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
      },
      'user2RandomID': {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
      }
    };

    it('should return a user with valid email', () => {
      const user = getUserByEmail('user@example.com', testUsers);
      assert.exists(user.email);
      assert.strictEqual('user@example.com', user.email)
    });

    it('should return a undefined with invalid email', () => {
      const user = getUserByEmail('nonuser@example.com', testUsers);
      assert.isUndefined(user, 'User should be undefined for non-existing email');
    });
  });

  describe('findIdInDatabase', () => {
    const urlDatabase = {
      'abc123': { longURL: 'https://example.com', userId: 'user1' },
      'def456': { longURL: 'https://google.com', userId: 'user2' }
    };

    it('should return the ID if it exists in the database', () => {
      const result = findIdInDatabase('abc123', urlDatabase);
      assert.strictEqual(result, 'abc123');
    });

    it('should return undefined if ID does not exist in the database', () => {
      const result = findIdInDatabase('nonexistent', urlDatabase);
      assert.isUndefined(result);
    });
  });

  const users = {
    'user1': { id: 'user1', email: 'test@example.com', password: bcrypt.hashSync('password1', 10) },
    'user2': { id: 'user2', email: 'user@example.com', password: bcrypt.hashSync('password2', 10) }
  };

  describe('authenticateUser', () => {
    it('should return the user object if credentials are correct', () => {
      const loginInfo = { email: 'test@example.com', password: 'password1' };
      const result = authenticateUser(loginInfo, users);
      assert.isNotNull(result.user);
    });

    it('should return an error if email is not found', function() {
      const loginInfo = { email: 'nonexistent@example.com', password: 'password1' };
      const result = authenticateUser(loginInfo, users);
      assert.include(result.error, 'No account associated with that e-mail exists.');
    });

    it('should return an error if password is incorrect', () => {
      const loginInfo = { email: 'test@example.com', password: 'incorrectpassword' };
      const result = authenticateUser(loginInfo, users);
      assert.include(result.error, 'Incorrect Password.');
    });
  });

  describe('createNewUser', () => {
    it('should create a new user if email is not already registered', () => {
      const userInfo = { email: 'newuser@example.com', password: 'newpassword' };
      const result = createNewUser(userInfo, users);
      assert.isNull(result.error);
      assert.exists(result.user);
    });

    it('should return an error if email is already registered', () => {
      const userInfo = { email: 'test@example.com', password: 'newpassword' };
      const result = createNewUser(userInfo, users);
      assert.match(result.error, /This e-mail already exists/);
    });

    it('should return an error if email or password is missing', () => {
      const userInfo1 = { email: '', password: 'newpassword' };
      const result1 = createNewUser(userInfo1, users);
      assert.match(result1.error, /You must enter both an email and a password to register/);
    });
  });

  describe('addURLToDatabase', () => {
    const urlDatabase = {
      'abc123': { longURL: 'https://example.com', userId: 'user1' },
      'def456': { longURL: 'https://google.com', userId: 'user2' }
    };

    it('should add a new URL to the database', () => {
      const longURL = 'https://github.com';
      const userId = 'user2';
      const result = addURLToDatabase(longURL, userId, urlDatabase);
      assert.deepEqual(urlDatabase[result.url.id], { longURL: longURL, userId: userId });
    });
  });

  describe('urlsForUser', () => {
    const urlDatabase = {
      'abc123': { longURL: 'https://example.com', userId: 'user1' },
      'def456': { longURL: 'https://google.com', userId: 'user2' },
      'ghi789': { longURL: 'https://github.com', userId: 'user1' }
    };

    it('should return user URLs if found', () => {
      const currentUser = 'user1';
      const result = urlsForUser(currentUser, urlDatabase);
      assert.isNull(result.error);
      assert.deepEqual(result.userURLs, {
        'abc123': { longURL: 'https://example.com', userId: 'user1' },
        'ghi789': { longURL: 'https://github.com', userId: 'user1' }
      });
    });

    it('should return an error if no URLs found for the user', () => {
      const currentUser = 'user3';
      const result = urlsForUser(currentUser, urlDatabase);
      assert.include(result.error, 'No URLs found for the current user.');
      assert.isNull(result.userURLs);
    });

    it('should return an object with error as null if user has URLs', () => {
      const currentUser = 'user2';
      const result = urlsForUser(currentUser, urlDatabase);
      assert.isNull(result.error);
      assert.isObject(result.userURLs);
    });
  });
});