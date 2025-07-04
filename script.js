// máscara de valor monetário
$(document).ready(function () {
  $("#from").mask("000.000,00", { reverse: true });
});

$(document).ready(function () {
  $("#to").mask("000.000,00", { reverse: true });
});

// elementos
const selectFromEl = document.getElementById("select-from");
const selectToEl = document.getElementById("select-to");
const inputFromEl = document.getElementById("from");
const inputToEl = document.getElementById("to");
const inputFromDiv = document.getElementById("from-div");
const inputToDiv = document.getElementById("to-div");

// armazena os dados da api
const STORAGE_KEY = "exchangeRatesCache";

// verifica se uma data é a data de hoje
function isToday(dateStr) {
  const savedDate = new Date(dateStr);
  const today = new Date();
  return (
    savedDate.getDate() === today.getDate() &&
    savedDate.getMonth() === today.getMonth() &&
    savedDate.getFullYear() === today.getFullYear()
  );
}

// obtém os dados da api
function fetchRates() {
  const cacheStr = localStorage.getItem(STORAGE_KEY);

  // verifica se o cache já existe
  if (cacheStr) { 
    const cache = JSON.parse(cacheStr);
    if (isToday(cache.date)) {
      console.log("Usando dados do cache localStorage");
      return Promise.resolve(cache.data);
    }
  }

  return fetch(
    "https://v6.exchangerate-api.com/v6/7a50fe30ea409715c7ce4e90/latest/USD"
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "success") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            date: new Date().toISOString(),
            data,
          })
        );
      }
      return data;
    });
}

// inicializa o app com os dados da api
function initApp(data) {
  const conversionRates = data.conversion_rates; // objeto
  const moedas = Object.keys(conversionRates); // array

  // cria options no select de moedas
  function setOptions(selectEl) {
    moedas.forEach((moeda) => {
      const option = document.createElement("option");
      option.value = moeda;
      option.textContent = moeda;
      selectEl.appendChild(option);
    });
  }
  setOptions(selectFromEl);
  setOptions(selectToEl);

  // seleciona USD como padrão do select-from
  document.querySelector("#select-from").value = "USD";
  // seleciona BRL como padrão do select-to
  document.querySelector("#select-to").value = "BRL";

  // inverter as moedas
  const iconAlt = document.getElementById("alt");
  iconAlt.addEventListener("click", () => {
    // inverte as moedas
    const optionFromValue = document.querySelector("#select-from").value;
    const optionToValue = document.querySelector("#select-to").value;
    document.querySelector("#select-from").value = `${optionToValue}`;
    document.querySelector("#select-to").value = `${optionFromValue}`;

    // se tiver valor, inverte o valor
    if (inputFromEl.value) {
      const valueFrom = inputFromEl.value;
      const valueTo = inputToEl.value;
      inputFromEl.value = valueTo;
      inputToEl.value = valueFrom;
    }
  });

  // função de conversão
  function converter() {
    const valorFrom = parseFloat(
      inputFromEl.value.replace(".", "").replace(",", ".")
    );
    const valorTo = parseFloat(
      inputToEl.value.replace(".", "").replace(",", ".")
    );
    const taxaDe = conversionRates[selectFromEl.value];
    const taxaPara = conversionRates[selectToEl.value];

    if (!inputFromEl.disabled) {
      if (isNaN(valorFrom)) {
        inputToEl.value = "";
        return;
      }
      const convertido = (valorFrom / taxaDe) * taxaPara;
      inputToEl.value = convertido.toFixed(2).replace(".", ",");
    } else if (!inputToEl.disabled) {
      if (isNaN(valorTo)) {
        inputFromEl.value = "";
        return;
      }
      const convertido = (valorTo / taxaPara) * taxaDe;
      inputFromEl.value = convertido.toFixed(2).replace(".", ",");
    }
  }

  // define 1 como valor padrão
  (function defaultValue() {
    inputFromEl.value = "1,00";
    converter();
  })();

  // caixa de exemplo por unidade
  function unitValue() {
    const h1From = document.getElementById("h1-from");
    h1From.textContent = `1 ${selectFromEl.value} =`;

    const h1To = document.getElementById("h1-to");
    const taxaPara = conversionRates[selectToEl.value];
    const convertido = 1 * taxaPara;
    h1To.textContent = `${convertido.toFixed(2).replace(".", ",")} ${
      selectToEl.value
    } `;
  }

  unitValue();

  // converte valor do input de from para to
  inputFromEl.addEventListener("input", () => converter());
  // converte valor do input de to para from
  inputToEl.addEventListener("input", () => converter());

  // converte ao trocar moeda selecionada
  selectFromEl.addEventListener("change", () => {
    converter();
    unitValue();
  });

  selectToEl.addEventListener("change", () => {
    converter();
    unitValue();
  });

  function activateInput(input1, input2) {
    input1.disabled = false;
    input1.focus();
    input2.disabled = true;
  }

  inputToDiv.addEventListener("click", () =>
    activateInput(inputToEl, inputFromEl)
  );
  inputFromDiv.addEventListener("click", () =>
    activateInput(inputFromEl, inputToEl)
  );
}

//  chama a função que pega os dados para depois chamar a função que inicia o app
fetchRates()
  .then((data) => {
    if (!data || !data.conversion_rates) {
      console.error("Resposta inválida da API ou do cache:", data);
      return;
    }
    initApp(data);
  })
  .catch((error) => {
    console.error("Erro ao obter dados:", error);
  });