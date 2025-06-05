// máscara de valor monetário
$(document).ready(function () {
  $("#from").mask("000.000,00", { reverse: true });
});

$(document).ready(function () {
  $("#for").mask("000.000,00", { reverse: true });
});

// api com taxas de câmbio
const selectFromEl = document.getElementById("select-from");
const selectToEl = document.getElementById("select-to");

fetch("https://v6.exchangerate-api.com/v6/6971c71c0b89341728d6c0f5/latest/USD")
  .then((response) => response.json())
  .then((data) => {
    const conversionRates = data.conversion_rates; // objeto

    Object.entries(conversionRates).forEach(([moeda, taxa]) => {
      // transforma em array
      const option = document.createElement("option"); // cria options no select de moedas
      option.value = moeda;
      option.textContent = moeda;
      selectFromEl.appendChild(option);
    });

    Object.entries(conversionRates).forEach(([moeda, taxa]) => {
      // transforma em array
      const option = document.createElement("option"); // cria options no select de moedas
      option.value = moeda;
      option.textContent = moeda;
      selectToEl.appendChild(option);
    });

    const optionFromElement = document.querySelector("#select-from option[value='USD']"); // seleciona USD como padrão do select-from
    optionFromElement.setAttribute("selected", "selected");
    const optionToElement = document.querySelector("#select-to option[value='BRL']"); // seleciona BRL como padrão do select-to
    optionToElement.setAttribute("selected", "selected");

    console.log(data);
  })
  .catch((error) => {
    console.error("Erro ao obter dados:", error);
  });
