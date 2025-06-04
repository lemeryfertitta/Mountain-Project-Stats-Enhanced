let todos = [];
let stars = [];
let ratings = [];
const UPDATED_EPOCH = new Date("2017-04-01T00:00:00Z");

console.log("Script loaded");

(function () {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch(...args);
    const url = args[0];
    if (url.includes("todos")) {
      todos = await response.clone().json();
    } else if (url.includes("stars")) {
      stars = await response.clone().json();
    } else if (url.includes("ratings")) {
      ratings = await response.clone().json();
    }
    return response;
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const statsTable = document.getElementsByClassName("onx-stats-table")[0];
  if (statsTable) {
    console.log("Stats table found:", statsTable);
  } else {
    console.error("Stats table not found");
  }
  let todosTableLength = 0;
  let starsTableLength = 0;
  let ratingsTableLength = 0;
  const observer = new MutationObserver((mutationsList, observer) => {
    console.log("Mutation observed");
    console.log(statsTable);
    const starsTable =
      statsTable.children[0].children[0].querySelector("tbody");
    const prevStarsTableLength = starsTableLength;
    starsTableLength = starsTable.children.length;
    const ratingsTable =
      statsTable.children[0].children[1].querySelector("tbody");
    const prevRatingsTableLength = ratingsTableLength;
    ratingsTableLength = ratingsTable.children.length;
    const todosTable =
      statsTable.children[0].children[2].querySelector("tbody");
    const prevTodosTableLength = todosTableLength;
    todosTableLength = todosTable.children.length;
    console.log("ratingsTableLength:", ratingsTableLength);
    if (ratingsTable && ratingsTableLength > prevRatingsTableLength) {
      for (const rating of ratings.data) {
        const userId = rating.user.id;
        const ts = rating.updatedAt;
        const userAnchor = ratingsTable.querySelector(
          `a[href='/user/${userId}']`
        );
        if (userAnchor) {
          const td = document.createElement("td");
          const div = document.createElement("div");
          div.className = "small text-nowrap";
          const tsDate = new Date(ts);
          div.textContent =
            tsDate < UPDATED_EPOCH
              ? "pre 2017"
              : new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                }).format(new Date(ts));
          td.appendChild(div);
          userAnchor.parentElement.parentElement.appendChild(div);
          userAnchor.parentElement.parentElement.children[1].classList.add(
            "text-nowrap"
          );
        }
      }
    } else {
      console.error("Ratings table not found");
    }
  });

  if (statsTable) {
    console.log("Stats table found, setting up observer");
    observer.observe(statsTable, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
});
