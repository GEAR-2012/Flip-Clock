/************************************************************
 * INITIAL VARIABLES - SECTION
 */

let actualTextArr = [];
let newTextArr = [];
let timeFormat24 = false;
let flipFallingTimeInterval = 700; // in milliseconds, must be same as in the CSS

/* INITIAL VARIABLES - SECTION END */

/************************************************************
 * GET DOM ELEMENTS - SECTION
 */

/*
- making the 'flips on wheels' nested array;
    - it will hold each flips on each wheels.
- get each wheels into an array;
- get each flips from each wheels as an array & and push each array into the main array
So this way we have a nested array with wheels and flips
*/
let flipsOnWheels = [];
let wheels = document.querySelectorAll("#wheel-container-1 > .wheel");
wheels.forEach((item) => {
  let flips = [...item.querySelectorAll(".flip")];
  flipsOnWheels.push(flips);
});

// clock body
let clockBody = document.querySelector(".flip-clock");
// time format switch
let tfs = document.querySelector(".tfs-chk-box");
// time format display window (it contains the 'slider')
let prefixWin = document.querySelector(".prefix-win");
// time format display text slider (it contains the 'AM' & 'PM' texts)
let prefixSlider = document.querySelector(".prefix-slider");

/* GET DOM ELEMENTS - SECTION END */

/************************************************************
 * MAKING THE STARTER TEXT SET - SECTION
 */

// get numbers to display
let date = new Date();
// get hours
if (timeFormat24 === true) {
  actualTextArr.push(padding(date.getHours()));
} else if (timeFormat24 === false) {
  actualTextArr.push(hour24to12(date.getHours()).hour.toString());
}
// get minutes
actualTextArr.push(padding(date.getMinutes()));
// get seconds
actualTextArr.push(padding(date.getSeconds()));

/* MAKING THE STARTER TEXT SET - SECTION END */

/************************************************************
 * INITIALISATION - SECTION
 */

initSet();
toggleClockBodyVisibility(); // switch off the clock body

/* INITIALISATION - SECTION END */

/************************************************************
 * INPUT FROM CLIENT - SECTION
 */
// toggle clock body visibility
clockBody.onclick = function () {
  toggleClockBodyVisibility();
};

// changes time format 12/24
tfs.onchange = function () {
  timeFormat24 = tfs.checked;
  initSet();
};

/* INPUT FROM CLIENT - SECTION END */

/************************************************************
 * UPDATE - SECTION
 */

// check for newer numbers in every 100 milliseconds:
setInterval(function () {
  let date = new Date();
  newTextArr = [];
  // get hours
  if (timeFormat24 === true) {
    // if time format '24h'
    newTextArr.push(padding(date.getHours()));
  } else if (timeFormat24 === false) {
    // if time format '12h'
    newTextArr.push(hour24to12(date.getHours()).hour.toString());
  }
  // get minutes
  newTextArr.push(padding(date.getMinutes()));
  // get seconds
  newTextArr.push(padding(date.getSeconds()));

  flipsOnWheels.forEach((wheel, index) => {
    changeChecker(index, newTextArr[index], wheel);
  });
}, 100);

/* UPDATE - SECTION END */

/************************************************************
 * FUNCTIONS - SECTION
 */

// sets everything to its initial state
function initSet() {
  // change the text on the switch
  // show or hide prefix window as required
  if (timeFormat24) {
    // tfsTxt.textContent = "24";
    prefixWin.classList.add("prefix-win-off");
    prefixWin.classList.remove("prefix-win-on");
  } else {
    // tfsTxt.textContent = "12";
    prefixWin.classList.add("prefix-win-on");
    prefixWin.classList.remove("prefix-win-off");
  }

  // set up each flips on each wheels to they initial positions
  flipsOnWheels.forEach((wheel) => {
    initFlips(wheel);
  });
  // display the initial number
  flipsOnWheels.forEach((wheel, index) => {
    refreshFlips(wheel, actualTextArr[index], actualTextArr[index]);
  });
}

// compare the new & actual text array for changed items
function changeChecker(index, newItem, wheel) {
  // get the previous number
  let actualItem = actualTextArr[index];
  // check if the actual number not same than the previous number
  if (actualItem !== newItem) {
    actualTextArr[index] = newItem;
    rotateWheel(wheel, actualItem, actualTextArr[index]);
    switchTimePrefix();
  }
}

