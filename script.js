let stat_responses = [[], [], []];
const STARS_INDEX = 0;
const RATINGS_INDEX = 1;
const TODOS_INDEX = 2;
const UPDATED_EPOCH = new Date("2017-04-01T00:00:00Z");

(function () {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch(...args);
    const url = args[0];
    if (url.includes("todos")) {
      stat_responses[TODOS_INDEX] = await response.clone().json();
    } else if (url.includes("stars")) {
      stat_responses[STARS_INDEX] = await response.clone().json();
    } else if (url.includes("ratings")) {
      stat_responses[RATINGS_INDEX] = await response.clone().json();
    }
    return response;
  };
})();

function addHeaderElements(tableBody, headers) {
  const tr = document.createElement("tr");
  for (const header of headers) {
    const td = document.createElement("td");
    const strong = document.createElement("strong");
    strong.textContent = header;
    td.appendChild(strong);
    if (header === "Date") {
      td.addEventListener("click", () => {
        const ascending = !td.classList.contains("ascending");
        td.classList.toggle("ascending", ascending);
        sortTableByDate(tableBody, ascending);
      });
    } else if (header === "Name") {
      td.addEventListener("click", () => {
        const ascending = !td.classList.contains("ascending");
        td.classList.toggle("ascending", ascending);
        sortTableByName(tableBody, ascending);
      });
    }
    tr.appendChild(td);
  }
  tableBody.insertBefore(tr, tableBody.firstChild);
}

function sortTableByDate(tableBody, ascending) {
  const rows = Array.from(tableBody.querySelectorAll("tr")).slice(1);
  rows.sort((a, b) => {
    const dateA = new Date(a.querySelector("td:last-child div").textContent);
    const dateB = new Date(b.querySelector("td:last-child div").textContent);
    return ascending ? dateB - dateA : dateA - dateB;
  });
  rows.unshift(tableBody.querySelector("tr")); // Keep header row at the top
  tableBody.replaceChildren(...rows);
}

function sortTableByName(tableBody, ascending) {
  const rows = Array.from(tableBody.querySelectorAll("tr")).slice(1);
  rows.sort((a, b) => {
    const nameA = a.querySelector("td:first-child a").textContent.toLowerCase();
    const nameB = b.querySelector("td:first-child a").textContent.toLowerCase();
    return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
  rows.unshift(tableBody.querySelector("tr")); // Keep header row at the top
  tableBody.replaceChildren(...rows);
}

document.addEventListener("DOMContentLoaded", () => {
  const headers = [
    ["Name", "Stars", "Date"],
    ["Name", "Grade", "Date"],
    ["Name", "Date"],
  ];
  const statsTable = document.getElementsByClassName("onx-stats-table")[0];
  if (!statsTable) {
    console.error("Stats table not found");
    return;
  }
  let tableLengths = [0, 0, 0];
  let tableHeadersAdded = [false, false, false];
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let statIndex = 0; statIndex < stat_responses.length; statIndex++) {
      const statsDiv = statsTable.children[0].children[statIndex];
      const tableBody = statsDiv.querySelector("tbody");
      const prevLength = tableLengths[statIndex];
      if (!tableHeadersAdded[statIndex]) {
        addHeaderElements(tableBody, headers[statIndex]);
        tableHeadersAdded[statIndex] = true;
      }
      const currentLength = tableBody.children.length;
      tableLengths[statIndex] = currentLength;
      if (
        tableBody &&
        currentLength > prevLength &&
        stat_responses[statIndex]
      ) {
        for (const stat of stat_responses[statIndex].data) {
          if (!stat || !stat.user || !stat.user.id) {
            console.debug("Invalid stat data:", stat);
            continue;
          }
          const userId = stat.user.id;
          const ts = stat.updatedAt;
          const userAnchor = tableBody.querySelector(
            `a[href='/user/${userId}']`
          );
          if (userAnchor) {
            const td = document.createElement("td");
            const div = document.createElement("div");
            div.className = "small";
            const tsDate = new Date(ts);
            div.textContent =
              tsDate < UPDATED_EPOCH
                ? "pre 2017"
                : new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                  }).format(new Date(ts));
            td.appendChild(div);
            userAnchor.parentElement.parentElement.appendChild(td);
          } else {
            console.debug("User anchor not found for userId:", userId);
          }
        }
      } else {
        console.debug("Stat table not found", statIndex);
      }
    }
  });

  if (statsTable) {
    observer.observe(statsTable, {
      childList: true,
      subtree: true,
      attributes: false,
    });
  } else {
    console.error("Stats table not found");
  }
});
