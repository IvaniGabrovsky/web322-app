var express = require("express");
var path = require("path");
var dataForService = require("./data-service.js");
var app = express();

var HTTP_PORT = process.env.PORT || 8081;

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
    dataForService.getAllEmployees().then((data) => {
        res.json(data);
    })
});

// setup a 'route' to listen on /managers
app.get("/employees", function(req,res){
    dataForService.getManagers().then((data) => {
        res.json(data);
    })
});

// setup a 'route' to listen on /departments
app.get("/departments", function(req,res){
    dataForService.getDepartments().then((data) => {
        res.json(data);
    })
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);