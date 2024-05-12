/* 1 .make the Income and the Expense in the same line
2. make the page responsive to mobile
3. add line to the end of the income and expenses lists
4. fix the budget + -
5. make last finish of the colors and font weights
  */


let currentBudget = Number(localStorage.getItem("budget")) || 0;//load from the local storage budget, income and expenses 
let currentIncome = Number(localStorage.getItem("income")) || 0;//and if not exist load the variable to 0.
let currentExpenses = Number(localStorage.getItem("expenses")) || 0;
let totalIncomes = JSON.parse(localStorage.getItem("total-incomes")) || [];
let totalExspenses = JSON.parse(localStorage.getItem("total-expenses")) || [];
let incomeActionsCounter = 0;
let expensesActionsCounter = 0;

let removeActionButton = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>`
//


const elemTotalIncome = document.querySelector('.total-income');
const elemTotalExpenses = document.querySelector('.total-expenses');
// Inputs and buttons elems 
const elemActionSelector = document.querySelector('.type-of-action-input');
const elemActionDescriptionInput = document.querySelector('.description-of-action-input');
elemActionDescriptionInput.addEventListener('keypress', function (event) { //When clicking enter the submit will be execute
    event.key === 'Enter' ? submitActionChanges() : undefined
})
const elemValueOfAction = document.querySelector('.value-of-action-input');
elemValueOfAction.addEventListener('keypress', function (event) { //When clicking enter the submit will be execute
    event.key === 'Enter' ? submitActionChanges() : undefined
})
const elemSubmitActionButton = document.querySelector('.submit-action-button');
// Content on page elems
const elemCurrentBudget = document.querySelector('.current-budget h1');
const elemTotalExpensesPercentage = document.querySelector('.total-expenses-percentage')

reloadPage();

function totalExpensesPercentageCalc() {
    if (currentIncome <= 0 || currentExpenses <= 0) {
        return "---"
    }
    else {
    let percentage = (currentExpenses / currentIncome) * 100
    return `${percentage.toFixed(2)}%`}
  }

function percentageCalculator(num) {
    if (currentIncome <= 0) {
        return "---"
    }
    else {
    let percentage = (num / currentIncome) * 100
    return `${percentage.toFixed(2)}%`}
}

function printExpensesPercentages() {

}
  

function reloadPage() {
    printTodayDate();
    printCurrentLocalDetailsOnReload();
}

function printTodayDate() {
    const ElemCurrentTime = document.querySelector("#current-time-heading");
    let todayDate = new Date();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];
    let todayYear = todayDate.getFullYear();
    let monthIndex = todayDate.getMonth();
    let todayMonth = monthNames[monthIndex];
    ElemCurrentTime.innerHTML = `Available Budget in ${todayMonth} ${todayYear}`;
}

function formatNumberWithCommas(number) {
    return number.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

function removeDivAction(elem, type) {
    
    elem.remove();
    const elementId = elem.id;
    let valueOfRemovedItem
    if (type == "income") {
        valueOfRemovedItem = Object.values(totalIncomes[elementId]); //return an array with the value
        valueOfRemovedItem = valueOfRemovedItem[0];
        totalIncomes.splice(elementId, 1);
        updateLocalStorageAfterIncomeRemove(valueOfRemovedItem);
    }
    else {
        valueOfRemovedItem = Object.values(totalExspenses[elementId]); //return an array with the value
        valueOfRemovedItem = valueOfRemovedItem[0];
        totalExspenses.splice(elementId, 1);
        localStorage.setItem("total-expenses", JSON.stringify(totalExspenses));
        updateLocalStorageAfterExpenseRemove(valueOfRemovedItem);
    }
    currentBudget = 0;
    currentBudget = (currentBudget + localStorage.getItem("income")) - localStorage.getItem("expenses");
    elemCurrentBudget.innerHTML = `+${formatNumberWithCommas(currentBudget)}`;
    localStorage.setItem("budget", currentBudget);
    elemTotalExpensesPercentage.innerHTML = totalExpensesPercentageCalc()
    setCurrentExpensesPercentage()
    
}

function setCurrentExpensesPercentage() {
    document.querySelectorAll('.expenses-details .last-action-wrapper').forEach((div, index) => {
        let valueOfPercentageDiv = div.lastChild.children[0].textContent;
        let percentageDiv = div.lastChild.children[1]
        valueOfPercentageDiv = valueOfPercentageDiv.replace(/,/g, '');
        valueOfPercentageDiv = Number(valueOfPercentageDiv)
        valueOfPercentageDiv = Math.abs(valueOfPercentageDiv)
        valueOfPercentageDiv = percentageCalculator(valueOfPercentageDiv)
        percentageDiv.innerHTML = valueOfPercentageDiv
    });

}


function updateLocalStorageAfterIncomeRemove(value) {
    localStorage.setItem("total-incomes", JSON.stringify(totalIncomes));
    currentIncome -= value;
    localStorage.setItem("income", currentIncome);
    elemTotalIncome.innerHTML = `+${formatNumberWithCommas(currentIncome)}`;
    document.querySelectorAll('.income-details .last-action-wrapper').forEach((div, index) => {
        div.id = index;
    });
    incomeActionsCounter--;
}


function updateLocalStorageAfterExpenseRemove(value) {
    localStorage.setItem("total-expenses", JSON.stringify(totalExspenses));
    currentExpenses -= value;
    localStorage.setItem("expenses", currentExpenses);
    elemTotalExpenses.innerHTML = `-${formatNumberWithCommas(currentExpenses)}`;
    // Reset IDs of remaining divs
    document.querySelectorAll('.expenses-details .last-action-wrapper').forEach((div, index) => {
        div.id = index;
    });
    expensesActionsCounter--;
}


function printCurrentLocalDetailsOnReload() {
    currentIncome = 0;
    currentExpenses = 0;
    currentBudget = 0;
    printCurrentIncomesOnReload();  // Running on the current totalIncomes array and his objects key values and print them to the page, and added all the values to the currentIncome
    printCurrentExpensesOnReload();  // Running on the current totalExpenses array and his objects key values and print them to the page, and added all the values to the currentExpenses
    currentBudget = (currentBudget + localStorage.getItem("income")) - localStorage.getItem("expenses");
    elemCurrentBudget.innerHTML = `+${formatNumberWithCommas(currentBudget)}`;
    elemTotalExpensesPercentage.innerHTML = totalExpensesPercentageCalc();
    localStorage.setItem("budget", currentBudget);
}

function printCurrentIncomesOnReload() {
    const elemIncomeDetails = document.querySelector(".income-details");
    elemIncomeDetails.innerHTML = `<h3 class="details-headers">INCOME</h3>`;
    totalIncomes.forEach(obj => {
        Object.entries(obj).forEach(([description, value]) => {
            currentIncome += value;
            const newDiv = document.createElement("div");
            elemIncomeDetails.appendChild(newDiv);
            newDiv.classList.add("last-action-wrapper");
            newDiv.id = incomeActionsCounter;
            newDiv.innerHTML = `<p>${description}</p><div class="button-and-value-wrapper"><p>+${formatNumberWithCommas(value)}</p><button onclick="removeDivAction(this.parentNode.parentNode,'income')" class ="income-remove-button">${removeActionButton}</button></div>`;
            incomeActionsCounter++;
        });
        elemTotalIncome.innerHTML = `+${formatNumberWithCommas(currentIncome)}`;
        localStorage.setItem("income", currentIncome);
    });
}

function printCurrentExpensesOnReload() {
    const elemExpensesDetails = document.querySelector(".expenses-details");
    elemExpensesDetails.innerHTML = `<h3 class="details-headers">EXPENSES</h3>`;
    totalExspenses.forEach(obj => {
        Object.entries(obj).forEach(([description, value]) => {
            currentExpenses += value;
            let currentItemPercentage = percentageCalculator(value)
            const newDiv = document.createElement("div");
            elemExpensesDetails.appendChild(newDiv);
            newDiv.classList.add("last-action-wrapper");
            newDiv.id = expensesActionsCounter;
            newDiv.innerHTML = `<p>${description}</p><div class="button-and-value-wrapper"><p>-${formatNumberWithCommas(value)}</p><p class="total-expenses-percentage">${currentItemPercentage}</p><button onclick="removeDivAction(this.parentNode.parentNode,'expense')" class ="expenses-remove-button">${removeActionButton}</button></div>`;
            expensesActionsCounter++;
        });
        elemTotalExpenses.innerHTML = `-${formatNumberWithCommas(currentExpenses)}`;
        localStorage.setItem("expenses", currentExpenses);
    });
}

function submitActionChanges() {
    if (!orderValidationInputs()) {
        return;
    }
    printCurrentBudget();
    printCurrentIncomeAndExpenses();
    printLastIncomeDetail();
    printLastExpenseDetail();
    setCurrentExpensesPercentage() // set the current percentages of each expense
    elemTotalExpensesPercentage.innerHTML = totalExpensesPercentageCalc(); // set the current percentage of the totalExpense 
    resetInputs();
}

function printCurrentBudget() {
    elemActionSelector.value == "+" ? currentBudget += elemValueOfAction.valueAsNumber : currentBudget -= elemValueOfAction.valueAsNumber;
    elemCurrentBudget.innerHTML = `+${formatNumberWithCommas(currentBudget)}`;
    localStorage.setItem("budget", currentBudget);
}

function printCurrentIncomeAndExpenses() {
    elemActionSelector.value == "+" ? currentIncome += elemValueOfAction.valueAsNumber : currentExpenses += elemValueOfAction.valueAsNumber;
    elemTotalIncome.innerHTML = `+${formatNumberWithCommas(currentIncome)}`;
    elemTotalExpenses.innerHTML = `-${formatNumberWithCommas(currentExpenses)}`;
    localStorage.setItem("income", currentIncome);
    localStorage.setItem("expenses", currentExpenses);
}

function printLastIncomeDetail() {
    const newDiv = document.createElement("div");
    const elemIncomeDetails = document.querySelector(".income-details");
    if (elemActionSelector.value == "+") {
        let lastIncome = elemValueOfAction.valueAsNumber;
        // Push action to local storage
        let newAction = {};
        newAction[elemActionDescriptionInput.value] = lastIncome;
        totalIncomes.push(newAction);
        localStorage.setItem("total-incomes", JSON.stringify(totalIncomes));
        // Print action to page
        elemIncomeDetails.appendChild(newDiv);
        newDiv.classList.add("last-action-wrapper");
        newDiv.id = incomeActionsCounter;
        incomeActionsCounter++;
        newDiv.innerHTML = `<p>${elemActionDescriptionInput.value}</p><div class="button-and-value-wrapper"><p>+${formatNumberWithCommas(lastIncome)}</p><button onclick="removeDivAction(this.parentNode.parentNode,'income')" class ="income-remove-button">${removeActionButton}</button></div>`;

    }
}

function printLastExpenseDetail() {
    const newDiv = document.createElement("div");
    const elemIncomeDetails = document.querySelector(".expenses-details")
    if (elemActionSelector.value == "-") {
        let lastExpense = elemValueOfAction.valueAsNumber;
        // Push action to local storage
        let newAction = {};
        newAction[elemActionDescriptionInput.value] = lastExpense;
        totalExspenses.push(newAction);
        localStorage.setItem("total-expenses", JSON.stringify(totalExspenses));
        // Print action to page
        elemIncomeDetails.appendChild(newDiv);
        newDiv.classList.add("last-action-wrapper");
        newDiv.id = expensesActionsCounter;
        expensesActionsCounter++;
        newDiv.innerHTML = `<p>${elemActionDescriptionInput.value}</p><div class="button-and-value-wrapper"><p>-${formatNumberWithCommas(lastExpense)}</p><p class = "total-expenses-percentage"></p><button onclick="removeDivAction(this.parentNode.parentNode,'expense')" class ="expenses-remove-button">${removeActionButton}</button></div>`;
    }
}

function resetInputs() {
    elemActionDescriptionInput.value = "";
    elemValueOfAction.value = "";
}
function orderValidationInputs() {
    if (elemActionDescriptionInput.value == "" || elemValueOfAction.value == "") {
        // alert("Please insert all the inputs.")
        return false;
    }
    else if (elemValueOfAction.valueAsNumber < 1) {
        //alert("Cannot enter negative value.")
        return false;
    }
    return true
}


// Input submit button color changes run whe
function submitButtonColorChange() { //worked on it
    if (elemActionSelector.value == '+') {
        elemSubmitActionButton.style.color = "var(--income-color)";
    } if (elemActionSelector.value == '-') {
        elemSubmitActionButton.style.color = "var(--expenses-color)";
    }
}
submitButtonColorChange();
// Input border color changes 

function orderColorChange() {
    elemActionDescriptionInput.style.border = "var(--input-border)";
    elemValueOfAction.style.border = "var(--input-border)";
    if (elemActionSelector.value == '+') {
        elemActionSelector.style.border = "var(--income-border-color)";
        elemSubmitActionButton.style.color = "var(--income-color)";
    } if (elemActionSelector.value == '-') {
        elemActionSelector.style.border = "var(--expenses-border-color)";
        elemSubmitActionButton.style.color = "var(--expenses-color)";
    }
}

function descriptionColorChange() {
    elemActionSelector.style.border = "var(--input-border)";
    elemValueOfAction.style.border = "var(--input-border)";
    if (elemActionSelector.value == '+') {
        elemActionDescriptionInput.style.border = "var(--income-border-color)";
    } if (elemActionSelector.value == '-') {
        elemActionDescriptionInput.style.border = "var(--expenses-border-color)";
    }
}

function valueColorChange() {
    elemActionSelector.style.border = "var(--input-border)";
    elemActionDescriptionInput.style.border = "var(--input-border)";
    if (elemActionSelector.value == '+') {
        elemValueOfAction.style.border = "var(--income-border-color)";
    } if (elemActionSelector.value == '-') {
        elemValueOfAction.style.border = "var(--expenses-border-color)";
    }
}

