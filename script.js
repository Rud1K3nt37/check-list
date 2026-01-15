const products = [
  // Морозилка
  { name: "Бульон Том Ям", min: 10, count: 16, comment: "", category: "freezer" },
  // { name: "Бульон Рамен/Сырный", min: 10, count: 15, comment: "", category: "freezer" },
  // { name: "Креветки темпура", min: 5, count: 9, comment: "", category: "freezer" },
  // { name: "Овощи на рамен/сырный", min: 10, count: 12, comment: "", category: "freezer" },
  // { name: "Мидии с панцирем", min: 5, count: 4, comment: "", category: "freezer" },
  // { name: "Соус сырный", min: 3, count: 3, comment: "", category: "freezer" },
  // { name: "Том ям-море.", min: 5, count: 5, comment: "", category: "freezer" },
  // { name: "Вок-крев.", min: 5, count: 10, comment: "", category: "freezer" },
  // { name: "Вок-кур.", min: 7, count: 7, comment: "Мало", category: "freezer" },
  // { name: "Креветки вареные", min: 5, count: 4, comment: "", category: "freezer" },
  // { name: "Вок море.", min: 4, count: 4, comment: "Редко берут", category: "freezer" },
  // // Холодильник
  // { name: "Мидии очищ. п/ф", min: 2, count: 5, comment: "", category: "fridge" },
  // { name: "Удон п/ф", min: 10, count: 100, comment: "", category: "fridge" },
  // { name: "Яичная п/ф", min: 3, count: 3, comment: "", category: "fridge" },
  // { name: "Яйца варёные", min: 3, count: 3, comment: "", category: "fridge" },
  // { name: "Соевый п/ф", min: 1, count: 10, comment: "", category: "fridge" },
  // { name: "Сыр слив.", min: 2, count: 5, comment: "", category: "fridge" },
  // { name: "Соус Гурман", min: 2, count: 5, comment: "", category: "fridge" },
  // { name: "Омлет", min: 10, count: 20, comment: "", category: "fridge" },
  // { name: "Маринад", min: 1, count: 5, comment: "", category: "fridge" },
];

function getRowStatus(product) {
  if (product.count >= product.min) return "ok";
  if (product.count > 0) return "warn";
  return "bad";
}

function renderTables() {
  document.querySelectorAll(".checklist").forEach(table => {
    const category = table.dataset.category;
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; // чистим старое содержимое

    products
      .filter(p => p.category === category)
      .forEach((p) => {
        const realIndex = products.indexOf(p);
        const tr = document.createElement("tr");
        tr.className = getRowStatus(p);

        tr.innerHTML = `
          <td>${p.name}</td>
          <td>${p.min}</td>
          <td>
            <input type="number" value="${p.count}" min="0" data-index="${realIndex}">
          </td>
          <td>
            <input type="text" value="${p.comment}" data-index="${realIndex}" class="comment">
          </td>
        `;

        tbody.appendChild(tr);
      });
  });
}

// после инициализации Firebase и Firestore
const productsCollection = db.collection("products");

// 1️⃣ Загрузка продуктов из Firestore
productsCollection.onSnapshot(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    const product = products.find(p => p.name === data.name);
    if (product) {
      product.count = data.count;
      product.comment = data.comment;
    }
  });

  renderTables(); // перестраиваем таблицы с актуальными данными
});

// 2️⃣ Обработчик изменений
document.querySelectorAll(".checklist tbody").forEach(tbody => {
  tbody.addEventListener("input", e => {
    const idx = e.target.dataset.index;
    if (idx === undefined) return;

    const product = products[idx];

    if (e.target.type === "number") {
      product.count = Number(e.target.value);
    }
    if (e.target.classList.contains("comment")) {
      product.comment = e.target.value;
    }

    const tr = e.target.closest("tr");
    tr.classList.remove("ok", "warn", "bad");
    tr.classList.add(getRowStatus(product));

    // 3️⃣ Сохраняем изменения в Firestore
    productsCollection.doc(product.name).set({
      name: product.name,
      count: product.count,
      comment: product.comment,
      category: product.category
    });
  });
});
