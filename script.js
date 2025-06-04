let stat_responses = [[], [], []];
const STARS_INDEX = 0;
const RATINGS_INDEX = 1;
const TODOS_INDEX = 2;
const UPDATED_EPOCH = new Date("2017-04-01T00:00:00Z");

console.log("Script loaded");

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

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const statsTable = document.getElementsByClassName("onx-stats-table")[0];
  if (statsTable) {
    console.log("Stats table found:", statsTable);
  } else {
    console.error("Stats table not found");
  }
  let tableLengths = [0, 0, 0];
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let statIndex = 0; statIndex < stat_responses.length; statIndex++) {
      const tableBody =
        statsTable.children[0].children[statIndex].querySelector("tbody");
      const prevLength = tableLengths[statIndex];
      const currentLength = tableBody.children.length;
      tableLengths[statIndex] = currentLength;
      if (tableBody && currentLength > prevLength) {
        for (const stat of stat_responses[statIndex].data) {
          const userId = stat.user.id;
          const ts = stat.updatedAt;
          const userAnchor = tableBody.querySelector(
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
    console.log("Stats table found, setting up observer");
    observer.observe(statsTable, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
});
