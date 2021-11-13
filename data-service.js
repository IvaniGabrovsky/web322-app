const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "d19sbu7ftmk3b",
  "abztbvbepbyvjs",
  "e6b21d683fdf7a7560418e7e3f9edb8ffdb6155896738c005e675614cd720ebf",
  {
    host: "ec2-52-200-155-213.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

var Employee = sequelize.define(
  "Employee",
  {
    employeeNum: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

var Department = sequelize.define(
  "Department",
  {
    departmentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentName: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

var fs = require("fs");
const { resolve } = require("path");
var employees = []; // require("./data/employees.json");
var departments = []; //require("./data/departments.json");
var readEmployee = () => {
  return new Promise(function (resolve, reject) {
    fs.readFile("./data/employees.json", "utf8", (err, data) => {
      if (err) reject("unable to read file");
      employees = JSON.parse(data);
      if (employees.length > 0) {
        resolve(employees);
      } else {
        reject("no results returned");
      }
    });
  });
};
var readDepartments = () => {
  return new Promise(function (resolve, reject) {
    fs.readFile("./data/departments.json", "utf8", (err, data) => {
      if (err) reject("unable to read file");
      departments = JSON.parse(data);
      if (departments.length > 0) {
        resolve(departments);
      } else {
        reject("no results returned");
      }
    });
  });
};
module.exports.initialize = function () {
  try {
    sequelize.sync();
    resolve();
  } catch {
    reject("unable to sync the database");
  }
};
module.exports.getAllEmployees = function () {
  try {
    Employee.findAll();
    resolve();
  } catch{
    reject("no results returned");
  }
};
module.exports.getDepartments = function () {
  try {
    Department.findAll();
    resolve();
  } catch{
    reject("no results returned");
  }
};
module.exports.getManagers = function () {
  reject();
};
module.exports.addEmployee = function (employeeData) {
  reject();
};
module.exports.getEmployeesByStatus = function (status) {
  try{
    Employee.findAll();
    resolve();
  } catch{
    reject("no results returned");
  }
};
module.exports.getEmployeesByDepartment = function (department) {
  try{
    Employee.findAll();
    resolve();
  } catch{
    reject("no results returned");
  }
};
module.exports.getEmployeesByManager = function (employeeManagerNum) {
  try{
    Employee.findAll();
    resolve();
  } catch{
    reject("no results returned");
  }
};
module.exports.getEmployeeByNum = function (employeeNum) {
  try{
    Employee.findAll();
    resolve();
  } catch{
    reject("no results returned");
  }
};
module.exports.updateEmployee = function (employeeData) {
  reject();
};
