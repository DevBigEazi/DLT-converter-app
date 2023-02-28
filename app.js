// Fetching the symbol data(currency options) from API endpoit
const getCurrencyOptions = async () => {
    const optionsUrl = 'https://api.exchangerate.host/symbols';
    const response = await fetch(optionsUrl);
    const json = await response.json();
    
    return json.symbols;
};

// getCurrencyOptions().then(console.log);

// Fetching the currency rates(convert endpoit result) data from API endpoit
const getCurrencyRates = async (fromCurrency, toCurrency) => {
    const currencyConvertUrl = new URL('https://api.exchangerate.host/convert');
    currencyConvertUrl.searchParams.append('from', fromCurrency);
    currencyConvertUrl.searchParams.append('to', toCurrency);

    const response = await fetch(currencyConvertUrl);
    const json = await response.json();

    return json.result;
};

// this function will create new option element and create it for the select element being pass as an arguement
const appendOptionsElToSelectEl = (selectEl, optionItem) => {
    const optionEl = document.createElement('option');
    optionEl.value = optionItem.code;
    optionEl.textContent = optionItem.description;

    selectEl.appendChild(optionEl);
};

const populateSelectEl = (selectEl, optionList) => {
    optionList.forEach(optionItem => {
        appendOptionsElToSelectEl(selectEl, optionItem);
    })
};

// Set up currencies and make refrence to the DOM elements
const setUpCurrencies = async () => {
    const fromCurrency = document.querySelector('#fromCurrency');
    const toCurrency = document.querySelector('#toCurrency');

    const currencyOptions = await getCurrencyOptions()
    const currencies = Object.keys(currencyOptions).map(currencyKeys => currencyOptions[currencyKeys]);

    // populate the select elements using the previous function
    populateSelectEl(fromCurrency, currencies);
    populateSelectEl(toCurrency, currencies);
    
};
setUpCurrencies();

// Setting up the the event listener for our form element
const setupEventListener = () => {
    const formEl = document.getElementById('covertForm');
    formEl.addEventListener('submit', async event => {
        
        event.preventDefault();

        const fromCurrency = document.querySelector('#fromCurrency');
        const toCurrency = document.querySelector('#toCurrency');
        const amount = document.querySelector('#amount');
        const convertResultEl = document.querySelector('#convertResult');

        try {
            const rate = await getCurrencyRates(fromCurrency.value, toCurrency.value);

            const amountValue = Number(amount.value);
            const conversionRate = Number(amountValue * rate).toFixed(2);
            convertResultEl.textContent = `${amountValue} ${fromCurrency.value} = ${conversionRate} ${toCurrency.value}`;
        } 
        catch (err) {
            convertResultEl.textContent = `There is an error fetching data[${err.message}]`;
            convertResultEl.classList.add('error');
        };
    });
};
setupEventListener();









