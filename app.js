// Select Elements
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// Select Buttons
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

// Input Buttons
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

// Variables
let ENTRY_LIST;
let balance = 0,
  income = 0,
  outcome = 0;
const DELETE = "delete",
  EDIT = "edit";

// Check if there is saved data in localStorage
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// Event Listeners
expenseBtn.addEventListener("click", function() {
  // For expense tab
  show(expenseEl);
  hide([incomeEl, allEl]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
})
incomeBtn.addEventListener("click", function() {
  // For income tab
  show(incomeEl);
  hide([expenseEl, allEl]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
})
allBtn.addEventListener("click", function() {
  // For all tab
  show(allEl);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
})

addExpense.addEventListener("click", function() {
  // For adding an expense to the list
  // If one of the inputs is empty --> exit
  if (!expenseTitle.value || !expenseAmount.value) return;

  // Save entry to ENTRY_LIST
  let expense = {
    type: "expense",
    title: expenseTitle.value,
    amount: parseInt(expenseAmount.value)
  }
  ENTRY_LIST.push(expense);

  updateUI();
  clearInput([expenseTitle, expenseAmount])
})

addIncome.addEventListener("click", function() {
  // For adding an income to the list
  // If one of the inputs is empty --> exit
  if (!incomeTitle.value || !incomeAmount.value) return;

  // Save entry to ENTRY_LIST
  let income = {
    type: "income",
    title: incomeTitle.value,
    amount: parseInt(incomeAmount.value)
  }
  ENTRY_LIST.push(income);

  updateUI();
  clearInput([incomeTitle, incomeAmount])
})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// Helper Functions

function deleteOrEdit(event) {
  // Delete or edit an entry
  const targetBtn = event.target;

  const entry = targetBtn.parentNode;

  if (targetBtn.id == DELETE) {
    deleteEntry(entry);
  } else if (targetBtn.id == EDIT) {
    editEntry(entry);
  }
}

function deleteEntry(entry) {
  // Delete an entry from ENTRY_LIST
  ENTRY_LIST.splice(entry.id, 1);

  updateUI();
}

function editEntry(entry) {
  // Edit an entry from ENTRY_LIST
  console.log(entry)
  let ENTRY = ENTRY_LIST[entry.id];

  if (ENTRY.type == "income") {
    incomeAmount.value = ENTRY.amount;
    incomeTitle.value = ENTRY.title;
  } else if (ENTRY.type == "expense") {
    expenseAmount.value = ENTRY.amount;
    expenseTitle.value = ENTRY.title;
  }

  deleteEntry(entry);
}

function updateUI() {
  // Updates income, outcome, balance, and chart --> stores in localStorage
  income = calculateTotal("income", ENTRY_LIST);
  outcome = calculateTotal("expense", ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));

  // Determine sign of balance
  let sign = (income >= outcome) ? "$" : "-$";

  // Update UI
  balanceEl.innerHTML = `${sign}${balance}`;
  outcomeTotalEl.innerHTML = `$${outcome}`;
  incomeTotalEl.innerHTML = `$${income}`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry, index) => {
    if (entry.type == "expense") {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index)
    } else if (entry.type == "income") {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index)
    }
    showEntry(allList, entry.type, entry.title, entry.amount, index)
  });

  updateChart(income, outcome);

  localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {
  // Shows entry in tab list
  const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

  const position = "afterbegin";

  list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
  // Clears an element
  elements.forEach(element => {
    element.innerHTML = "";
  })
}

function calculateTotal(type, list) {
  // Calculates total amount of income or outcome list
  let sum = 0;

  list.forEach(entry => {
    if (entry.type == type) {
      sum += entry.amount;
    }
  })

  return sum;
}

function calculateBalance(income, outcome) {
  // Calculates balance
  return income - outcome;
}

function clearInput(inputs) {
  // Clears input for income or expense buttons
  inputs.forEach(input => {
    input.value = "";
  })
}

function show(element) {
  // For showing entries in a tab list
  element.classList.remove("hide");
}

function hide(elements) {
  // For hiding entries in a tab list
  elements.forEach(element => {
    element.classList.add("hide");
  })
}

function active(element) {
  // For activating tabs
  element.classList.add("active");
}

function inactive(elements) {
  // For deactivating tabs
  elements.forEach(element => {
    element.classList.remove("active");
  })
}
