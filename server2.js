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

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });