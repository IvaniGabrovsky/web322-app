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
