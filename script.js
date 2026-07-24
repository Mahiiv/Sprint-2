let salaryInput = document.getElementById("salary");
let salaryBtn = document.getElementById("salaryBtn");

let expenseName = document.getElementById("expenseName");
let expenseAmount = document.getElementById("expenseAmount");
let expenseBtn = document.getElementById("expenseBtn");

let showSalary = document.getElementById("showSalary");
let showExpense = document.getElementById("showExpense");
let balance = document.getElementById("balance");

let expenseList = document.getElementById("expenseList");

let warning = document.getElementById("warning");

let currency = document.getElementById("currency");

let downloadBtn = document.getElementById("download");


let salary = 0;
let totalExpense = 0;
let expenses = [];
let rate = 1;
let chart;


if(localStorage.getItem("salary")){
    salary = Number(localStorage.getItem("salary"));
}

if(localStorage.getItem("expenses")){
    expenses = JSON.parse(localStorage.getItem("expenses"));
}

showSalary.innerHTML = "₹" + salary;

salaryBtn.addEventListener("click",function(){

    let value = Number(salaryInput.value);

    if(value <= 0){

        alert("Enter Valid Salary");
        salaryInput.focus();
        return;

    }

    salary = value;

    localStorage.setItem("salary",salary);

    salaryInput.value = "";

    showSalary.innerHTML = "₹" + salary;

    updateBalance();

});

expenseBtn.addEventListener("click",function(){

    let name = expenseName.value.trim();

    let amount = Number(expenseAmount.value);

    if(name == ""){

        alert("Enter Expense Name");
        expenseName.focus();
        return;

    }

    if(amount <= 0){

        alert("Enter Valid Expense Amount");
        expenseAmount.focus();
        return;

    }

    let obj = {

        name:name,
        amount:amount

    };

    expenses.push(obj);

    localStorage.setItem("expenses",JSON.stringify(expenses));

    expenseName.value = "";
    expenseAmount.value = "";

    showExpenses();

});


function showExpenses(){

    expenseList.innerHTML = "";

    totalExpense = 0;

    for(let i=0;i<expenses.length;i++){

        totalExpense += expenses[i].amount;

        expenseList.innerHTML +=

        `<tr>

        <td>${expenses[i].name}</td>

        <td>₹${expenses[i].amount}</td>

        <td>

        <button
        class="deleteBtn"
        onclick="deleteExpense(${i})">

        Delete

        </button>

        </td>

        </tr>`;

    }

    showExpense.innerHTML = "₹" + totalExpense;

    updateBalance();

}

function deleteExpense(index){

    let ans = confirm("Delete this expense?");

    if(ans){

        expenses.splice(index,1);

        localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
        );

        showExpenses();

    }

}

let ctx = document.getElementById("myChart");

chart = new Chart(ctx,{

    type:"pie",

    data:{

        labels:[
            "Expenses",
            "Remaining"
        ],

        datasets:[{

            data:[0,0],

            backgroundColor:[
                "#ff6384",
                "#36a2eb"
            ]

        }]

    },

    options:{
        responsive:true
    }

});

function updateChart(){

    let remain = salary - totalExpense;

    if(remain < 0){

        remain = 0;

    }

    chart.data.datasets[0].data = [

        totalExpense,
        remain

    ];

    chart.update();

}

function updateBalance(){

    let remain = salary - totalExpense;

    balance.innerHTML = "₹" + remain;

    updateChart();

    checkWarning();

}

function checkWarning(){

    let remain = salary - totalExpense;

    if(salary == 0){

        warning.style.display = "none";
        return;

    }

    if(remain <= salary * 0.10){

        warning.style.display = "block";
        warning.innerHTML =
        "⚠ Warning! Remaining Balance is below 10%.";

        balance.classList.add("lowBalance");

    }

    else{

        warning.style.display = "none";
        balance.classList.remove("lowBalance");

    }

}

currency.addEventListener("change",changeCurrency);

async function changeCurrency(){

    let selected = currency.value;

    if(selected == "INR"){

        rate = 1;
        displayCurrency();
        return;

    }

    try{

        let response = await fetch(
        "https://api.frankfurter.app/latest?from=INR&to="+selected
        );

        let data = await response.json();

        rate = data.rates[selected];

        displayCurrency();

    }

    catch(error){

        alert("Unable to fetch currency.");

    }

}

function displayCurrency(){

    let symbol = "₹";

    if(currency.value == "USD"){

        symbol = "$";

    }

    if(currency.value == "EUR"){

        symbol = "€";

    }

    let remain = salary - totalExpense;

    showSalary.innerHTML =
    symbol + (salary * rate).toFixed(2);

    showExpense.innerHTML =
    symbol + (totalExpense * rate).toFixed(2);

    balance.innerHTML =
    symbol + (remain * rate).toFixed(2);

}

downloadBtn.addEventListener("click",downloadPDF);

function downloadPDF(){

    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("Cash Flow Report",20,y);

    y += 15;

    doc.setFontSize(12);

    doc.text("Salary : ₹"+salary,20,y);

    y += 10;

    doc.text("Total Expense : ₹"+totalExpense,20,y);

    y += 10;

    doc.text("Remaining Balance : ₹"+(salary-totalExpense),20,y);

    y += 20;

    doc.text("Expense List",20,y);

    y += 10;

    if(expenses.length == 0){

        doc.text("No Expenses Added",20,y);

    }

    else{

        for(let i=0;i<expenses.length;i++){

            doc.text(

                (i+1)+". "+
                expenses[i].name+
                " - ₹"+
                expenses[i].amount,

                20,
                y

            );

            y += 10;

        }

    }

    doc.save("CashFlow_Report.pdf");

}

showExpenses();

displayCurrency();

checkWarning();

updateChart();