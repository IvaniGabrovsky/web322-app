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
    sequelize.sync().then(() => {
      resolve();
    }).catch(() => {
      reject("unable to sync the database");
    })
  });
};

module.exports.getAllEmployees = function () {
  return new Promise(function (resolve, reject) {
    Employee.findAll().then((employees) => {
      const emps = employees.map(employee => {
        return employee.dataValues
      });
      resolve(emps);
    }).catch(() => {
      reject("unable to sync the database");
    })
  });
};

module.exports.getDepartments = function () {
  return new Promise(function (resolve, reject) {
    Department.findAll().then((departments) => {
      const departs = departments.map(department => {
        return department.dataValues
      });
      resolve(departs);
    }).catch(() => {
      reject("no results returned");
    })
  });
};

module.exports.getManagers = function () {
  reject();
};

module.exports.addEmployee = function (employeeData) {
  return new Promise(function (resolve, reject) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (const key in employeeData) {
      if (employeeData[key] === "") {
        employeeData[key] = null;
      }
    }
    Employee.create()
      .then((result) => {
        resolve(result);
      }).catch(() => {
        reject("unable to create employee");
      });
  });
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        status: status
      }
    }).then((employees) => {
      const e = employees.map(employee => {
        return employee.dataValues
      });
      resolve(e);
    }).catch(() => {
      reject("no results returned");
    })
  });
};

module.exports.getEmployeesByDepartment = function (department) {
  //TODO:
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        DepartmentDepartmentId: department
      }
    }).then((employees) => {
      console.log("*******employee: ", employees);
      const e = employees.map(employee => {
        return employee.dataValues
      });
      resolve(e);
    }).catch(() => {
      reject("no results returned");
    })
  });
};

module.exports.getEmployeesByManager = function (employeeManagerNum) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        employeeManagerNum: employeeManagerNum
      }
    }).then((employees) => {
      const e = employees.map(employee => {
        return employee.dataValues
      });
      resolve(e);
    }).catch(() => {
      reject("no results returned");
    })
  });
};

module.exports.getEmployeeByNum = function (employeeNum) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        employeeNum: employeeNum
      }
    }).then((employees) => {
      const e = employees.map(employee => {
        return employee.dataValues
      });
      resolve(e);
    }).catch(() => {
      reject("no results returned");
    })
  });
};

module.exports.updateEmployee = function (employeeData) {
  return new Promise(function (resolve, reject) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (const key in employeeData) {
      if (employeeData[key] === "") {
        employeeData[key] = null;
      }
    }
    Employee.update({
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      SSN: employeeData.SSN,
      addressStreet: employeeData.addressStreet,
      addressCity: employeeData.addressCity,
      addressState: employeeData.addressState,
      addressPostal: employeeData.addressPostal,
      maritalStatus: employeeData.maritalStatus,
      isManager: employeeData.maritalStatus,
      employeeManagerNum: employeeData.employeeManagerNum,
      status: employeeData.department,
      hireDate: employeeData.hireDate,
    }, {
      where: { employeeNum: employeeData.employeeNum }
    })
      .then((result) => {
        resolve(result);
      }).catch(() => {
        reject("unable to update employee");
      });
  });
};

module.exports.addDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    departmentData = (departmentData) ? true : false;
    for (const key in departmentData) {
      if (departmentData[key] === "") {
        departmentData[key] = null;
      }
    }
    Department.create()
      .then((result) => {
        resolve(result);
      }).catch(() => {
        reject("unable to create department");
      });
  });
};

module.exports.updateDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    departmentData = (departmentData) ? true : false;
    for (const key in departmentData) {
      if (departmentData[key] === "") {
        departmentData[key] = null;
      }
    }
    Department.update({
      departmentId: departments.departmentId,
      departmentName: departments.departmentName,
    })
      .then((result) => {
        resolve(result);
      }).catch(() => {
        reject("unable to update department");
      });
  });
};

module.exports.getDepartmentById = function (id) {
  return new Promise(function (resolve, reject) {
    Department.findAll({
      where: {
        departmentId: id
      }
    }).then((departments) => {
      const e = departments.map(department => {
        return department.dataValues
      });
      resolve(e);
    }).catch(() => {
      reject("no results returned");
    })
  });
};

module.exports.deleteDepartmentById = function (id) {
  return new Promise(function (resolve, reject) {
    Department.destroy({
      where: {
        departmentId: id
      }
    }).then(() => {
      resolve("destroyed");
    }).catch((e) => {
      reject("was rejected");
    })
  });
};






