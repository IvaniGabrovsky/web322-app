var fs = require('fs');
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
    fs.readFile('somefile.json', 'utf8', (err, data) => {
        if (err) throw err;
        console.log(data);
    });
    const objOfEmployees = JSON.parse(employees);
    app.get("./data/departments.json", function(req,res){
        res.send("Hello World<br /><a href='/about'>Go to the about page</a>");
    });
    
}

module.exports.getEmployees = function(){
    return employees;
}

module.exports.getDepartments = function(){
    return departments;
}

module.exports.getManagers = function(){
    return employees.filter(employee => {
        return employee.isManager;
    });
} 
