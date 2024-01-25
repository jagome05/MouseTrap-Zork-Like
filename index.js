const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

/*things to add/edit
  Interactions with items
  Opening closed doors --> go up to door? or specific command that recognizes user input?
  puzzle
  status line at bottom of screen --> have it state what roomthey are in and exits!
  word wrapping fxn
  flavor text?
*/

let ans;

class Location {
  constructor(name, description, look, exits) {
    this.name = name
    this.description = description
    this.look = look
    this.exits = exits
  }
}

//possible actions for players to use -> can refer with action: help
let playerActionHelp = {
  help: `Type 'help' to see type commands you can perform`,
  move: `Typing 'move [direction]' will allow you to move between rooms. (hint: move by saying north, south, east, west) `,
  use: `Typing 'use [item] on [object]' in a specific room will allow you to interact with certain objects`,
  look: `Typing 'look' will give you a description of the room and possible objects in the room you may interact with`,
  read: `Typing 'read [item]' will allow you to read certain text on an object`,
  inventory: `Typing 'inventory' will allow the player to look at current items they hold`,
  take: `Typing 'take [item]' will allow you to take certain items and keep them in your inventory to possibly use them later`,
  drop: `Typing 'drop [item]' will drop an item and it will leave your inventory`,
}

let home = new Location('Starting Room', 
'In the room you are in there is a sign. You look around and there is one hole in the room to the north and one to the west. \nYou look through the holes but darkness covers the beyond. There is a door to the south.',
'In the room you are in there is a sign. You look around and there is one hole in the room to the north and one to the west. \nYou look through the holes but darkness covers the beyond. There is a door to the south.',
`North   South   West`)
let roomTwo = new Location('North Room', 
`You slowly move towards the hole. 
You enter and its another room. There are no other holes besides the one you came from.`,
`You look around the room. There is a piece of paper on the ground.`,
`South`)
let roomThree = new Location('West Room', 
`You walk hesitantly towards the hole. You take a step in and notice a room with a door on the other side of the room. `,
`You see a locked door to the west. There is also a shovel on the floor. `,
`East   South`)
let roomFour = new Location('Boulder Room', 
`You walk in. There is a giant boulder in the room. `,
`There is a boulder in the room. You peek behind it and there appears to be a hallway. You cannot squeeze through it though.`,
`North   East`)
let hallway = new Location('Hallway', 
`Past the bolder is a long hallway. It extends into darkness. You make your way down the hallway. You keep your hand along the cobblestone wall to guide you. 
After awhile you've lost track of your steps. When will you reach another room, a door, light? You see nothing. All you hear are your breaths. They become heavier the more you think about being stuck in this hallway. 
Fear hits you. `,
`You cannot see anything. `,
`Continue   Back`)
let roomFive = new Location('Last Room?', 
`Eventually you see light. You rush over with your tiny legs. It is a gigantic room. There is blinding light coming from above, and as you try to look into the distance everything becomes blurry. `,
`You look around but it is hard to see. There appears to be giant  pieces of broken glass on the floor in front of you. Near the pieces of glass are ponds of colorful liquids. One is red liquid, the other is blue liquid.`,
`None?`)

let locationCurrent = 'home'

//add inputs for locked doors
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

//fxn that updates the lcoationCurrent
function moveLocationFx(newLocation) {
  if (locationStates[locationCurrent].includes(newLocation)) {
    locationCurrent = newLocation
    return console.log(locationLookUp[locationCurrent].description)
  } else {
    return console.log(`cannot go from ${locationCurrent} to ${newLocation}`)
  }
}

