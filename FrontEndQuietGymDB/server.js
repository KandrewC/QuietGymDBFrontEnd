'use strict'

var sql = require('mssql')
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/static/public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function getPass() {
  var pass = 'GoHuskies!'
  if (!pass) {
    throw new Error('Missing PASSWORD environment variable')
  }
  return pass
}

function connectToDb() {
  var config = {
    user: 'INFO445',
    password: getPass(),
    server: 'IS-HAY04.ischool.uw.edu',
    database: 'QuietGroup_GymDB'
  }
  return sql.connect(config)
}

function updateCustomer(CustomerID, CustomerFName, CustomerLName, CustomerDOB, CustomerEmail) {
  console.log("Updating Customer");
  var query = "UPDATE dbo.CUSTOMER SET CustomerFName='" + CustomerFName + "', CustomerLName='"
      + CustomerLName + "', CustomerEmail'" + CustomerEmail + "CustomerDOB='" + CustomerDOB + "'WHERE CustomerID=" + CustomerID;
  console.log(query);
  return new sql.Request().query(query);
}

function displayAllCustomers() {
  console.log("displaying top 1000 Customers");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.CUSTOMER ORDER BY CustomerID DESC');
}

function createCustomer( CustomerFName, CustomerLName, CustomerDOB, CustomerEmail) {
  console.log("Creating Customer");
    return new sql.Request().query('SELECT TOP 5 * FROM dbo.CUSTOMER');
    
  // return new sql.Request()
  //   .input('CustomerFName', sql.VarChar(30), CustomerFName)
  //   .input('CustomerLName', sql.VarChar(30), CustomerLName)
  //   .input('CustomerDOB', sql.Date(), CustomerDOB)
  //   .input('CustomerEmail', sql.VarChar(100), CustomerEmail)
  //   .execute('dbo.uspNewPerson')
}

function deleteCustomer(CustomerID) {
  console.log("Deleting Customer");
  var query = "DELETE FROM dbo.Customer WHERE CustomerID=" + CustomerID;
  console.log(query);
  return new sql.Request().query(query);
}

function getCustomerObject(CustomerID) {
    return new sql.Request().query('SELECT * FROM dbo.CUSTOMER WHERE CustomerID =' + CustomerID);
}

//ROUTES
function makeRouter() {
  app.use(cors())  
  app.get('/', function (req, res) {
    res.sendFile('/index.html', { root: __dirname })
  })
  app.post('/createCustomer', function (req, res) {
      console.log("HAIHSIDHASIDHASIHD");
      console.log(req)
      var PersonID = req.body.PersonID;
      var PersonFname = req.body.PersonFname;
      var PersonLname = req.body.PersonLname;
      var PersonDOB = req.body.PersonDOB;

      createCustomer(PersonFname, PersonLname, PersonDOB).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
  });

  app.get('/Customers/all', function (req, res) {
    displayAllCustomers().then(function (data) {
      return res.json(data);
    });
  })
}    
    connectToDb().then(() => {
      console.log("connected");
    makeRouter();
    app.listen(process.env.PORT || 3000)
  });
