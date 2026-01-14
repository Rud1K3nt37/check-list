const products = [
  { name: "Бульон Том-Ям", min: 10, count: 16, comment: "" },
  { name: "Бульон Рамен/Сырный", min: 10, count: 15, comment: "" },
  { name: "Креветки темпура", min: 5, count: 9, comment: "4шт по 5 сделать" },
  { name: "Мидии с панцирем", min: 5, count: 4, comment: "" },
  { name: "Удон пф", min: 10, count: 100, comment: "" },
  { name: "Яичная пф", min: 3, count: 3, comment: "" },
  { name: "Яйца варёные", min: 3, count: 3, comment: "" },
  { name: "Соевый", min: 1, count: 10, comment: "" },
  { name: "Сыр слив.", min: 2, count: 5, comment: "" },
  { name: "Соус Гурман", min: 2, count: 5, comment: "" },
  { name: "Омлет", min: 10, count: 20, comment: "" },
  { name: "Маринад", min: 1, count: 5, comment: "" },
  { name: "Мидии очищ.", min: 2, count: 5, comment: "" },
  { name: "Том ям-море.", min: 5, count: 5, comment: "" },
  { name: "Вок-крев.", min: 5, count: 10, comment: "" },
  { name: "Вок-кур.", min: 7, count: 7, comment: "Мало" },
  { name: "Креветки вареные", min: 5, count: 4, comment: "" },
  { name: "Вок море.", min: 4, count: 4, comment: "Редко берут" },
  { name: "Овощи на рамен/сырный", min: 10, count: 12, comment: "" },
  { name: "Соус сырный", min: 3, count: 3, comment: "" },
];

// функция для вычисления статуса
function getStatus(product) {
  if (product.count >= product.min) return "✅";
  else if (product.count > 0) return "⏳";
  else return "❌";
}

// добавление строк в таблицу
const tbody = document.querySelector("#checklist tbody");
products.forEach((p, index) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${p.name}</td>
    <td>${p.min}</td>
    <td><input type="number" value="${p.count}" min="0" data-index="${index}"></td>
    <td class="status">${getStatus(p)}</td>
    <td><input type="text" value="${p.comment}" data-index="${index}" class="comment"></td>
  `;
  tbody.appendChild(tr);
});

tbody.addEventListener("input", e => {
  const idx = e.target.dataset.index;

  if (e.target.tagName === "INPUT" && !e.target.classList.contains("comment")) {
    // Обновляем количество
    products[idx].count = Number(e.target.value);
    const statusCell = e.target.parentElement.nextElementSibling;
    statusCell.textContent = getStatus(products[idx]);
    statusCell.className = "status " + getStatus(products[idx]);
  }

  if (e.target.classList.contains("comment")) {
    // Обновляем комментарий
    products[idx].comment = e.target.value;
  }
});

// обновление статуса при изменении количества
// tbody.addEventListener("input", e => {
//   if (e.target.tagName === "INPUT") {
//     const idx = e.target.dataset.index;
//     products[idx].count = Number(e.target.value);
//     const statusCell = e.target.parentElement.nextElementSibling;
//     statusCell.textContent = getStatus(products[idx]);
//     statusCell.className = "status " + getStatus(products[idx]);
//   }
// });