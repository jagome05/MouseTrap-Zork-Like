const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

start();

class Location {
  constructor(name, description) {
    this.name = name
    this.description = description
  }
}

let home = new Location('home', 'Hello')
let roomTwo = new Location('roomTwo', 'Hello')
let roomThree = new Location('Third Room', 'Hello')
let roomFour = new Location('Fourth Room', 'Hello')
let hallway = new Location('Hallway', 'Hello')
let roomFive = new Location('Last Room?', 'Hello')

let locationCurrent = 'home';
  
  let locationLookUp = {
    'home': home,
    'roomTwo': roomTwo,
    'Third Room': roomThree,
    'Fourth Room': roomFour,
    'Hallway': hallway,
    'Last Room?': roomFive,
  }

  let locationStates = {
    home: ['roomTwo', 'Third Room'],
    roomTwo: ['home'],
    roomThree:['home','roomFour'],
    roomFour: ['roomThree','hallway'],
    hallway: ['roomFive'],
    roomFive: [],
  }

  function moveLocationFx(newLocation) {
    if (locationStates[locationCurrent].includes(newLocation)) {
      locationCurrent = newLocation
      return console.log(locationLookUp[locationCurrent].description)
    } else {
      return console.log(`cannot go from ${locationCurrent} to ${newLocation}`)
    }
  }
  
  let playerInventory = {
    items: 'Boop',
  }
  
  //possible actions for players to use -> can refer with action:help
  let playerAction = {
    help: 'Boop,',
    move: 'Boop',
    use:'Boop',
    look:'Boop',
    read:'Boop',
    take:'Boop',
    drop:'Boop',
  }
  
  //list of all items
  const allRoomItems = {

  }
  async function start() {
    const welcomeMessage = `182 Main St.
  You are standing on Main Street between Church and South Winooski.
  There is a door here. A keypad sits on the handle.
  On the door is a handwritten sign.`
  ;
    let answer = await ask(welcomeMessage);
    console.log('Now write your code to make this work!');

  
  process.exit();
}
