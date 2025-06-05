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

// verificar qual option ta selecionada e a partir dessa option falar a taxa
function getSelected(selectEl) {
  const selected = selectEl.value;
  console.log(selected);
}

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
    const optionFromElement = document.querySelector(
      "#select-from option[value='USD']"
    );
    optionFromElement.setAttribute("selected", "selected");
    // seleciona BRL como padrão do select-to
    const optionToElement = document.querySelector(
      "#select-to option[value='BRL']"
    );
    optionToElement.setAttribute("selected", "selected");

    // converte valor do input de from para to
    inputFromEl.addEventListener("input", function () {
      const valor = parseFloat(this.value.replace(".", "").replace(",", "."));
      const taxaDe = conversionRates[selectFromEl.value];
      const taxaPara = conversionRates[selectToEl.value];
      const convertido = (valor / taxaDe) * taxaPara;
      if (isNaN(valor)) {
        inputToEl.value = "";
        return;
      }
      inputToEl.value = convertido.toFixed(2).replace(".", ",");
    });

    // converte valor do input de to para from
    inputToEl.addEventListener("input", function () {
      const valor = parseFloat(this.value.replace(".", "").replace(",", "."));
      const taxaDe = conversionRates[selectFromEl.value];
      const taxaPara = conversionRates[selectToEl.value];
      const convertido = (valor / taxaPara) * taxaDe;
      if (isNaN(valor)) {
        inputFromEl.value = "";
        return;
      }
      inputFromEl.value = convertido.toFixed(2).replace(".", ",");
    });
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