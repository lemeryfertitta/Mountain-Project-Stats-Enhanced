# ![icon](media/icon-32.png) Mountain Project Stats Enhanced

This is a simple Chrome extension that adds dates to the stars, grades, and todos on the stats page of any Mountain Project route. Additionally, this extension allows for all of the tables on the stats page to be sorted by any column.

![screenshot](media/screenshot.jpg)

## Installation

Add the extension to your Chrome browser from the [extension page](https://chromewebstore.google.com/detail/mountain-project-stats-en/cmlpgcdikcefgegfgehkhmigmcjocgka) or by cloning/downloading this repository and [adding it manually](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

## Use Cases

- Determining what time of year a route is climbed when tick data is insufficient
- Noticing trends in quality or difficulty over time, e.g. due to a climb breaking at some point
- Determining recency of TODO list additions for partner finding
- Quickly viewing the min/max grade or star ratings using the new sorting functionality
- Grouping ticks alphabetically to see someone's history on a route if they use multiple ticks

## Known Issues

- MP did not appear to record timestamps prior to certain dates in 2017 depending on the data, so any timestamps marked with that date are relabelled with e.g. "≤ Mar 2017" for simplicity. Those entries could be from any date Mar 2017 or earlier.
- MP paginates stats pages with large numbers of entries. The sorting feature will only consider the loaded entries, so routes with paginated tables will not be correctly sorted until the whole table has been loaded manually by scrolling and clicking "Show More" repeatedly.
- Sorting by grades on routes which use multiple grading systems (i.e. 5.12c V6) will usually not work correctly, as the sorting function just picks the first grade it sees.
