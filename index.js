const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

start();

class Location {
  constructor(name, description, look) {
    this.name = name
    this.description = description
    this.look = look
  }
}

//possible actions for players to use -> can refer with action: help
let playerActionHelp = {
  help: `Type 'help' to see type commands you can perform`,
  move: `Typing 'move [direction]' will allow you to move between rooms`,
  use: `Typing 'use [item]' in a specific room will allow you to interact with certain objects`,
  look: `Typing 'look' will give you a description of the room and possible objects in the room you may interact with`,
  read: `Typing 'read [item]' will allow you to read certain text on an object`,
  inventory: `Typing 'inventory' will allow the player to look at current items they hold`,
  take: `Typing 'take [item]' will allow you to take certain items and keep them in your inventory to possibly use them later`,
  drop: `Typing 'drop [item]' will drop an item and it will leave your inventory`,
}

let home = new Location('home', 
'In the room you are in there is a sign. You look around and there is one hole in the room to the north. You look through the hole but darkness covers the beyond. \nThere are two locked doors to the west and south.',
'There is nothing else in the room. ')
let roomTwo = new Location('roomTwo', 
`You slowly move towards the hole. 
You enter and its another room. There are no other holes besides the one you came from. `,
`You look around the room. There is a piece of paper on the ground. `)
let roomThree = new Location('roomThree', 
`You walk hesitantly towards the hole. You take a step in and notice a room with a door on the other side of the room. `,
`You see a locked door to the west. There is also a shovel on the floor. `)
let roomFour = new Location('roomFour', 
`You walk in. There is a giant boulder in the room. `,
`There is a boulder in the room. You peek behind it and there appears to be a hallway. You cannot squeeze through it though. `)
let hallway = new Location('hallway', 
`Past the bolder is a long hallway. It extends into darkness. You make your way down the hallway. You keep your hand along the cobblestone wall to guide you. 
After awhile you've lost track of your steps. When will you reach another room, a door, light? You see nothing. All you hear are your breaths. They become heavier the more you think about being stuck in this hallway. 
Fear hits you. `,
`You cannot see anything. `)
let roomFive = new Location('Last Room?', 
`Eventually you see light. You rush over with your tiny legs. It is a gigantic room. There is blinding light coming from above, and as you try to look into the distance everything becomes blurry. `,
`You look around but it is hard to see. There appears to be giant  pieces of broken glass on the floor in front of you. Near the pieces of glass are ponds of colorful liquids. One is red liquid, the other is blue liquid.`)

let locationCurrent = 'home';

let closedDoors = {
  doorOne: 'closed',
  doorTwo: 'closed',
  boulder: 'closed',
}
  
// key is.... value is the 'Location" object --> use locationLookUp[locationCurrent].description for look
const locationLookUp = {
  'home': home,
  'roomTwo': roomTwo,
  'roomThree': roomThree,
  'roomFour': roomFour,
  'hallway': hallway,
  'roomFive': roomFive,
}

//state machine that defines which rooms the player can move to/from
const locationStates = {
  home: ['roomTwo', 'roomThree'],
  roomTwo: ['home'],
  roomThree:['home','roomFour'],
  roomFour: ['roomThree','hallway'],
  hallway: ['roomFive'],
  roomFive: [],
}

//fxn that moves player
function moveLocationFx(newLocation) {
  if (locationStates[locationCurrent].includes(newLocation)) {
    locationCurrent = newLocation
    return console.log(locationLookUp[locationCurrent].description)
  } else {
    return console.log(`cannot go from ${locationCurrent} to ${newLocation}`)
  }
}
  
//object for status of objects --> to help with no repeat take/drop items
//'out' is not taken, 'in' is in invetnory
let itemStatus = {
  paper: 'out',
  key: 'out',
  shovel: 'out',
  redLiquid: 'out',
  blueLiquid: 'out',
}

let playerInventory = {
  items: [" "],

  //add functions that add/remove items in players inventories
  addItemFx() {
    return console.log(`item added`)
  },

  dropItemFx() {
    return console.log(`dropped item`)
  },

  //fxn for usable items
  useItemFx() {
    return console.log(`Used item`)
  }
}

//fxn for readable items

//game starts here
async function start() {
  const welcomeMessage = `You awake. You look around the room and you are encased in a room of cobble and wood. You remember nothing. 
  You look down at your hands, they are small... hairy... you are unfamiliar with them.  
  You cross your eyes to see something near your pointed nose. Whiskers? 
  You notice your roundish body and get hit with something unexpected. You see a tail out the corner of your eye. 
  You are... afraid.`;

  console.log(welcomeMessage)

  do {
    let answer = await ask('> ');
    if (answer.includes('move')) {
      let moveRoom = answer.split(' ')
      moveLocationFx(moveRoom[1])
    } else if (answer === 'help') {
      console.log(playerActionHelp)
    } else if (answer === 'inventory') {
      console.log(playerInventory.items)
    } else if (answer.includes('use')) {
      console.log(`cannot use rn`)
    } else if (answer === 'look') {
      console.log(`${locationLookUp[locationCurrent].description}` + `${locationLookUp[locationCurrent].look}`)
    } else if (answer.includes('take')) {
      playerInventory.addItemFx()
    } else if (answer.includes('drop')) {
      playerInventory.dropItemFx()
    }
  } while (locationCurrent !== 'roomFive')

  //hallway await ask statement

  process.exit();
}

