var express = require('express');
var GoogleSpreadsheet = require('google-spreadsheet');

var creds_json = {
  client_email: 'expense-tracker-acc@expense-tracker-225214.iam.gserviceaccount.com',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjHyHAbhHh42qF\neyNHcII/+3AWee7q5Dr0VNAyZgD5zLjc5mlL/8X8wP3NpLlS/34/Edz4om74cJjM\nD4pvgfYe6EXeaRX3/RI3DQnK4ob5JtWuLPWh6vTLNZW7cJisEixsi8L+sFlC/Nav\ncvYRUWAL6uat1M6dxwAkZvefJRkbq7II2nhvvFHue/Ou9cEyCvx5ZHEsOwVC1IKM\n2lC7/DgdlNrz6WlfgB/GFbZFG8Fc6B62t2Fa0cZNuUU6T63p/1u7ihJjk7lJj6VU\n1MXE+jBLt0Yv2zvyH01evaxT7hgOPjguzCkNmLD9zHQerHh7dJ/BBmqGxYXZfTqX\nY9ihEen1AgMBAAECggEAEMsUs3Xhe2rpPYK22BT6I9Ij8Pxun1oNw7ezk2yy7wSn\nh35lGsDjRiksN+6ccbIB8kZJhINcf1FAOcnjy6UKjJYHE2WoMFaqeGZsOqnlkWLx\nHrRcOWYx+3Wxy5FE9noMfsRIt+W52s6i338rXA8Pn0p4oy7EcrPZDOZY2dZ85j81\nsJbPKyYB0QaHMKZEI29WrFTtoBMWCLBigB4mKLyzqgpWzzLzUVGDgVukiFRlU4VS\nlfNMVlaOVAFRJrFW1wXxcNKYn63LigsKnoA79rUkMZFuPu7aCahYRN6Vn1X80Sz0\nP4SZ+NIWy8vEfCfSAwLn8tOj+d28c5kwB+CoBwpF4QKBgQDbA+pUqAzttrBctRT8\n/9uxpUoFu/nT7ajdcSaEEAjNnKpl6+cGBMhhyyVBlKK/rqcfoPkHh81eO4Cc1a10\npV05LjC1/EfT91AnHAirvGhzkKrcr8FrJ8LPIetcwBzBQnLuczhbHHpWDrbS+oUb\nNO+e+zUO6IJaTG0lN1ErDsc8mQKBgQC+qus3ZeZfNVDf5ThFQDSZpfEjuf0LGEtb\nocR725y9TfVj78XjP9Kcv0mgIogLgtKd5zExWmaw5mkuQUCdWPDi+Ar0Ry5Uf/Jx\nrh83erJ8UJhj3v33eQkPSOSUouVUP2oZt5ldC8pAJpLKxHNRyQIGqfu/Wb+l+s6b\num02jnK1vQKBgQDMtXQpfInZBpEBlh/v+hYWjTAK/BAfDlxv3nrppTMVPAHpEf31\nmjLRdVd1XMBh+ZUr8wHREBXcpjEoZnCiPo5MC+hrsUpRzS+V3pYcLxZSLj4F2CEp\nTxi/Ei0znD1ERh+20Osz/gI6vbYUrSQMsgXmy1ZkgN6WGClMR9AONtnywQKBgCyh\nu8/K9aNByr2uXX6wad+xnYHcbqRjOninpGPN46HYluGe5fatIPL6QBTRIIF5TS4T\nSUuhOrqcJPDj62kpwbGPmJjX9Lto++qqdLo66X76KsHuGAsO9RTz3jYA76fJ9F8y\nwB6svNpJbUEzvT7ey6+dqMWBD8CdtjFz8U69B5MNAoGAGoZbun5J+O12HeeetQfO\nUUg4kk15Zxs+aCSzQYeMd/2QYYGFEsr0BJuk2MHd8po5+fktIThemqiUnPKsdAwn\n0R0StL6aW3mzACrpIUWHIn5Tko39ns75DTgt0QN1h5HcNstgx7xpT3KQ7AP4j+NK\ntEng74KtKu/Fa6jMh/2miLY=\n-----END PRIVATE KEY-----\n'
}

var router = express.Router();
var doc = new GoogleSpreadsheet('1OsNhMkJAiTZHORppfbMVVLPxGwMZ9wyD78ls5s4OXRU');
var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var categories = ["Food", "Home Supplies", "Groceries", "Eating out", "Misc"];



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addExpense', function(req, res, next) {
  doc.useServiceAccountAuth(creds_json, function (err) {
    if (err) console.log(err);
    doc.getInfo(function(err, info) {
      for (let i = 0; i< info.worksheets.length; i++) {
        var sheet = info.worksheets[i];
        
        var month = new Date().getMonth();
        month = months[month];

        if (sheet.title === month){
          // console.log(month);
          // console.log(sheet.title);
          break;
        }
      }

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
          "Manasa":req.query.amt_manasa
        }
      
        sheet.addRow(row, function(err, row){
          if(err) console.log(err);
          res.send("Success!");
        });
      });
    });
  });
});


module.exports = router;
