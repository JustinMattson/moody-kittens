// Data
let currentAffection = 5
let currentMood = "Tolerant"
let currentKitten = {}

/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
let kitten = [];
loadKittens()

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let form = event.target

  let kitten = {
    id: generateId(),
    name: form.name.value,
    mood: currentMood,
    affection: currentAffection
  }
  kittens.push(kitten)
  console.log(kitten)
  saveKittens()
  form.reset()
  drawKittens()
}

console.log(JSON.parse(window.localStorage.getItem("kittens")))

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  console.log("saveKittens() Success")
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let storedKittens = JSON.parse(window.localStorage.getItem("kittens"))
  if(storedKittens){
    kittens=storedKittens
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittenListElement = document.getElementById("kittens")
  let kittensTemplate = ""
  kittens.forEach(kitten => {
    kittensTemplate += `
    <div class="k-card  bg-dark mt-1 mb-1 img src="https://robohash.org/${kitten.name}/?set=set4" alt="Moody Kitten">
      <img src="https://robohash.org/${kitten.name}/?set=set4" alt="Moody Kitten"></i>
      <font color=#fdfdfd>
        <h3 ><B>Name:</B> ${kitten.name}</h3>
        <div><B>Mood:</B> ${kitten.mood}</div>
        <div><B>Affection:</B> ${kitten.affection}</div>
      </font>
      <div class="d-flex space-between mt-2">
        <button class="action btn-cancel type="button" onclick="pet('${kitten.id}')">Pet</button>
        <i class="action fa fa-trash text-danger" onclick="removeKittenById('${kitten.id}')"></i>
        <button class="action type="button" type="button" onclick="catnip('${kitten.id}')">Catnip</button>
        </div>
    </div>
    &nbsp`
  })
  kittenListElement.innerHTML = kittensTemplate
  //document.getElementById("kittens").innerHTML = kittensTemplate
  console.log("drawKittens() Success")
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
  console.log("kitten.id");
  }

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  console.log("pet function activated")

  console.log(affectionElement)
  console.log(id)
  console.log(kittens)  // found the correct kitten in kittens...
 
  console.log("kitten updated")
  saveKittens()
}



/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  switch (findKittenById(kitten.affection)) {
  case kitten.affection <= 0:
    kitten.mood = "Gone";
    break;
  case kitten.affection <= 3:
    kitten.mood = "Angry";
    break;
  case kitten.affection <= 5:
    kitten.mood = "Tolerant";
    break;
  case kitten.affection >= 6: // simply > 6 omits 6 from the mood scale
    kitten.mood = "Happy";
  }

}

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
*  This function is called with a kitten id
* and will use the id to find and remove the
* kitten by their id from the list of kittens:
* @param {string} kittenID
*/
function removeKittenById(kittenID) {
  let index = kittens.findIndex(kitten => kitten.id == kittenID)
  if (index == -1) {
    throw new Error("Invalid Kitten Id")
  }
  console.log(kitten)
  kittens.splice(index,1)
  console.log("removeKittenById() Success")
  saveKittens()
}