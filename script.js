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

function getSymbol(){

    if(currency.value == "USD") return "$";
    if(currency.value == "EUR") return "€";
    return "₹";

}

salaryBtn.addEventListener("click",function(){

    let value = Number(salaryInput.value);

    if(salaryInput.value.trim() === "" || isNaN(value) || value <= 0){

        alert("Enter Valid Salary");
        salaryInput.focus();
        return;

    }

    salary = value;

    localStorage.setItem("salary",salary);

    salaryInput.value = "";

    render();

});

expenseBtn.addEventListener("click",function(){

    let name = expenseName.value.trim();

    let amount = Number(expenseAmount.value);

    if(name == ""){

        alert("Enter Expense Name");
        expenseName.focus();
        return;

    }

    if(expenseAmount.value.trim() === "" || isNaN(amount) || amount <= 0){

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

    render();

});


function renderExpenseList(){

    expenseList.innerHTML = "";

    let symbol = getSymbol();

    for(let i=0;i<expenses.length;i++){

        expenseList.innerHTML +=

        `<tr>

        <td>${expenses[i].name}</td>

        <td>${symbol}${(expenses[i].amount * rate).toFixed(2)}</td>

        <td>

        <button
        class="deleteBtn"
        onclick="deleteExpense(${i})">

        Delete

        </button>

        </td>

        </tr>`;
    }
}

function deleteExpense(index){

    let ans = confirm("Delete this expense?");

    if(ans){

        expenses.splice(index,1);

        localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
        );

        render();
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
        render();
        return;

    }

    try{

        let response = await fetch(
        "https://api.frankfurter.app/latest?from=INR&to="+selected
        );

        let data = await response.json();

        rate = data.rates[selected];

        render();

    }

    catch(error){

        alert("Unable to fetch currency.");

    }

}
function render(){

    totalExpense = 0;

    for(let i=0;i<expenses.length;i++){
        totalExpense += expenses[i].amount;
    }

    let remain = salary - totalExpense;

    let symbol = getSymbol();

    showSalary.innerHTML = symbol + (salary * rate).toFixed(2);
    showExpense.innerHTML = symbol + (totalExpense * rate).toFixed(2);
    balance.innerHTML = symbol + (remain * rate).toFixed(2);

    renderExpenseList();
    updateChart();
    checkWarning();

}

downloadBtn.addEventListener("click",downloadPDF);

function downloadPDF(){

    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();

    let y = 20;

    let symbol = getSymbol();

    doc.setFontSize(18);
    doc.text("Cash Flow Report",20,y);

    y += 15;

    doc.setFontSize(12);

    doc.text("Salary : "+symbol+(salary*rate).toFixed(2),20,y);

    y += 10;

    doc.text("Total Expense : "+symbol+(totalExpense*rate).toFixed(2),20,y);

    y += 10;

    doc.text("Remaining Balance : "+symbol+((salary-totalExpense)*rate).toFixed(2),20,y);

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
                " - "+symbol+(expenses[i].amount*rate).toFixed(2),
                20,
                y
            );
            y += 10;
        }
    }
    doc.save("CashFlow_Report.pdf");
}
render();
