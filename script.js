let statResponses = [{}, {}, {}];
const UNKOWN_REQUEST_INDEX = -1;
const STARS_INDEX = 0;
const RATINGS_INDEX = 1;
const TODOS_INDEX = 2;
const TICKS_INDEX = 3;
const UPDATED_EPOCH = new Date("2017-04-01T00:00:00Z");

function getRatingValue(statResponse) {
  const ratings = [
    "rockRating",
    "boulderRating",
    "iceRating",
    "aidRating",
    "mixedRating",
    "snowRating",
  ];
  for (const rating of ratings) {
    if (statResponse[rating]) {
      return statResponse[rating];
    }
  }
}

function getResponseIndex(url) {
  if (url.includes("stars")) {
    return STARS_INDEX;
  } else if (url.includes("ratings")) {
    return RATINGS_INDEX;
  } else if (url.includes("todos")) {
    return TODOS_INDEX;
  } else {
    return UNKOWN_REQUEST_INDEX;
  }
}

function getResponseIndexFromTrId(id) {
  if (!id) {
    return TODOS_INDEX;
  } else if (id.includes("stars")) {
    return STARS_INDEX;
  } else if (id.includes("ratings")) {
    return RATINGS_INDEX;
  } else {
    return UNKOWN_REQUEST_INDEX;
  }
}

(function () {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch(...args);
    const responseIndex = getResponseIndex(args[0]);
    if (responseIndex != UNKOWN_REQUEST_INDEX) {
      const responseJson = await response.clone().json();
      if (!responseJson.data) {
        return response;
      }
      for (const dataItem of responseJson.data) {
        if (!dataItem.user || !dataItem.user.id) {
          continue;
        }
        statResponses[responseIndex][dataItem.user.id] = dataItem;
      }
    }
    return response;
  };
})();

function sortTable(tableBody, ascending, sortBy) {
  const rows = Array.from(tableBody.querySelectorAll("tr")).slice(1);
  rows.sort((a, b) => {
    if (sortBy === "Date") {
      const dateA = new Date(a.querySelector("td:last-child div").textContent);
      const dateB = new Date(b.querySelector("td:last-child div").textContent);
      return ascending ? dateB - dateA : dateA - dateB;
    } else if (sortBy === "Name") {
      const nameA = a
        .querySelector("td:first-child a")
        .textContent.toLowerCase();
      const nameB = b
        .querySelector("td:first-child a")
        .textContent.toLowerCase();
      return ascending
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortBy === "Stars") {
      const scoreA = parseFloat(a.getAttribute("data-score")) || 0;
      const scoreB = parseFloat(b.getAttribute("data-score")) || 0;
      return ascending ? scoreA - scoreB : scoreB - scoreA;
    } else if (sortBy === "Grade") {
      const ratingA = parseFloat(a.getAttribute("data-rating")) || 0;
      const ratingB = parseFloat(b.getAttribute("data-rating")) || 0;
      return ascending ? ratingA - ratingB : ratingB - ratingA;
    } else {
      console.warn(`Unknown sortBy: ${sortBy}`);
      return 0; // No sorting if unknown
    }
  });
  rows.unshift(tableBody.querySelector("tr"));
  tableBody.replaceChildren(...rows);
}

function addHeaderElements(statsTable, observer) {
  const headers = [
    ["Name", "Stars", "Date"],
    ["Name", "Grade", "Date"],
    ["Name", "Date"],
  ];
  for (let tableIndex = 0; tableIndex < headers.length; tableIndex++) {
    const tr = document.createElement("tr");
    tr.id = `table-header-${tableIndex}`;
    for (const header of headers[tableIndex]) {
      const td = document.createElement("td");
      const strong = document.createElement("strong");
      strong.textContent = `${header} ↕`;
      td.appendChild(strong);
      td.addEventListener("click", () => {
        const ascending = !td.classList.contains("ascending");
        td.classList.toggle("ascending", ascending);
        observer.disconnect(); // Stop observing while sorting
        const tableBody = statsTable.querySelectorAll("tbody")[tableIndex];
        sortTable(tableBody, ascending, header);
        observer.observe(statsTable, {
          childList: true,
          subtree: true,
          attributes: false,
        });
      });
      tr.appendChild(td);
    }
    const tableBody = statsTable.querySelectorAll("tbody")[tableIndex];
    tableBody.insertBefore(tr, tableBody.firstChild);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const statsTable = document.querySelector(".onx-stats-table");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      for (const node of mutation.addedNodes) {
        const responseIndex = getResponseIndexFromTrId(node.id);
        if (
          node.nodeName === "TR" &&
          responseIndex != UNKOWN_REQUEST_INDEX &&
          !node.querySelector(".date-col")
        ) {
          // Add date column to stars, ratings, and todos entries as they are added
          const td = document.createElement("td");
          td.classList.add("date-col");
          const div = document.createElement("div");
          div.className = "small";
          const userId = node.querySelector("a")?.href?.split("/").pop();
          if (!userId) {
            console.debug(node);
            console.debug("No user ID found in node:", node);
            continue;
          }
          const statResponse = statResponses[responseIndex][userId];
          const tsDate = new Date(statResponse.updatedAt);
          div.textContent =
            tsDate < UPDATED_EPOCH
              ? "pre 2017"
              : new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                }).format(tsDate);
          td.appendChild(div);
          node.appendChild(td);
          if (responseIndex === STARS_INDEX) {
            node.setAttribute("data-score", statResponse.score);
          } else if (responseIndex === RATINGS_INDEX) {
            node.setAttribute("data-rating", getRatingValue(statResponse));
          }
        } else if (node.nodeName === "DIV" && node.classList.contains("row")) {
          // Populate headers once the tables have been added
          addHeaderElements(statsTable, observer);
          // Adjust table sizing on larger screens
          node.children[STARS_INDEX].classList.replace("col-lg-2", "col-lg-3");
          node.children[RATINGS_INDEX].classList.replace(
            "col-lg-2",
            "col-lg-3"
          );
          node.children[TICKS_INDEX].classList.replace("col-lg-6", "col-lg-4");
        }
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
