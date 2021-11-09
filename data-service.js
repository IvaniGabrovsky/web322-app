const Sequelize = require('sequelize');
var sequelize = new Sequelize('d19sbu7ftmk3b', 'abztbvbepbyvjs', 'e6b21d683fdf7a7560418e7e3f9edb8ffdb6155896738c005e675614cd720ebf', {
 host: 'ec2-52-200-155-213.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: { rejectUnauthorized: false }
 }
});

return new Promise((resolve, reject) => {
    readEmployee()
    .then(readDepartments)
    .then(() => resolve())
    .catch(() => reject())
});


return new Promise((resolve, reject) => {
    if(employees && employees.length > 0){
        resolve(employees);
    }
    else{
        reject("no results returned");
    }
});

return new Promise((resolve, reject) => {
    if(departments && departments.length > 0){
        resolve(departments);
    }
    else{
        reject("no results returned");
    }
});

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

