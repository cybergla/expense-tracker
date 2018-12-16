Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
document.getElementById('date').value = new Date().toDateInputValue();

var xhr = new XMLHttpRequest();
xhr.open("GET", "/getBalance");
xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
        var balances = JSON.parse(xhr.responseText);
        var tb = parseFloat(balances.tanay.slice(1));
        var mb = parseFloat(balances.manasa.slice(1));
        
        var tanay_bal = document.getElementById('amt_tanay');
        tanay_bal.innerHTML = balances.tanay;
        var manasa_bal = document.getElementById('amt_manasa');
        manasa_bal.innerHTML = balances.manasa;

        if (tb > 0 ){
            tanay_bal.classList.add("green");
        }
        else {
            tanay_bal.classList.add("red");
        }
        if (mb > 0 ){
            manasa_bal.classList.add("green");
        }
        else {
            manasa_bal.classList.add("red");
        }
        console.log(balances);
    }
}
xhr.send();


$("#form1").submit(function (event) {
    var params = $("#form1").serialize();
    $.get("/addExpense",params, function (data) {
        console.log(data);
    })
    event.preventDefault();
});