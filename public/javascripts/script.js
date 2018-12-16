Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
document.getElementById('date').value = new Date().toDateInputValue();

function getBalance() {
    var tanay_bal = document.getElementById('amt_tanay');
    var manasa_bal = document.getElementById('amt_manasa');
    tanay_bal.innerHTML = "";
    manasa_bal.innerHTML = "";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/getBalance");
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
            var balances = JSON.parse(xhr.responseText);
            var tb = parseFloat(balances.tanay.replace("$",""));
            var mb = parseFloat(balances.manasa.replace("$",""));
             
            tanay_bal.innerHTML = balances.tanay;
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
}

getBalance();
var success_box = "<div id=\"success\" class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">    <strong>Success!</strong> Your expense has been added to the sheet.    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" >        <span >&times;</span>    </button></div>";

$("#form1").submit(function (event) {
    $(".alert").alert('close');
    $("#submit").prop('disabled', true);
    $("#submit").html("<i class=\"fa fa-circle-o-notch fa-spin\"</i>");
    $("#amt_tanay, #amt_manasa").html("");

    var params = $("#form1").serialize();
    $.get("/addExpense",params, function (data) {
        console.log(data);
        getBalance();
        $("#submit").prop('disabled', false);
        $("#submit").html("Submit");
        $("#success_placeholder").html(success_box);
    })
    event.preventDefault();
});