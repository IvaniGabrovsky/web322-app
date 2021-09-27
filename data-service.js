
var employees = require("./data/employees.json");
var departments = require("./data/departments.json");

function initialize(){
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

return new Promise(function(resolve, reject){ // place our code inside a "Promise" function
    setTimeout(function(){
        console.log("-");
        reject("outputA rejected!"); // call "reject" because the function encountered an error
    },randomTime);
});   
