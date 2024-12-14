// cannot work with automation as its server side in node js
//import puppeteer from 'puppeteer';

// async function StartAutomation(params) {
//     const browser = await puppeteer.launch({headless:false});
// const page = await browser.newPage();
// await page.waitForTimeout(5000);
// await page.goto('https://www.google.com/maps');
// }

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
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
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let database = app.database()

let savebutton = document.querySelector(".savebutton");
let statusUpdate = document.querySelector("h3");

let h1Text = document.querySelector("h1");

function SaveEventData() {
  statusUpdate.innerText = "Status : Saving Data ";
  let EventName = document.getElementById("fname").value;
  let EventPincode = document.getElementById("EventPinCode").value;
  let EventLatLong = document.getElementById("EventLatLong").value;
  let EventStartDate = document.getElementById("EventStartDate").value;
  let EventStartTime = document.getElementById("EventStartTime").value;
  let EventCategory = document.getElementById("EventCategory").value;
  let EventEndDate = document.getElementById("EventEndDate").value;
  let EventEndTime = document.getElementById("EventEndTime").value;
  database.ref('Events/'+ EventName).set({
    EventPincode:EventPincode,
    EventLatLong:EventLatLong,
    EventCategory:EventCategory,
    EventStartDate:EventStartDate,
    EventStartTime:EventStartTime,
    EventEndDate:EventEndDate,
    EventEndTime:EventEndTime
  })
  alert("Event Saved");
  statusUpdate.innerText = "Status : Event Saved";
}

savebutton.addEventListener("click", () => {
  SaveEventData();
  console.log("done");
});
