var mongoose = require("mongoose");
const { mapFinderOptions } = require("sequelize/types/lib/utils");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  userName: {
    type: Sequelize.String,
    primaryKey: true,
  },
  password: String,
  email: String,
  loginHistory: {
    dateTime: Date,
    userAgent: String,
  },
  country: String,
});

let User; // to be defined on new connection (see initialize)

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection("connectionString");
    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password !== userData.password2) {
      reject(`Passwords do not match`);
    }
    let newUser = new User(userData);
    newUser.save((err) => {
      if (err === 11000) {
        // there was an error
        reject(`User Name already taken`);
      } else if (err !== 11000) {
        // there was an error
        reject(`There was an error creating the user: ${err}`);
      } else if (!err) {
        resolve(userData);
      }
    });
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName })
      .exec()
      .then((users) => {
        if (!users || users.lenght() === 0) {
          reject(`Unable to find user: ${userData.userName}`);
        } else if (users || users[0].password !== userData.password) {
          reject(`Incorrect Password for user: ${userData.userName}`);
        } else {
          // save to user history
          users[0].loginHistory.push({
            dateTime: new Date().toString(),
            userAgent: userData.userAgent,
          });
          User.updateOne(
            { userName: userData.userName },
            { $set: { loginHistory: users[0].loginHistory } }
          )
            .exec()
            .then(() => {
              // resolve promise
              resolve(users[0]);
            })
            .catch((err) => {
              reject(`There was an error verifying the user: ${err}`);
            });
        }
      })
      .catch((err) => {
        reject(`Unable to find user: ${userData.userName}`);
      });
  });
};