//fxn that moves the player based off their input --> possibly change to class method/switch statement
//update for cardinal directions vs player POV, and if approaching a locked door??
function playerMovementFx(answer) {
  if (locationCurrent === 'home' && answer === 'north') {
    return moveLocationFx('roomTwo')
  } else if (locationCurrent === 'home' && answer === 'west') {
    return moveLocationFx('roomThree')
  } else if (locationCurrent === 'home' && answer === 'south' && closedDoors.doorTwo === 'closed') {
    return console.log('You try to open the door. It is locked')
  }
  
  if (locationCurrent === 'roomTwo' && answer === 'south') {
    return moveLocationFx('home')
  } 

  if (locationCurrent === 'roomThree' && answer === 'east') {
    return moveLocationFx('home')
  } else if (locationCurrent === 'roomThree' && answer === 'south' && closedDoors.doorOne === 'closed') {
    return console.log('You try to open the door. It is locked')
  } else if (locationCurrent === 'roomThree' && answer === 'south' && closedDoors.doorOne === 'open') {
    return moveLocationFx('roomFour')
  }
  
  if (locationCurrent === 'roomFour' && answer === 'east' && closedDoors.boulder === 'closed') {
    return console.log('A boulder is blocking your path. ')
  } else if (locationCurrent === 'roomFour' && answer === 'east' && closedDoors.boulder === 'open') {
    return moveLocationFx('hallway')
  } else if (locationCurrent === 'roomFour' && answer === 'north') {
    return moveLocationFx('roomThree')
  } else {
    console.log(`You cannot move there.`)
  }
  
  if (locationCurrent === 'hallway' && answer === 'continue') {
    console.log('you continue forward.')
  } else if (locationCurrent === 'hallway' && answer === 'back') {
    console.log(`You feel the ground shake underneath you. You panic. You turn around and walk back from where you came. It seems like a further walk back than you remember. Eventually you hit a wall. It is still dark and you can't see anything.`
    `You are hitting the wall to see if it will move or if there is anything you can open it with. Nothing. It is getting harder to breathe. You've lost your sense of dircetion.`
    `You turn around and decide to move forward. The darkness feels like it is creeping in. Each step is heavier as you are losing hope. You start wondering, 'What is going on? Why can't I escape?'`
    `You feel the ground shake underneath you again. You're losing your sanity. You run as fast as you can forward. You hit a wall. You feel dread. You don't know where you are. You don't know how to get out. Your legs give in. You give up.`)
    process.exit()
  }

}

//object for status of objects --> to help with no repeat take/drop items
//'out' is not taken, 'in' is in invetnory
class itemStatusClass {
  constructor(taken, location, description, useItem) {
    this.taken = taken
    this.location = location
    this.description = description
    this.useItem = useItem
  }
  
}

//add a specific attribute to key/shovel?

let sign = new itemStatusClass('in', 'home', '...Not again...', `'...Not again...'`)
let paper = new itemStatusClass('out', 'roomTwo', 'The paper has scribbles on it. A key falls on the ground when you open the paper.',
 '"..Day 2......test subjects.....lab....accidents..Day 89...')
let key = new itemStatusClass('out', 'roomTwo', 'The key looks like it could open a door.', 'You use the key on the door. It unlocks it.')
let shovel = new itemStatusClass('out', 'roomThree', 'It is an old and rusted shovel.', 'You use the shovel on the boulder. You jam it at the bottom and use all your strength to move it. \nThe boulder budges slighlty enough for you to be able to squeeze through to the hole behind it.')
let redLiquid = new itemStatusClass('out', 'roomFive', 'Red Liquid?', 'You cusp your hands together and gather the liquid in your tiny hands. \nYou drink the red liquid. It tastes disgusting. Nothing happens.')
let blueLiquid = new itemStatusClass('out', 'roomFive', 'Blue Liquid?', `You gather the blue liquid in your hand and drink it. It tastes awful. \nYou feel nothing at first, but then you feel weird. You flinch as pain courses through your tiny body. You collapse on the ground... \nYou awake. It looks like you are in the same room, but it seems much smaller. The room is entirely white, but you look at the ground. There is glass on the floor with different covered liquids on the ground. \nAs you get up, you notice that your body has changed. Your hands aren't small and furry anymore. It looks like you've returned to normal. \nYou look around and notice one door in the room. There is a red print on the handle...`)

let itemStatus = {
  'sign': sign,
  'paper': paper,
  'key': key,
  'shovel': shovel,
  'redLiquid': redLiquid,
  'blueLiquid': blueLiquid
}

