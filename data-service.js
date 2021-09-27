
var employees = [];
var departments = [];

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

function getEmployees(){

}
