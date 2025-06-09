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

      if (!inputFromEl.disabled && !isNaN(valorFrom)) {
        const convertido = (valorFrom / taxaDe) * taxaPara;
        inputToEl.value = convertido.toFixed(2).replace(".", ",");
      } else if (!inputToEl.disabled && !isNaN(valorTo)) {
        const convertido = (valorTo / taxaPara) * taxaDe;
        inputFromEl.value = convertido.toFixed(2).replace(".", ",");
      }
    }

    // converte valor do input de from para to
    inputFromEl.addEventListener("input", () => converter());

    // converte valor do input de to para from
    inputToEl.addEventListener("input", () => converter());
  })
  .catch((error) => {
    console.error("Erro ao obter dados:", error);
  });

// selects onChange
selectFromEl.addEventListener("change", () => getSelected(selectFromEl));
selectToEl.addEventListener("change", () => getSelected(selectToEl));

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
