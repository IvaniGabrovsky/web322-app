var fs = require('fs');
const { resolve } = require('path');
var employees = []; // require("./data/employees.json");
var departments = []; //require("./data/departments.json");

var readEmployee = () => {
    return new Promise(function (resolve, reject){
        fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            if (err) reject("unable to read file");
            employees = JSON.parse(data);
            if(employees.length > 0){
                resolve(employees);
            }
            else{
                reject("no results returned");
            }
           });
    });
}

var readDepartments = () => {
    return new Promise(function (resolve, reject){
        fs.readFile('./data/departments.json', 'utf8', (err, data) => {
            if (err) reject("unable to read file");
            departments = JSON.parse(data);
            if(departments.length > 0){
                resolve(departments);
            }
            else{
                reject("no results returned");
            }
           });
    });
}

module.exports.initialize = function(){
    return new Promise((resolve, reject) => {
        readEmployee()
        .then(readDepartments)
        .then(() => resolve())
        .catch(() => reject())
    });
}

module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject) => {
        if(employees && employees.length > 0){
            resolve(employees);
        }
        else{
            reject("no results returned");
        }
    });
}

module.exports.getDepartments = function(){
    return new Promise((resolve, reject) => {
        if(departments && departments.length > 0){
            resolve(departments);
        }
        else{
            reject("no results returned");
        }
    });
}

module.exports.getManagers = function(){
    return new Promise((resolve, reject) => {
        if(employees && employees.length > 0){
            const managers = employees.filter(employee => employee.isManager);
            if(managers && managers.length > 0){
                resolve(managers);
            }
            else{
                reject("no results returned");
            }
        }
        else{
            reject("no results returned");
        }
    });
} 

module.exports.addEmployee = function(employeeData){
    return new Promise((resolve, reject) => {
        if(!employeeData.isManager){
            employeeData.isManager = false;
        }
        else{
            employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length+1;
        employees.push(employeeData);
        resolve();
    });
}

module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        if(employees && employees.length > 0){
            const fullTimeEmployees = employees.filter(employee => employee.status == status);
            if(fullTimeEmployees && fullTimeEmployees.length > 0){
                resolve(fullTimeEmployees);
            }
            else{
                reject("no results returned");
            }
        }
        else{
            reject("no results returned");
        }
    });
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        if(employees && employees.length > 0){
            const departmentsFound = employees.filter(employee => employee.department == department);
            if(departmentsFound && departmentsFound.length > 0){
                resolve(departmentsFound);
            }
            else{
                reject("no results returned");
            }
        }
        else{
            reject("no results returned");
        }
    });
}

module.exports.getEmployeesByManager = function(employeeManagerNum){
    return new Promise((resolve, reject) => {
        if(employees && employees.length > 0){
            const employeesFound = employees.filter(employee => employee.employeeManagerNum == employeeManagerNum);
            if(employeesFound && employeesFound.length > 0){
                resolve(employeesFound);
            }
            else{
                reject("no results returned");
            }
        }
        else{
            reject("no results returned");
        }
    });
}

module.exports.getEmployeeByNum = function(employeeNum){
    return new Promise((resolve, reject) => {
        if(employees && employees.length > 0){
            const employeeFound = employees.find(employee => employee.employeeNum == employeeNum);
            if(employeeFound){
                resolve(employeeFound);
            }
            else{
                reject("no results returned");
            }
        }
        else{
            reject("no results returned");
        }
    });
}

module.exports.updateEmployee = function(employeeData){
    const {employeeNum} = employeeData;
    return new Promise((resolve, reject) => {
        if(employees && employees.length > 0){
            var employeeFound = employees.find(employee => employee.employeeNum == employeeNum);
            if(employeeFound){
                employeeFound.firstName = employeeData.firstName;
                employeeFound.lastName = employeeData.lastName;
                employeeFound.email = employeeData.email;
                employeeFound.addressStreet = employeeData.addressStreet;
                employeeFound.addressCity = employeeData.addressCity;
                employeeFound.addressState = employeeData.addressState;
                employeeFound.addressPostal = employeeData.addressPostal;
                employeeFound.isManager = !!employeeData.isManager;
                employeeFound.employeeManagerNum = employeeData.employeeManagerNum;
                employeeFound.status = employeeData.status;
                employeeFound.department = employeeData.department;
                employeeFound.hireDate = employeeData.hireDate;
                resolve();
            }
            else{
                reject("no results returned");
            }
        }
        else{
            reject("no results returned");
        }
    });
}

