'use strict'

var sql = require('mssql')
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express();
var bodyParser = require('body-parser');
var winston = require('winston');

app.use(express.static(__dirname + '/static/public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function getPass() {
  winston.log('info', 'Getting Password');
  var pass = 'GoHuskies!'
  if (!pass) {
    throw new Error('Missing PASSWORD environment variable')
  }
  winston.log('info', 'Returning Password');
  return pass
}

function connectToDb() {
  var config = {
    user: 'INFO445',
    password: getPass(),
    server: 'IS-HAY04.ischool.uw.edu',
    database: 'QuietGroup_GymDB'
  }
  winston.log('info', 'Returning SQL Server Config');
  return sql.connect(config)
}

function updateCustomer(CustomerID, CustomerFName, CustomerLName, GenderID, CustomerEmail) {
  winston.log('info', 'Updating Customer Information');
  var query = "UPDATE dbo.CUSTOMER SET CustomerFName='" + CustomerFName + "', CustomerLName='"
      + CustomerLName + "', CustomerEmail'" + CustomerEmail + "GenderID='" + GenderID + "'WHERE CustomerID=" + CustomerID;
  winston.log('info', 'Current Query:');
  console.log(query);
  return new sql.Request().query(query);
}

function displayAllCustomers() {
  console.log("Displaying top 1000 Customers");
  winston.log('info', 'Displaying top 1000 Customers');
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.CUSTOMER ORDER BY CustomerID DESC');
}

function createCustomer( CustomerFName, CustomerLName, GenderID) {
  console.log("Creating Customer");
  winston.log('info', 'Creating Customer');
  winston.log('info', 'Query');
  console.log("INSERT INTO dbo.CUSTOMER(CustomerFname, CustomerLname, GenderID) VALUES('" + 
                                   CustomerFName + "','" + CustomerLName + "'," + GenderID + ")" )
    return new sql.Request().query("INSERT INTO dbo.CUSTOMER(CustomerFname, CustomerLname, GenderID) VALUES('" + 
                                   CustomerFName + "','" + CustomerLName + "'," + GenderID + ")" );
    
}

function deleteCustomer(CustomerID) {
  console.log("Deleting Customer");
  winston.log('info', 'Deleting Customer');

  var query = "DELETE FROM dbo.Customer WHERE CustomerID=" + CustomerID;
  console.log(query);
  return new sql.Request().query(query);
}

// function getCustomerObject(CustomerID) {
//     return new sql.Request().query('SELECT * FROM dbo.CUSTOMER WHERE CustomerID =' + CustomerID);
// }

//ROUTES
function makeRouter() {
  winston.log('info', 'Creating Routes');
  app.use(cors())  
  app.get('/', function (req, res) {
    res.sendFile('/index.html', { root: __dirname })
  })
  app.post('/createCustomer', function (req, res) {
      console.log("HAIHSIDHASIDHASIHD");
      // console.log(req)
      var PersonID = req.body.CustomerID;
      var PersonFname = req.body.CustomerFName;
      var PersonLname = req.body.CustomerLName;
      var GenderID = req.body.GenderID
      // var CustomerEmail = req.body.CustomerEmail;

      createCustomer(PersonFname, PersonLname, GenderID).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
      console.log("Done Creating")
  });

  app.post('/deleteCustomer', function (req, res) {
      console.log("DELETING");
      // console.log(req)
      var CustomerID = req.body.CustomerID;
  
      // var CustomerEmail = req.body.CustomerEmail;

      deleteCustomer(CustomerID).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
      console.log("Done Deleting")
  });

  app.get('/Customers/all', function (req, res) {
    displayAllCustomers().then(function (data) {
      return res.json(data);
    });
  })
}    
    connectToDb().then(() => {
      winston.log('info', 'Database Connected');
      console.log("connected");
      makeRouter();
    app.listen(process.env.PORT || 3000)
      winston.log('info', 'Listening for port 3000');

  });
