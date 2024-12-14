import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase,set,get,ref } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_-qo0WsSHNqIKUHZRVGbNc5O6J8BGepk",
  authDomain: "eventsnearme-f850f.firebaseapp.com",
  projectId: "eventsnearme-f850f",
  storageBucket: "eventsnearme-f850f.firebasestorage.app",
  messagingSenderId: "988853404409",
  appId: "1:988853404409:web:ab116a507352fe1f789828",
  databaseURL:"https://eventsnearme-f850f-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let db = getDatabase(app);


//filter values 
let EventNameElem = document.getElementById("fname");
let EventCategoryElem = document.getElementById("EventCategory");
let EventPinCode = document.getElementById("EventPinCode");
let EventStartDate = document.getElementById("EventStartDate");
let SearchResultContainer = document.getElementById("Searchresult");
let seeAllEventBtn = document.getElementById("SeeAllEvents");
let SaveEventsBtn = document.getElementById("SaveEvents");
let EventsData = [];

// function GetAllData(){
//     const userRef =ref(db,'Events');
//     get(userRef).then((snapshot)=>{
//         snapshot.forEach(childSnaps  => {
//             console.log(childSnaps.val());
//         });
//     });
// }

seeAllEventBtn.addEventListener("click",()=>{
    GetAllData();
});

SaveEventsBtn.addEventListener("click",()=>{
    if(EventsData ==[]){
        GetAllData();
        createCSVDownload(EventsData);
    }
    else{
        
        createCSVDownload(EventsData);
    }
});


function GetFilteredData(){
    
}

function GetAllData() {
    const userRef = ref(db, 'Events');

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach(childSnaps => {
                const eventData = childSnaps.val();
                console.log(childSnaps);
                EventsData.push(eventData); // Save data to EventsData array
                console.log(eventData);
                
                // Create a new div for each event
                const eventDiv = document.createElement("div");
                eventDiv.className = "Events";

                // Add event details as inner HTML
                eventDiv.innerHTML = `
                    <h3>${childSnaps.key}</h3>
                    <p><strong>Pincode:</strong> ${eventData.EventPincode}</p>
                    <p><strong>LatLong:</strong> ${eventData.EventLatLong}</p>
                    <p><strong>Category:</strong> ${eventData.EventCategory}</p>
                    <p><strong>Start Date:</strong> ${eventData.EventStartDate}</p>
                    <p><strong>Start Time:</strong> ${eventData.EventStartTime}</p>
                    <p><strong>End Date:</strong> ${eventData.EventEndDate}</p>
                    <p><strong>End Time:</strong> ${eventData.EventEndTime}</p>
                `;

                // Append the div to the SearchResultContainer
                SearchResultContainer.appendChild(eventDiv);
            });
        } else {
            SearchResultContainer.innerHTML = "<p>No events found.</p>";
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
}



function createCSV(data) {
    // Create the CSV header
    const header = ["WKT", "name", "description"];
    
    // Create rows from event data
    const rows = data.map(event => {
        // Format the EventLatLong as POINT (longitude latitude)
        const latLong = event.EventLatLong.split(',').map(coord => coord.trim()); // Splitting the lat, long by comma
        const point = `POINT (${latLong[1]} ${latLong[0]})`; // Reversed order: longitude first, then latitude

        // Create description with the remaining event details
        const description = `
            Pincode: ${event.EventPincode}
            Category: ${event.EventCategory}
            Start Date: ${event.EventStartDate}
            Start Time: ${event.EventStartTime}
            End Date: ${event.EventEndDate}
            End Time: ${event.EventEndTime}
        `.trim(); // Remove extra whitespace
        
        // Return the row with the appropriate structure
        return [point, event.EventName, description];
    });

    // Combine header and rows
    const csvData = [header, ...rows].map(row => row.join(",")).join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // Create a link element for downloading the CSV file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "events_data.csv";

    // Create the new tab with instructions
    const newTab = window.open('', '_blank');
    newTab.document.write(`
        <html>
        <head>
            <title>Download Instructions</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                h1 {
                    color: #333;
                }
                ol {
                    font-size: 16px;
                }
                li {
                    margin: 10px 0;
                }
                .btn {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    margin-top: 20px;
                }
                .btn:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h1>How to Use the CSV with Google Maps</h1>
            <ol>
                <li>Download the CSV file</li>
                <li>Open the URL - <a href="https://www.google.com/maps/d/" target="_blank">https://www.google.com/maps/d/</a></li>
                <li>Click to create a new map</li>
                <li>Click Import and import the CSV file you saved</li>
                <li>All the events will be added to your Google map and can be seen on the URL:
                    <br>
                    <a href="https://www.google.com/maps/@28.7309824,77.1260416,12z/data=!4m2!10m1!1e4?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank">
                        View your map here
                    </a>
                </li>
            </ol>
            <a href="${link.href}" download class="btn">Download CSV</a>
        </body>
        </html>
    `);

    // Close the document and trigger the download in the new tab after a delay
    setTimeout(() => {
        newTab.document.close(); // Ensure the content is fully loaded
        newTab.location.reload(); // Force reload to allow the download to trigger
    }, 100);
}


