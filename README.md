# Mountain Project - Stat Dates

This is a simple Chrome extension that adds dates to the stars, grades, and todos on the stats page of any Mountain Project route.

## Details

The API calls which populate these stats already return this information in the form of createdAt and updatedAt timestamps. This information can be useful when trying to understand what time of year a route is typically climbed or what the trajectory of grade/quality is over time. For example, climbs may change due to breakage, new beta, polish, etc. and these events can be observed by refernecing the timestamps in the stats. Another nice feature is seeing which people have added the route to their TODO list more recently to have more luck with partner finding.

NOTE: It appears that MP did not record these timestamps prior to March 2017, so any timestamps marked with that date are relabelled as "pre 2017" for simplicity, though they could be from any date Jan-Mar 2017 or earlier
