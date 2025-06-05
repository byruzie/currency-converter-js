// máscara de valor monetário
$(document).ready(function () {
  $("#from").mask("000.000,00", { reverse: true });
});

$(document).ready(function () {
  $("#for").mask("000.000,00", { reverse: true });
});

// api com taxas de câmbio
// 6971c71c0b89341728d6c0f5

fetch("https://v6.exchangerate-api.com/v6/6971c71c0b89341728d6c0f5/latest/USD")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Erro ao obter dados:", error);
  });