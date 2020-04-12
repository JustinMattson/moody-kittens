// Data
let currentKitten = {};
let kitten = {};
let index = 0;

/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
loadKittens();

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 *
 *  * TODO prevent duplicate kittens with same name.
 */
function addKitten(event) {
  event.preventDefault();
  let form = event.target;

  let kitten = {
    id: generateId(),
    name: form.name.value,
    mood: null,
    affection: Math.ceil(Math.random() * 10),
  };

  let index = kittens.findIndex((kitten) => kitten.name == form.name.value);
  if (index < 0) {
    kittens.push(kitten);
    saveKittens();
  } else {
    alert("Kitten already exists");
  }
  setKittenMood(form.name.value);
  saveKittens();
  document.getElementById("welcome").classList.add("hidden");
  form.reset();
}

/**
 * Converts the kittens list to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  console.log("enter saveKittens()");
  window.localStorage.setItem("kittens", JSON.stringify(kittens));
  console.log("saveKittens() Success");
  drawKittens();
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens list to the retrieved array
 */
function loadKittens() {
  console.log("enter loadKittens()");
  let storedKittens = JSON.parse(window.localStorage.getItem("kittens"));
  if (storedKittens) {
    kittens = storedKittens;
  }
  console.log("loadKittens() success");
}

/**
 * Draw all of the kittens to the kittens element
 * Enhancement:
 *   Added updated affection "Ran Away!" if the kitten's mood is Gone.
 */
function drawKittens() {
  console.log("enter drawKittens()");
  let kittenListElement = document.getElementById("kitten");
  let kittensTemplate = "";

  let ranAway = "";
  let i = 0;
  console.log(kittenListElement);
  kittens.forEach((kitten) => {
    if (kitten.affection < 1 || kitten.affection == "Ran Away!") {
      ranAway = "hidden";
    }
    kittensTemplate += `
    <div class="kitten k-card bg-dark mt-1 ${kitten.mood}">
      <img src="https://robohash.org/${kitten.name}/?set=set4" alt="Moody Kitten"></i>
      
      <h3><B>Name:</B> ${kitten.name}</h3>
      <div><B>Mood:</B> ${kitten.mood}</div>
      <div><B>Affection:</B> ${kitten.affection}</div>
      
      <div class="${ranAway} d-flex space-between mt-2">
        <button class="action btn-cancel type="button" onclick="pet('${kitten.id}')">Pet</button>
        <span title="Send kitten to the pound!"><i class="action fa fa-trash text-danger" onclick="removeKittenById('${kitten.id}')"></i></span>
        <button class="action type="button" type="button" onclick="catnip('${kitten.id}')">Catnip</button>
      </div>

    </div>
    &nbsp&nbsp`;
    ranAway = "";
  });

  kittenListElement.innerHTML = kittensTemplate;
  //document.getElementById("kittens").innerHTML = kittensTemplate
  console.log("drawKittens() Success");
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  console.log("entered function findKittenById()");
  let index = kittens.findIndex((kitten) => kitten.id == id);
  if (index == -1) {
    throw new Error("Invalid Kitten Id");
  }
  return kittens.find((k) => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 *
 * Additionally:
 *  Since, when the kitten is pet, the affection is altered, the kitten.mood must be updated.
 *  Enhancement: function pet() calls setKittenMood()
 * @param {string} id
 */
function pet(id) {
  //console.log("entered function pet()");
  
  // pull the kitten array object from the kittens list.
  let kitten = findKittenById(id);
  //console.log("kitten "+ kitten);
  //console.log("kitten.mood = " + kitten.mood);
  
  /* logic to determine whether kitten likes to be pet
     + means affection++
     - means affection--
  */
  // console.log("kitten.affection before pet: " + kitten.affection)
  if (Math.random() > 0.7) {
    kitten.affection++;
  } else {
    kitten.affection--;
  }
  // console.log("kitten.affection after pet: " + kitten.affection);

  // update the kitten mood based on the updated affection
  setKittenMood(kitten);
  saveKittens();
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  //console.log("enter catnip()");
  let kittenArray = findKittenById(id);
  let index = kittens.findIndex((kitten) => kitten.id == id);
  //console.log(index);
  kittens.splice(index, 1, {
    id: kittenArray.id,
    name: kittenArray.name,
    mood: "tolerant",
    affection: 5,
  });
  //console.log("catnip() success");
  saveKittens();
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 5, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  let ranAway = "";
  kittens.forEach((kitten) => {
    //console.log("setKittenMood()")
    //console.log(kitten);
    //console.log(kitten.affection);
    if (kitten.affection <= 0) {
      kitten.mood = "gone";
      // @ts-ignore
      kitten.affection = "Ran Away!";
    } else {
      if (kitten.affection <= 3) {
        kitten.mood = "angry";
      } else {
        if (kitten.affection <= 5) {
          kitten.mood = "tolerant";
        } else {
          if (kitten.affection > 5) {
            kitten.mood = "happy";
          }
        }
      }
    }
  });
  //console.log("setKittenMood()")
  //console.log(kitten.mood);
  document.getElementById("kitten").classList.add(kitten.mood);
  saveKittens();
}

/**
 * Simply removes the splach screen and draws
 * any existing kitten from local storage.
 */
function getStarted() {
  document.getElementById("welcome").remove();
  drawKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

/**
 * This function is called with a kitten id
 * and will use the id to find and remove the
 * kitten by their id from the kittens list:
 * @param {string} kittenID
 */
function removeKittenById(kittenID) {
  let index = kittens.findIndex((kitten) => kitten.id == kittenID);
  if (index == -1) {
    throw new Error("Invalid Kitten Id");
  }
  kittens.splice(index, 1);
  console.log("removeKittenById() Success");
  saveKittens();
}

/**
 * This function simply overwrites the 
 * kittens list with an empty array,
 * and saves to local storage.
 */
function deleteAllKittens() {
  kittens = [];
  saveKittens();
  document.getElementById("welcome").remove();
}
