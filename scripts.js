/* وظائف الواجهة: قائمة الهاتف، البحث، التصنيفات والترقيم. لا توجد مكتبات خارجية. */
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const grid = document.querySelector("#post-grid");
  if (!grid) return; // صفحات المقالات والموارد لا تحتاج إلى منطق القائمة.
  const cards = Array.from(grid.querySelectorAll(".post-card"));
  const searchInput = document.querySelector("#site-search");
  const searchForm = document.querySelector("#search-form");
  const chips = Array.from(document.querySelectorAll(".filter-chip"));
  const pagination = document.querySelector("#pagination");
  const status = document.querySelector("#results-status");
  const empty = document.querySelector("#empty-state");
  const pageSize = 4;
  let activeCategory = "الكل";
  let currentPage = 1;

  const normalize = (value) => value.toLocaleLowerCase("ar").trim();
  const matchingCards = () => {
    const query = normalize(searchInput ? searchInput.value : "");
    return cards.filter((card) => {
      const categoryMatches = activeCategory === "الكل" || card.dataset.category === activeCategory;
      const searchable = normalize(card.textContent + " " + (card.dataset.tags || ""));
      return categoryMatches && (!query || searchable.includes(query));
    });
  };

  function render() {
    const matches = matchingCards();
    const pages = Math.max(1, Math.ceil(matches.length / pageSize));
    currentPage = Math.min(currentPage, pages);
    const start = (currentPage - 1) * pageSize;
    const visible = new Set(matches.slice(start, start + pageSize));
    cards.forEach((card) => { card.hidden = !visible.has(card); });
    empty.hidden = matches.length !== 0;
    status.textContent = matches.length ? `عرض ${start + 1}–${Math.min(start + pageSize, matches.length)} من ${matches.length} منشورات` : "";
    pagination.replaceChildren();

    const addButton = (label, page, disabled, current = false) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "page-button";
      button.textContent = label;
      button.disabled = disabled;
      if (current) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        currentPage = page;
        render();
        document.querySelector("#latest")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      pagination.append(button);
    };
    if (pages > 1) {
      addButton("السابق", currentPage - 1, currentPage === 1);
      for (let page = 1; page <= pages; page++) addButton(String(page), page, false, page === currentPage);
      addButton("التالي", currentPage + 1, currentPage === pages);
    }
  }

  chips.forEach((chip) => chip.addEventListener("click", () => {
    activeCategory = chip.dataset.filter || "الكل";
    currentPage = 1;
    chips.forEach((item) => {
      const selected = item === chip;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    render();
  }));
  if (searchInput) searchInput.addEventListener("input", () => { currentPage = 1; render(); });
  if (searchForm) searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    currentPage = 1;
    render();
  });
  render();
});
