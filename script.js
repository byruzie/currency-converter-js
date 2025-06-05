// máscara de valor monetário
$(document).ready(function () {
  $("#from").mask("000.000,00", { reverse: true });
});

$(document).ready(function () {
  $("#to").mask("000.000,00", { reverse: true });
});

// api com taxas de câmbio
const selectFromEl = document.getElementById("select-from");
const selectToEl = document.getElementById("select-to");

fetch("https://v6.exchangerate-api.com/v6/6971c71c0b89341728d6c0f5/latest/USD")
  .then((response) => response.json())
  .then((data) => {
    const conversionRates = data.conversion_rates; // objeto
    const taxas = Object.values(conversionRates); // array
    const moedas = Object.keys(conversionRates); // array

    function setOptions(selectEl) {
      moedas.forEach((moeda) => {
        const option = document.createElement("option"); // cria options no select de moedas
        option.value = moeda;
        option.textContent = moeda;
        selectEl.appendChild(option);
      });
    }

    setOptions(selectFromEl);
    setOptions(selectToEl);

    const optionFromElement = document.querySelector(
      "#select-from option[value='USD']"
    ); // seleciona USD como padrão do select-from
    optionFromElement.setAttribute("selected", "selected");
    const optionToElement = document.querySelector(
      "#select-to option[value='BRL']"
    ); // seleciona BRL como padrão do select-to
    optionToElement.setAttribute("selected", "selected");
  })
  .catch((error) => {
    console.error("Erro ao obter dados:", error);
  });

// input from e to
const inputFromEl = document.getElementById("from");
const inputToEl = document.getElementById("to");
const inputFromDiv = document.getElementById("from-div");
const inputToDiv = document.getElementById("to-div");

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

inputFromEl.addEventListener("input", function () {
  inputToEl.value = this.value;
});

inputToEl.addEventListener("input", function () {
  inputFromEl.value = this.value;
});
