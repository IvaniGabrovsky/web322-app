/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Ivan Gabrovsky Student ID: 153658190 Date: Thu, Oct 28, 2021
*
* Online (Heroku) Link: https://git.heroku.com/rocky-sea-19016.git
*
********************************************************************************/

const { response } = require("express");
var express = require("express");
var app = express();
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
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

app.use(function(req, res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.engine('.hbs', exphbs({
    defaultLayout: 'main', 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        }, 
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.render('home');
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.render('about');
});

// setup a 'route' to listen on /employees
app.get("/employees", function(req,res){
    var status = req.query.status;
    var department = req.query.department;
    var manager = req.query.manager;
    if(status){
        dataService.getEmployeesByStatus(status)
        .then((employees) => {
            res.render("employees", {employees})
        }).catch(() => res.status(404));
    }
    else if(department){
        dataService.getEmployeesByDepartment(department)
        .then((employees) => {
            res.render("employees", {employees})
        }).catch(() => res.status(404));
    }
    else if(manager){
        dataService.getEmployeesByManager(manager)
        .then((employees) => {
            res.render("employees", {employees})
        }).catch(() => res.status(404));
    }
    else{
        dataService.getAllEmployees()
        .then((employees) => {
            res.render("employees", {employees})
        })
    }
});

// setup a 'route' to listen on /employee/value
app.get("/employee/:value", function(req,res){
    dataService.getEmployeeByNum(req.params.value)
    .then((employee) => 
        res.render("employee", {employee: employee})
    )
    .catch(() => 
        res.render("employee", {message: "no results"})
    )
});

// setup a 'route' to listen on /departments
app.get("/departments", function(req,res){
    dataService.getDepartments()
    .then((departments) =>  res.render("departments", {departments: departments}))
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
    res.render('addEmployee');
});

// setup another route to listen on /about
app.get("/images/add", function(req,res){
    res.render('addImage');
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", function(req,res){
    fs.readdir(IMAGES_PATH, function(err, items) {
        console.log(items);
        res.render("images", { items });
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

