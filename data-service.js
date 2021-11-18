const Sequelize = require("sequelize");

/***********************************************/
// Connection to Database
/***********************************************/
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

/***********************************************/
// Initilize
/***********************************************/
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      resolve();
    }).catch(() => {
      reject("unable to sync the database");
    })
  });
};

/***********************************************/
// Department Model
/***********************************************/
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

/***********************************************/
// Employee Model
/***********************************************/
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
    hireDate: Sequelize.STRING // ,
    // departmentId: Sequelize.INTEGER
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

//Department.hasMany(Employee, { foreignKey: 'departmentId' })
Department.hasMany(Employee, { foreignKey: 'DepartmentDepartmentId' })
Employee.belongsTo(Department);

/***********************************************/
// Employee Functions
/***********************************************/
module.exports.getAllEmployees = function () {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      include: [{
        model: Department,
        required: true
      }]
    }).then((employees) => {
      const emps = employees.map(employee => {
        return employee.dataValues
      });
      resolve(emps);
    }).catch(() => {
      reject("unable to sync the database");
    })
  });
};

module.exports.addEmployee = function (employeeData) {
  return new Promise(function (resolve, reject) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for (const key in employeeData) {
      if (employeeData[key] === "") {
        employeeData[key] = null;
      }
    }
    Employee.create({ ...employeeData })
      .then((result) => {
        resolve(result);
      }).catch((e) => {
        console.error(e);
        reject("unable to create employee");
      });
  });
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        status: status
      },
      include: [{
        model: Department,
        required: true
      }]
    }).then((employees) => {
      const e = employees.map(employee => {
        return employee.dataValues
      });
      resolve(e);
    }).catch((err) => {
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
      },
      include: [{
        model: Department,
        required: true
      }]
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

module.exports.getEmployeesByManager = function (employeeManagerNum) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        employeeManagerNum: employeeManagerNum
      },
      include: [{
        model: Department,
        required: true
      }]
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
      ...employeeData
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

module.exports.deleteEmployeeByNum = function (id) {
  return new Promise(function (resolve, reject) {
    Employee.destroy({
      where: {
        employeeNum: id
      }
    }).then(() => {
      resolve("destroyed");
    }).catch((e) => {
      reject("was rejected");
    })
  });
};

/***********************************************/
// Department Functions
/***********************************************/
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

module.exports.addDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    for (const key in departmentData) {
      if (departmentData[key] === "") {
        departmentData[key] = null;
      }
    }
    Department.create({ ...departmentData })
      .then((result) => {
        resolve(result);
      }).catch((e) => {
        console.log(e);
        reject("unable to create department");
      });
  });
};

module.exports.updateDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    for (const key in departmentData) {
      if (departmentData[key] === "") {
        departmentData[key] = null;
      }
    }
    Department.update({
      ...departmentData
    }, {
      where: { departmentId: departmentData.departmentId }
    })
      .then((result) => {
        resolve(result);
      }).catch((e) => {
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
