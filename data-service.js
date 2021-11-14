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
  return new Promise(function (resolve, reject) {
    sequelize.sync().then( () => {
      resolve();
    }).catch( () => {
      reject("unable to sync the database");
    })
  });
};

module.exports.getAllEmployees = function () {
  //console.log("************** data-service.js getAllEmployees************");
  return new Promise(function (resolve, reject) {
    Employee.findAll().then( (employees) => {
      //console.log(employees);
      const emps = employees.map( employee => {
        return employee.dataValues
      });
      //console.log(emps);
      resolve(emps);
    }).catch( () => {
      reject("unable to sync the database");
    })
  });
};

module.exports.getDepartments = function () {
  return new Promise(function (resolve, reject) {
    Department.findAll().then( (departments) => {
      resolve(departments);
    }).catch( () => {
      reject("no results returned");
    })
  });
};

module.exports.getManagers = function () {
  reject();
};

module.exports.addEmployee = function (employeeData) {
  employeeData.isManager = (employeeData.isManager) ? true : false;
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise(function (resolve, reject){
    Model.findAll({
      where: {
        employee: employee.status
      }
    })
    
    var statusFound = Employee.findAll().filter(employee => employee.status == status); 
    statusFound.then( () => {
      resolve();
    }).catch( () => {
      reject("no results returned");
    })
  });
};

module.exports.getEmployeesByDepartment = function (department) {
  return new Promise(function (resolve, reject){
    var departmentFound = Employee.findAll().filter(employee => employee.department == department); 
    if(departmentFound){
      resolve();
    }
    else{
      reject("no results returned");
    }  
  });
};

module.exports.getEmployeesByManager = function (employeeManagerNum) {
  return new Promise(function (resolve, reject){
    var managerNumberFound = Employee.findAll().filter(employee => employee.employeeManagerNum == employeeManagerNum); 
    if(managerNumberFound){
      resolve();
    }
    else{
      reject("no results returned");
    }  
  });
};

module.exports.getEmployeeByNum = function (employeeNum) {
  return new Promise(function (resolve, reject){
    Employee.findAll().filter( employeeNum => {
      resolve();
    }).catch( () => {
      reject("no results returned");
    })
  });
};

module.exports.updateEmployee = function (employeeData) {
  reject();
};
