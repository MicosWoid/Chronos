let ISBULKLOCATOR = false;


// Get data from ripe API and send dummy data if something does wrong
async function getresource(resource){

    try {
        const response = await fetch(`https://stat.ripe.net/data/maxmind-geo-lite/data.json?resource=${resource}`);

        const data = await response.json();

        return data;
    }

    catch {
        return {
"messages": [],
"see_also": [],
"version": "1.0",
"data_call_name": "maxmind-geo-lite",
"data_call_status": "supported",
"cached": false,
"data": {
"located_resources": [
{
"resource": "1.2.3.4/32",
"locations": [
    {
        "country": "AU",
        "city": "",
        "resources": [
            "1.2.3.0/24"
        ],
        "latitude": -33.494,
        "longitude": 143.2104,
        "covered_percentage": 100.0
    }
],
"unknown_percentage": 0
}
],
"unknown_percentage": {
"v4": 0.0
},
"parameters": {
"resource": "1.2.3.4/32",
"resolution": "raw",
"cache": null
}
},
"process_time": 15,
"server_id": "app128",
"status": "ok",
"status_code": 200,

};
    }

}

// Generate row for table
function td(name, value) {return `<tr><td>${name}</td><td>${value}</td></tr>`;}

// Grab elements
let map = document.getElementById("map");
let mapholder = document.getElementById("mapholder");
let mapclosebutton = document.getElementById("closemap");

// Add button that removes visibility and resets url
mapclosebutton.onclick = () => {

    mapholder.style = "visibility: hidden;";
    ignorechange = true;
    window.location.replace(window.location.href.split("#")[0]);

}

// Window location -> URL, ignore change makes it so that the interval does not do anything when the url changes
let windowloc = window.location.href;
let ignorechange = false;

// Monitor a URL change every 500 MS and if the url did change open a zoomed in ARCGIS map of area
setInterval(() => {
    if (windowloc != window.location.href) {
        if (ignorechange) { ignorechange=false; return; }
        mapholder.style = "visibility: visible";
        map.src = `https://www.arcgis.com/apps/View/index.html?extent=${window.location.href.split("#")[1]},${window.location.href.split("#")[1]}`
        windowloc = window.location.href;
    }
}, 500);

// Check if mulk locator element exists and if so run bulk locator code if not run regular locator code
if (document.getElementById("bulklocator") != null){

    // the function for when the locate button is pressed
    document.getElementById("locatebutton").onclick = () => {

        // clear any extra data
        document.getElementById("tableel").innerHTML = "";

        // enumerate through every IP
        document.getElementById("ip").value.split("\n").forEach(ip => {

            // wait for request to finish *then* use data
            getresource(ip).then((data) => {
            const long = data.data.located_resources[0].locations[0].longitude;
            const lat = data.data.located_resources[0].locations[0].latitude;
            const percent = data.data.located_resources[0].locations[0].covered_percentage;
            const city = data.data.located_resources[0].locations[0].city;
            const country = data.data.located_resources[0].locations[0].country;
            const resource = data.data.located_resources[0].locations[0].resources[0];
            const resolution = data.data.parameters.resolution;

            // extract data from json

            // Turn data into a table
            let tabledata = `<br><table class="tablestyle">
                ${td("Longitude", long)}
                ${td("Latitude", lat)}
                ${td("Coverage (Percent)", percent)}
                ${td("City", city != "" ? city : "City Not Found")}
                ${td("Country", country)}
                ${td("Resource", resource)}
                ${td("Resolution Used", resolution)}
                ${td("View Map", `<a href="bulkiplocator.html#${long}, ${lat}">Click (bookmark href)</a>`)} 
            </table>`; // href for monitor to pick up on then show map

            // add table into list
            document.getElementById("tableel").innerHTML += tabledata;
        })

        
    })};
}

else {
    // the function for when the locate button is pressed
    document.getElementById("locatebutton").onclick = () => {
        // enumerate through every IP
        getresource(document.getElementById("ip").value).then((data) => {
            const long = data.data.located_resources[0].locations[0].longitude;
            const lat = data.data.located_resources[0].locations[0].latitude;
            const percent = data.data.located_resources[0].locations[0].covered_percentage;
            const city = data.data.located_resources[0].locations[0].city;
            const country = data.data.located_resources[0].locations[0].country;
            const resource = data.data.located_resources[0].locations[0].resources[0];
            const resolution = data.data.parameters.resolution;
            // extract data from json

            // Turn data into a table
            let tabledata = `<br><table class="tablestyle">
                ${td("Longitude", long)}
                ${td("Latitude", lat)}
                ${td("Coverage (Percent)", percent)}
                ${td("City", city != "" ? city : "City Not Found")}
                ${td("Country", country)}
                ${td("Resource", resource)}
                ${td("Resolution Used", resolution)}
                ${td("View Map", `<a href="iplocator.html#${long}, ${lat}">Click (bookmark href)</a>`)}
            </table>`;

            // Set table data
            document.getElementById("table").innerHTML = tabledata;
        })

        
    }

}