function createCSVworks(data) {
    // Create the CSV header
    const header = ["WKT", "name", "description"];
    
    // Create rows from event data
    const rows = data.map(event => {
        // Format the EventLatLong as "POINT (longitude latitude)"
        const latLong = event.EventLatLong.split(',').map(coord => coord.trim()); // Splitting lat/long
        const point = `"POINT (${latLong[1]} ${latLong[0]})"`; // Correct order: longitude first, then latitude

        // Use the EventName for the name column
        const name = event.EventName;

        // Combine other details into a description
        const description = `
            Pincode: ${event.EventPincode},
            Category: ${event.EventCategory},
            Start Date: ${event.EventStartDate},
            Start Time: ${event.EventStartTime},
            End Date: ${event.EventEndDate},
            End Time: ${event.EventEndTime}
        `.replace(/\s+/g, ' ').trim(); // Flatten into one line

        // Return the row with the corrected structure
        return [point, name, description];
    });

    // Combine header and rows into a CSV string
    const csvData = [header, ...rows].map(row => row.join(",")).join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // Create a URL for the CSV blob
    const csvURL = URL.createObjectURL(blob);

    // Create the static HTML content with the download link
    const htmlContent = `
        <html>
        <head>
            <title>Download Instructions</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                h1 {
                    color: #333;
                }
                ol {
                    font-size: 16px;
                }
                li {
                    margin: 10px 0;
                }
                .btn {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    margin-top: 20px;
                }
                .btn:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h1>How to Use the CSV with Google Maps</h1>
            <ol>
                <li>Download the CSV file</li>
                <li>Open the URL - <a href="https://www.google.com/maps/d/" target="_blank">https://www.google.com/maps/d/</a></li>
                <li>Click to create a new map</li>
                <li>Click Import and import the CSV file you saved</li>
                <li>All the events will be added to your Google map and can be seen on the URL:
                    <br>
                    <a href="https://www.google.com/maps/@28.7309824,77.1260416,12z/data=!4m2!10m1!1e4?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank">
                        View your map here
                    </a>
                </li>
            </ol>
            <a href="${csvURL}" download="events_data.csv" class="btn">Download CSV</a>
        </body>
        </html>
    `;

    // Create a Blob for the static HTML content
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

    // Create a URL for the HTML blob
    const htmlURL = URL.createObjectURL(htmlBlob);

    // Open the new tab with the instructions and download link
    window.open(htmlURL, '_blank');
}


function createCSVDownload(data) {
    // Create the CSV header
    const header = ["WKT", "name", "description"];
    
    // Create rows from event data
    const rows = data.map(event => {
        // Format the EventLatLong as "POINT (longitude latitude)"
        const latLong = event.EventLatLong.split(',').map(coord => coord.trim()); // Splitting lat/long
        const point = `"POINT (${latLong[1]} ${latLong[0]})"`; // Correct order: longitude first, then latitude

        // Use the EventName for the name column
        const name = event.EventName;

        // Combine other details into a description
        const description = `"Pincode: ${event.EventPincode}, Category: ${event.EventCategory}, Start Date: ${event.EventStartDate}, Start Time: ${event.EventStartTime}, End Date: ${event.EventEndDate}, End Time: ${event.EventEndTime}"`;

        // Return the row with the corrected structure
        return [point, name, description];
    });

    // Combine header and rows into a CSV string
    const csvData = [header, ...rows].map(row => row.join(",")).join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // Create a URL for the CSV blob
    const csvURL = URL.createObjectURL(blob);

    // Create the static HTML content with the download link
    const htmlContent = `
        <html>
        <head>
            <title>Download Instructions</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                h1 {
                    color: #333;
                }
                ol {
                    font-size: 16px;
                }
                li {
                    margin: 10px 0;
                }
                .btn {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    margin-top: 20px;
                }
                .btn:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h1>How to Use the CSV with Google Maps</h1>
            <ol>
                <li>Download the CSV file</li>
                <li>Open the URL - <a href="https://www.google.com/maps/d/" target="_blank">https://www.google.com/maps/d/</a></li>
                <li>Click to create a new map</li>
                <li>Click Import and import the CSV file you saved</li>
                <li>All the events will be added to your Google map and can be seen on the URL:
                    <br>
                    <a href="https://www.google.com/maps/@28.7309824,77.1260416,12z/data=!4m2!10m1!1e4?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank">
                        View your map here
                    </a>
                </li>
            </ol>
            <a href="${csvURL}" download="events_data.csv" class="btn">Download CSV</a>
        </body>
        </html>
    `;

    // Create a Blob for the static HTML content
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

    // Create a URL for the HTML blob
    const htmlURL = URL.createObjectURL(htmlBlob);

    // Open the new tab with the instructions and download link
    window.open(htmlURL, '_blank');
}











