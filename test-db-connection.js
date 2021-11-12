const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('d19sbu7ftmk3b', 'abztbvbepbyvjs', 'e6b21d683fdf7a7560418e7e3f9edb8ffdb6155896738c005e675614cd720ebf', {
    host: 'ec2-52-200-155-213.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Define a "Project" model

var Project = sequelize.define('Project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});

// synchronize the Database with our models and automatically add the 
// table if it does not exist

sequelize.sync().then(function () {

    // create a new "Project" and add it to the database
    Project.create({
        title: 'Project1',
        description: 'First Project'
    }).then(function (project) {
        // you can now access the newly created Project via the variable project
        console.log("success!")
    }).catch(function (error) {
        console.log("something went wrong!");
    });
});