// controls the time prefix slider
function switchTimePrefix() {
  let tf = hour24to12(date.getHours()).pre;
  if (tf === "AM") {
    prefixSlider.classList.remove("prefix-slider-up");
  } else if (tf === "PM") {
    prefixSlider.classList.add("prefix-slider-up");
  }
}

/*
- makes a full cycle on a wheel (update)
- parameters:
  - wheel = wheel to turn
  - textOld = it will be covered by the flip which one will rotate down
  - textNew = it will be visible after the flip rotated down
*/
function rotateWheel(wheel, textOld, textNew) {
  // phase 1, interval: 'X'ms
  refreshFlips(wheel, textNew, textOld);
  turnDown(wheel);
  // phase 2, timed after phase1
  setTimeout(function () {
    quickUp(wheel);
    shiftArray(wheel);
  }, flipFallingTimeInterval + 50);
}

// turn down slowly the upper front flip on a wheel
function turnDown(wheel) {
  wheel.forEach((elem) => {
    elem.classList.remove("bring-front");
  });
  wheel[1].classList.add("bring-front");
  wheel[1].classList.remove("quick-up");
  wheel[1].classList.add("turn-down");
}

// turn up quickly the bottom back flip on a wheel
function quickUp(wheel) {
  wheel[0].classList.remove("quick-down");
  wheel.forEach((elem) => {
    elem.classList.add("bring-front");
  });
  wheel[0].classList.remove("bring-front");
  wheel[0].classList.remove("turn-down");
  wheel[0].classList.add("quick-up");
}

// shifts all elements in an array forward
function shiftArray(arr) {
  let toShift = arr.shift();
  arr.push(toShift);
}

// display the the new & old text on the text holders (span elements) on the flips
function refreshFlips(arr, newText, oldText) {
  // get each flip's span element as text holders
  // Front => front-side, Back => back-side
  // flip a positioned: down & front
  let aFront = arr[0].children[0].firstElementChild;
  let aBack = arr[0].children[1].firstElementChild;
  // flip b positioned: up & front
  let bFront = arr[1].children[0].firstElementChild;
  let bBack = arr[1].children[1].firstElementChild;
  // flip c positioned: up & back
  let cFront = arr[2].children[0].firstElementChild;
  let cBack = arr[2].children[1].firstElementChild;
  // Update text holders:
  // up & front
  bFront.innerHTML = oldText;
  // donw & front
  aBack.innerHTML = oldText;
  // up & front
  bBack.innerHTML = newText;
  // up & back
  cFront.innerHTML = newText;
}

// set the flips on a wheel to the start
function initFlips(wheel) {
  // flip down the first 'flip-inner'
  wheel[0].classList.add("quick-down");
  // bring two flips to the front
  wheel[0].classList.add("bring-front");
  wheel[1].classList.add("bring-front");
}

// padding a character
function padding(char) {
  char = char.toString().padStart(2, "0");
  return char;
}

// 24 hour time format to 12 hour time format
// parameter: hour(int)
// returns an object {pre, hour}
function hour24to12(hour) {
  let pre = "AM";

  if (hour >= 12) {
    pre = "PM";
    hour -= 12;
  }

  if (hour === 0) {
    hour = 12;
  }

  return { pre: pre, hour: hour };
}

// toggle clock body visibility
function toggleClockBodyVisibility() {
  // body
  clockBody.classList.toggle("hide-clock-body");
  // brand / title
  let brand = clockBody.querySelector(".title");
  console.log(brand);
  brand.classList.toggle("no-bottom-margin");
  // display edge blur
  let display = clockBody.querySelector(".wheel-container");
  console.log(display);
  display.classList.toggle("no-box-shadow");
  // legs
  let legs = clockBody.querySelectorAll(".leg");
  legs.forEach((leg) => {
    leg.classList.toggle("hide");
  });
  // match the background-color of the main flip-clock container to the background-color of the display
  // * optional
  // clockBody.parentElement.classList.toggle("bg-color-black");
}

/* FUNCTIONS - SECTION END */
