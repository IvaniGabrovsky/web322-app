/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Ivan Gabrovsky Student ID: 153658190 Date: Tue, Oct 12, 2021
*
* Online (Heroku) Link: https://git.heroku.com/rocky-sea-19016.git
*
********************************************************************************/

const { response } = require("express");
var express = require("express");
var app = express();
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var dataService = require("./data-service.js");
app.locals.title = "Assignment 3";

var HTTP_PORT = process.env.PORT || 8080;
var IMAGES_PATH = "./public/images/uploaded";

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

// setup a 'route' to listen on /employees
app.get("/employees", function(req,res){
    var status = req.query.status;
    var department = req.query.department;
    var manager = req.query.manager;
    if(status){
        dataService.getEmployeesByStatus(status)
        .then((employees) => {
            res.json(employees);
        }).catch(() => res.status(404));
    }
    else if(department){
        dataService.getEmployeesByDepartment(department)
        .then((employees) => {
            res.json(employees);
        }).catch(() => res.status(404));
    }
    else if(manager){
        dataService.getEmployeesByManager(manager)
        .then((employees) => {
            res.json(employees);
        }).catch(() => res.status(404));
    }
    else{
        dataService.getAllEmployees()
        .then((employees) => {
            res.json(employees)
        })
    }
});

// setup a 'route' to listen on /managers
app.get("/managers", function(req,res){
    dataService.getManagers()
    .then((managers) => res.json(managers))
    .catch(() => res.status(404))
});

// setup a 'route' to listen on /employee/value
app.get("/employee/:value", function(req,res){
    dataService.getEmployeeByNum(req.params.value)
    .then((employee) => res.json(employee))
    .catch(() => res.status(404).send("Not Found"))
});

// setup a 'route' to listen on /departments
app.get("/departments", function(req,res){
    dataService.getDepartments()
    .then((departments) => res.json(departments))
    .catch(() => res.status(404))
});

// setup http server to listen on HTTP_PORT
dataService.initialize()
.then(() => {
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((err) => {
    console.error(err);
});

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: IMAGES_PATH,
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
        }
  });
  
  // tell multer to use the diskStorage function for naming files instead of the default.
  const upload = multer({ storage: storage });

// setup another route to listen on /about
app.get("/employees/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

// setup another route to listen on /about
app.get("/images/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", function(req,res){
    fs.readdir(IMAGES_PATH, function(err, items) {
        console.log(items);
        res.json(items);
    });
});

app.use(express.urlencoded({ extended: true }));

app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    })
    .catch((err) => {
        console.error(err);
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
})

