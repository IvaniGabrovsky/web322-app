/*********************************************************************************
 * WEB322 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Ivan Gabrovsky Student ID: 153658190 Date: Thu, Nov 11, 2021
 *
 * Online (Heroku) Link: https://git.heroku.com/rocky-sea-19016.git
 *
 ********************************************************************************/

const { response } = require("express");
var express = require("express");
var app = express();
const exphbs = require("express-handlebars");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var dataService = require("./data-service.js");


const HTTP_PORT = process.env.PORT || 8080;
const IMAGES_PATH = "./public/images/uploaded";
const NO_RESULTS = { message: "no results" };

app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.locals.title = "Assignment 5";

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//**************************************************************************************/
// Middleware Configuration
//**************************************************************************************/
app.use(express.static("public"));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.use(express.urlencoded({ extended: true }));

//**************************************************************************************/
// Handlebar Configuration
//**************************************************************************************/
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

//**************************************************************************************/
// Database and multer Configuration
//**************************************************************************************/
dataService
  .initialize()
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
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

//**************************************************************************************/
// Main and about
//**************************************************************************************/
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.render("home");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  res.render("about");
});

//**************************************************************************************/
// Employees
//**************************************************************************************/
// setup a 'route' to listen on /employees
app.get("/employees", function (req, res) {
  var status = req.query.status;
  var department = req.query.department;
  var manager = req.query.manager;
  if (status) {
    dataService
      .getEmployeesByStatus(status)
      .then((employees) => {
        if (data.length > 0) {
          res.render("employees", { employees });
        }
        else {
          res.render("employees", { message: "no results" });
        }
      })
      .catch(() => {
        res.render("employees", NO_RESULTS);
      });
  } else if (department) {
    dataService
      .getEmployeesByDepartment(department)
      .then((employees) => {
        if (data.length > 0) {
          res.render("employees", { employees });
        }
        else {
          res.render("employees", { message: "no results" });
        }
      })
      .catch(() => {
        res.render("employees", NO_RESULTS);
      });
  } else if (manager) {
    dataService
      .getEmployeesByManager(manager)
      .then((employees) => {
        if (data.length > 0) {
          res.render("employees", { employees });
        }
        else {
          res.render("employees", { message: "no results" });
        }
      })
      .catch(() => {
        res.render("employees", NO_RESULTS);
      });
  } else {
    dataService.getAllEmployees()
      .then((employees) => {
        if (employees.length > 0) {
          // employees.forEach((employee) => console.log(employee))
          res.render("employees", { employees });
        }
        else {
          res.render("employees", { message: "no results" });
        }
      })
      .catch(() => {
        res.render("employees", NO_RESULTS);
      });
  }
});




app.get("/employee/:empNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  dataService.getEmployeeByNum(req.params.empNum).then((data) => {
    if (data && data.length > 0) {
      viewData.employee = data[0]; //store employee data in the "viewData" object as "employee"
    } else {
      viewData.employee = null; // set employee to null if none were returned
    }
  }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error
  }).then(dataService.getDepartments)
    .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"
      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object
      for (let i = 0; i < viewData.departments.length; i++) {
        console.log(viewData.departments[i].departmentId, ' = ', viewData.employee.DepartmentDepartmentId)
        if (viewData.departments[i].departmentId == viewData.employee.DepartmentDepartmentId) {
          viewData.departments[i].selected = true;
        }
      }
    }).catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
      if (viewData.employee == null) { // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        console.log('********************* Employee viewData: ', viewData)
        res.render("employee", { viewData }); // render the "employee" view
      }
    });
});

app.post("/employee/update", (req, res) => {
  dataService
    .updateEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      console.error(err);
    });
});


// setup another route to listen to employees/add
app.get("/employees/add", function (req, res) {
  dataService
    .getDepartments()
    .then((departments) => {
      if (departments.length > 0) {
        res.render("addEmployee", { departments: departments })
      }
      else {
        res.render("addEmployee", { message: "no results" });
      }
    })
    .catch(() => res.status(404));
});

app.post("/employees/add", (req, res) => {
  dataService
    .addEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/employees/delete/:empNum", function (req, res) {
  dataService.deleteEmployeeByNum(req.params.empNum)
    .then(() => {
      res.redirect("/employees");
    })
    .catch(() => {
      res.status(500).send("Employee not found!");
    });
});

//**************************************************************************************/
// Departments
//**************************************************************************************/
// setup a 'route' to listen on /departments
app.get("/departments", function (req, res) {
  dataService
    .getDepartments()
    .then((departments) => {
      if (departments.length > 0) {
        res.render("departments", { departments: departments })
      }
      else {
        res.render("departments", { message: "no results" });
      }
    })
    .catch(() => res.status(404));
});

// setup another route to listen on /about
app.get("/departments/add", function (req, res) {
  res.render("addDepartment");
});

app.post("/departments/add", (req, res) => {
  dataService
    .addDepartment(req.body)
    .then(() => {
      res.redirect("/departments");
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/department/update", (req, res) => {
  res.render("department");
});

app.post("/department/update", (req, res) => {
  dataService
    .updateDepartment(req.body)
    .then(() => {
      res.redirect("/departments");
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/department/:departmentId", function (req, res) {
  dataService
    .getDepartmentById(req.params.departmentId)
    .then((department) => {
      res.render("department", { department: department[0] })
    })
    .catch(() => res.status(404).send("Department Not Found"));
});

app.get("/departments/delete/:departmentId", function (req, res) {
  dataService.deleteDepartmentById(req.params.departmentId)
    .then(() => {
      res.redirect("/departments");
    })
    .catch(() => {
      res.status(500).send("Department not found!");
    });
});

//**************************************************************************************/
// Images
//**************************************************************************************/
// setup another route to listen on /about
app.get("/images/add", function (req, res) {
  res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.get("/images", function (req, res) {
  fs.readdir(IMAGES_PATH, function (err, items) {
    res.render("images", { items });
  });
});

//**************************************************************************************/
// Error
//**************************************************************************************/
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});
