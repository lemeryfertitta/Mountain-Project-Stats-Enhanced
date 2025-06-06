# Mountain Project Stats Enhanced

This is a simple Chrome extension that adds dates to the stars, grades, and todos on the stats page of any Mountain Project route and makes these tables sortable by any column. The sizing of the columns on large screens is slightly adjusted to accomodate this additional info.

## Use Cases

- Determining what time of year a route is climbed when tick data is insufficient
- Noticing trends in quality or difficulty over time, e.g. due to a climb breaking at some point
- Determining recency of TODO list additions for partner finding
- Quickly viewing the min/max grade or star ratings using the new sorting functionality

## Known Issues

- MP did not appear to record timestamps prior to March 2017, so any timestamps marked with that date are relabelled as "pre 2017" for simplicity. Those entries could be from any date Mar 2017 or earlier.
- MP paginates stats pages with large numbers of entries. This makes the sorting feature fairly useless on paginated tables until the whole table has been loaded manually by scrolling and clicking "Show More" repeatedly.
- Sorting by grades on routes which use multiple grading systems (i.e. 5.12c V6) will not always work correctly, as the sorting function just picks the first grade it sees.
