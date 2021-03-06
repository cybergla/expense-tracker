var express = require('express');
var GoogleSpreadsheet = require('google-spreadsheet');

var creds_json = {
  "client_email": process.env.CLIENT_EMAIL,
  "private_key": process.env.PRIVATE_KEY
}

var router = express.Router();
var doc = new GoogleSpreadsheet('1OsNhMkJAiTZHORppfbMVVLPxGwMZ9wyD78ls5s4OXRU');
var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var categories = ["Food", "Home Supplies", "Groceries", "Eating out", "Transport", "Entertainment", "Misc"];



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addExpense', function(req, res, next) {
  doc.useServiceAccountAuth(creds_json, function (err) {
    if (err) {
      console.log(err);
      res.send('Error');
      return;
    }

    doc.getInfo(function(err, info) {
      for (let i = 0; i< info.worksheets.length; i++) {
        var sheet = info.worksheets[i];
        
        var month = new Date().getMonth();
        month = months[month];

        if (sheet.title === month){
          sheet.getRows({'limit':3}, function (err, rows) {
            //var date = new Date(Date.now()).toLocaleDateString('en-US');
            console.log(req.query);
            var parts = req.query.date.split('-');
            var date = new Date(parts[0], parts[1] - 1, parts[2]);
            date = date.toLocaleDateString('en-US');
            var row = {
              "Date":date,
              "Category":categories[parseInt(req.query.expense_category)],
              "Name":req.query.expense_name,
              "Tanay":req.query.amt_tanay,
              "Manasa":req.query.amt_manasa,
              "Amount":parseFloat(req.query.amt_tanay)+parseFloat(req.query.amt_manasa)
            }
          
            sheet.addRow(row, function(err, row){
              if(err) {
                console.log(err);
                
              }
              res.send("Success!");
            });
          });
          return;
        }
      }

      // Sheet not found
      res.send("Error: Sheet not found")
      
    });
  });
});

router.get('/getBalance', function(req, res, next) {
  // Log into Google Sheets
  doc.useServiceAccountAuth(creds_json, function (err) {
    if (err) {
      console.log(err);
      res.send('Error');
      return;
    }

    // Get worksheet info
    doc.getInfo(function(err, info) {

      // Find Sheet with current month's name
      for (let i = 0; i< info.worksheets.length; i++) {
        var sheet = info.worksheets[i];
        
        var month = new Date().getMonth();
        month = months[month];
        
        // Found sheet
        if (sheet.title === month){
          // Get week num and rows to access
          var date = new Date().getDate();
          var week_num = getWeek(date);
          var rows = week_to_row[week_num];

          // Get cells with balance
          sheet.getCells({
              'min-row':rows[0],
              'max-row':rows[1],
              'min-col':12,
              'max-col':12
            }, function (err, cells) {
              res.send({
                "tanay":cells[0].value,
                "manasa":cells[1].value
              });
          });
          return;
        }
      }

      // If not found
      res.send({
        "tanay":"N/A",
        "manasa":"N/A"
      });

    });
  });
});

router.get('/test', function(req, res, next) {
  console.log(req.query);
  res.send("Success");
});


function getWeek(date) {
  if (date <= 7){
    return 1;
  }
  else if (date > 7 && date <= 14){
    return 2;
  }
  else if (date > 14 && date <= 21){
    return 3;
  }
  else if (date > 21 && date <= 31){
    return 4;
  }
}

week_to_row = {
  1: [10,11],
  2: [15,16],
  3: [20,21],
  4: [25,26]
}

module.exports = router;
