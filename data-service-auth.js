var mongoose = require("mongoose");
//const { mapFinderOptions } = require("sequelize/types/lib/utils");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  userName: String,
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
    let db = mongoose.createConnection(
      "mongodb+srv://igabrovsky:Stanford2002!@cluster0.ilpel.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );
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
      if (err && err === 11000) {
        // there was an error
        reject(`User Name already taken`);
      } else if (err && err !== 11000) {
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
        usersObj = users.map((value) => value.toObject());
        if (usersObj.length === 0) {
          reject(`Unable to find user: ${userData.userName}`);
        } else if (usersObj[0].password.trim() !== userData.password.trim()) {
          reject(`Incorrect Password for user: ${userData.userName}`);
        } else {
          // save to user history
          if (!usersObj[0].loginHistory) {
            usersObj[0].loginHistory = [];
          }
          usersObj[0].loginHistory.push({
            dateTime: new Date().toString(),
            userAgent: userData.userAgent,
          });
          User.updateOne(
            { userName: userData.userName },
            { $set: { loginHistory: usersObj[0].loginHistory } }
          )
            .exec()
            .then(() => {
              // resolve promise
              resolve(usersObj[0]);
            })
            .catch((err) => {
              reject(`There was an error verifying the user: ${err}`);
            });
        }
      })
      .catch(() => {
        reject(`Unable to find user: ${userData.userName}`);
      });
  });
};

module.exports.getUser = function (userName) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userName })
      .exec()
      .then((users) => {
        usersObj = users.map((value) => value.toObject());
        if (usersObj.length === 0) {
          reject(`Unable to find user: ${userName}`);
        } else {
          resolve(usersObj[0]);
        }
      })
      .catch(() => {
        reject(`Unable to find user: ${userName}`);
      });
  });
};