let playerInventory = {
  items: [ ],
  
  //Function that add/remove items in players inventories
  addItemFx(answer) {
    if (itemStatus[answer].taken === 'out' && itemStatus[answer].location === locationCurrent) {
      itemStatus[answer].taken = 'in'
      this.items.push(answer)
      return console.log(`${answer} added to inventory. ${itemStatus[answer].description} `)
    } else if (itemStatus[answer].taken === 'in') {
      return console.log(`${answer} is already in your inventory`)
    } else if (itemStatus[answer].taken === 'out' && itemStatus[answer].location !== locationCurrent) {
      return console.log(`You cannot take that.`)
    } else {
      return console.log(`You cannot take that.`)
    }
  },
  
  dropItemFx(answer) {
    if (itemStatus[answer].taken === 'in') {
    itemStatus[answer].taken = 'out'
    let newItemList = this.items.filter((item) => item !== answer)
    this.items = newItemList
    return console.log(`dropped ${answer}. `)
    } else if (itemStatus[answer].taken === 'out') {
      console.log(`You do not have ${answer} in your inventory. `)
    }
  },

  //fxn for reading inventory vs outside items??
  readFx(answer) {
    if (locationCurrent === itemStatus[answer].location && itemStatus[answer].taken === 'in') {
      return console.log(`It reads,'${itemStatus[answer].useItem}'`)
    } else if (answer === 'sign') {
      return console.log(`It reads,'${itemStatus[answer].useItem}'`)
    } else {
      console.log(`You cannot read that.`)
    }
  }
}

key.lock() = 
shovel.lock() = 

//usable item fxn
function useItemFx(answer) {
  //include answer.hasOwnProperty(itemStatus[answer].useItem) ?
  if (answer.includes('key') && answer.includes('door') && itemStatus[answer].taken === 'in' && ) {
  }
}

start();

//game starts here
async function start() {
  const welcomeMessage = `You awake. You look around the room and you are encased in a room of cobble and wood. You remember nothing. 
  You look down at your hands, they are small... hairy... you are unfamiliar with them.  
  You cross your eyes to see something near your pointed nose. Whiskers? 
  You notice your roundish body and get hit with something unexpected. You see a tail out the corner of your eye. 
  You are... afraid.
  (hint: type 'help' to see a list of commands!)`;

  console.log(welcomeMessage)
  let locationStatus = locationLookUp[locationCurrent].name
  let locationExits = locationLookUp[locationCurrent].exits
  do {
    let answer = await ask(`Current Room: ${locationStatus}   Exits: ${locationExits} \n> `);
    if (answer.includes('move')) {
      let moveRoom = answer.split(' ')
      playerMovementFx(moveRoom[1].toLowerCase())
    } else if (answer === 'help') {
      console.log(playerActionHelp)
    } else if (answer.includes('use')) {
      let playerUseItem = answer.split(' ')
      useItemFx(playerUseItem[1].toLowerCase())
    } else if (answer === 'inventory') {
      if (playerInventory.items == false) {
        console.log(`Your inventory is empty`)
      } else {
      console.log(playerInventory.items) }
    } else if (answer === 'look') {
      console.log(`${locationLookUp[locationCurrent].look}`)
    } else if (answer.includes('read')) {
      let readItem = answer.split(' ')
      playerInventory.readFx(readItem[1].toLowerCase())
    } else if (answer.includes('take')) {
      let addItem = answer.split(' ')
      if (itemStatus.hasOwnProperty(addItem[1].toLowerCase())) {
      playerInventory.addItemFx(addItem[1].toLowerCase())
      } else {
        console.log(`You cannot take that.`)
      }
    } else if (answer.includes('drop')) {
      let dropItem = answer.split(' ')
      playerInventory.dropItemFx(dropItem[1].toLowerCase())
    } else {
      console.log(`${answer} is not a valid action`)
    }
    locationStatus = locationLookUp[locationCurrent].name
    locationExits = locationLookUp[locationCurrent].exits
  } while (locationCurrent !== 'roomFive')

    //roomFive await ask statement
    // let  = await ask('')


  process.exit();
}

