const Modal = {
    activation() {
        document
            .querySelector('.modal-overlay')
            .classList.toggle('active');
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("local transactions")) || [];
    },

    set(transactions) {
        localStorage.setItem("local transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload();
    },

    incomes() {
        let income = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income;
    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })

        return expense;
    },

    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM_Manipulation = {
    tbody: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');

        tr.innerHTML = DOM_Manipulation.HTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM_Manipulation.tbody.appendChild(tr);
    },

    HTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Formatting.formatCurrency(transaction.amount);

        const html = `
            <td headers="description">${transaction.description}</td>
            <td headers="amount" class="${CSSclass}">${amount}</td>
            <td headers="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover Transação" onclick="Transaction.remove(${index})">
            </td>`
        
            return html;
    },

    updateBalance() {
        document
        .querySelector('#incomeDisplay')
        .innerHTML = Formatting.formatCurrency(Transaction.incomes());

        document.querySelector('#expenseDisplay')
        .innerHTML = Formatting.formatCurrency(Transaction.expenses());

        document.querySelector('#totalDisplay')
        .innerHTML = Formatting.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM_Manipulation.tbody.innerHTML = "";
    }
}

const Formatting = {
    formatAmount(value) {
        value = Number(value) * 100;
        
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-");

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return signal + value;
    }
}

const Form = {
    description: document.querySelector('#description-input'),
    amount: document.querySelector('#amount-input'),
    date: document.querySelector('#date-input'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        };
    },

    validateFields() {
        const {description, amount, date} = Form.getValues();

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("É obrigatório o preenchimento de todos os campos");
        }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues();

        amount = Formatting.formatAmount(amount);
        date = Formatting.formatDate(date);

        return {description, amount, date}
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validateFields();
            const transaction = Form.formatValues();
            Transaction.add(transaction);
            Form.clearFields();
            Modal.activation();
        } catch(error) {
            alert(error.message);
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM_Manipulation.addTransaction);

        DOM_Manipulation.updateBalance()

        Storage.set(Transaction.all);
    },

    reload() {
        DOM_Manipulation.clearTransactions();

        App.init();
    }
}

App.init();