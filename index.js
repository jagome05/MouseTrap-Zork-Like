const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

/*things to possibly add/edit
  Opening closed doors --> go up to door? or specific command that recognizes user input?
  puzzle
  word wrapping fxn
  flavor text?
*/

let ans;

class Location {
  constructor(name, description, look, lock, exits) {
    this.name = name
    this.description = description
    this.look = look
    this.lock = lock
    this.exits = exits
  }

  openLock() {
    this.lock = 'open'
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
'open',
`North   South   West`)
let roomTwo = new Location('North Room', 
`You slowly move towards the hole. 
You enter and its another room. There are no other holes besides the one you came from.`,
`You look around the room. There is a piece of paper on the ground.`,
'open',
`South`)
let roomThree = new Location('West Room', 
`You walk hesitantly towards the hole. You take a step in and notice a room with a door on the other side of the room. `,
`You see a locked door to the west. There is also a shovel on the floor. `,
'open',
`East   South`)
let roomFour = new Location('Boulder Room', 
`You walk in. There is a giant boulder in the room. `,
`There is a boulder in the room. You peek behind it and there appears to be a hallway. You cannot squeeze through it though.`,
'lock',
`North   East`)
let hallway = new Location('Hallway', 
`Past the bolder is a long hallway. It extends into darkness. You make your way down the hallway. You keep your hand along the cobblestone wall to guide you. 
After awhile you've lost track of your steps. When will you reach another room, a door, light? You see nothing. All you hear are your breaths. \nThey become heavier the more you think about being stuck in this hallway. 
Fear hits you. Do you wish to continue forward or go back?`,
`You cannot see anything. `,
'lock',
`Forward   Back`)
let roomFive = new Location('Last Room?', 
`Eventually you see light. You rush over with your tiny legs. It is a gigantic room. There is blinding light coming from above, and as you try to look into the distance everything becomes blurry. `,
`You look around but it is hard to see. There appears to be giant  pieces of broken glass on the floor in front of you. Near the pieces of glass are ponds of colorful liquids. One is red liquid, the other is blue liquid.`,
'open',
`???`)

let locationCurrent = 'home'

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
//can possibly mix with class Location constructor
const locationStates = {
  home: ['roomTwo', 'roomThree'],
  roomTwo: ['home'],
  roomThree:['home','roomFour'],
  roomFour: ['roomThree','hallway'],
  hallway: ['roomFive', 'forward', 'back'],
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
//possibly add array for 'story beats' so that 'enter new room text' !== 'reentering a previously visited room'/adding a new attribute
function playerMovementFx(answer) {
  if (locationCurrent === 'home' && answer === 'north') {
    return moveLocationFx('roomTwo')
  } else if (locationCurrent === 'home' && answer === 'west') {
    return moveLocationFx('roomThree')
  } else if (locationCurrent === 'home' && answer === 'south') {
    return console.log('You try to open the door. It is locked')
  }
  
  if (locationCurrent === 'roomTwo' && answer === 'south') {
    return moveLocationFx('home')
  } 

  if (locationCurrent === 'roomThree' && answer === 'east') {
    return moveLocationFx('home')
  } else if (locationCurrent === 'roomThree' && answer === 'south' && roomFour.lock === 'lock') {
    return console.log('You try to open the door. It is locked')
  } else if (locationCurrent === 'roomThree' && answer === 'south' && roomFour.lock === 'open') {
    return moveLocationFx('roomFour')
  }

  //possibly update .exits AFTER character looks in room
  if (locationCurrent === 'roomFour' && answer === 'east' && hallway.lock === 'lock') {
    return console.log('A boulder is blocking your path. ')
  } else if (locationCurrent === 'roomFour' && answer === 'east' && hallway.lock === 'open') {
    return moveLocationFx('hallway')
  } else if (locationCurrent === 'roomFour' && answer === 'north') {
    return moveLocationFx('roomThree')
  }
  
  if (locationCurrent === 'hallway' && answer === 'forward') {
    console.log('you continue forward.')
    return moveLocationFx('roomFive')
  } else if (locationCurrent === 'hallway' && answer === 'back') {
    console.log(`You feel the ground shake underneath you. You panic. You turn around and walk back from where you came. 
    It seems like a further walk back than you remember. Eventually you hit a wall. It is still dark and you can't see anything.
    You are hitting the wall to see if it will move or if there is anything you can open it with. Nothing. It is getting harder to breathe. 
    You've lost your sense of direction.
    You turn around and decide to move forward. The darkness feels like it is creeping in. Each step is heavier as you are losing hope. You start wondering, 'What is going on? 
    Why can't I escape?'
    You feel the ground shake underneath you again. You're losing your sanity. You run as fast as you can forward. You hit a wall. You feel dread. 
    You don't know where you are. You don't know how to get out. Your legs give in. You give up.`)
    return process.exit()
  } else {
    console.log(`You cannot move there.`)
  }
}

//object for status of objects --> to help with no repeat take/drop items
class itemStatusClass {
  constructor(taken, location, description, useItem) {
    this.taken = taken
    this.location = location
    this.description = description
    this.useItem = useItem
  }

  updateDrop() {
    this.location = locationCurrent
  }

  drinkFx() {
    console.log(this.useItem)
  }
}

let sign = new itemStatusClass('non', 'home', '...Not again...', `'...Not again...'`)
let paper = new itemStatusClass('out', 'roomTwo', 'The paper has scribbles on it. A key falls on the ground when you open the paper.',
 '"..Day 2......test subjects.....lab....accidents..Day 89...')
let key = new itemStatusClass('out', 'roomTwo', 'The key looks like it could open a door.', 'You use the key on the door. It unlocks it.')
let shovel = new itemStatusClass('out', 'roomThree', 'It is an old and rusted shovel.', 'You use the shovel on the boulder. You jam it at the bottom and use all your strength to move it. \nThe boulder budges slighlty enough for you to be able to squeeze through to the hole behind it.')
let redLiquid = new itemStatusClass('out', 'roomFive', 'Red Liquid?', 'You cusp your hands together and gather the liquid in your tiny hands. \nYou drink the red liquid. It tastes disgusting. Nothing happens.')
let blueLiquid = new itemStatusClass('out', 'roomFive', 'Blue Liquid?', `You gather the blue liquid in your hand and drink it. It tastes awful. \nYou feel nothing at first, but then you feel weird. You flinch as pain courses through your tiny body. You collapse on the ground... \nYou awake. It looks like you are in the same room, but it seems much smaller. The room is entirely white, but you look at the ground. There is glass on the floor with different covered liquids on the ground. \nAs you get up, you notice that your body has changed. Your hands aren't small and furry anymore. It looks like you've returned to normal. \nYou look around and notice one door in the room. There is a red print on the handle.`)

let itemStatus = {
  'sign': sign,
  'paper': paper,
  'key': key,
  'shovel': shovel,
  'red Liquid': redLiquid,
  'blue Liquid': blueLiquid
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
  
  //possibly update drop fxn to where they drop in currentLocation and update this.location class
  dropItemFx(answer) {
    if (itemStatus[answer].taken === 'in') {
    itemStatus[answer].taken = 'out'
    let newItemList = this.items.filter((item) => item !== answer)
    this.items = newItemList
    itemStatus[answer].updateDrop()
    return console.log(`dropped ${answer}. `)
    } else if (itemStatus[answer].taken === 'out') {
      console.log(`You do not have ${answer} in your inventory. `)
    }
  },

  //fxn for reading inventory vs outside items?? --> update paper for if NOT in inventory(still have key fall out some how)
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

//usable item fxn -- possibly update with use [item] on [this]??
function useItemFx(answer) {
  if (itemStatus[answer].taken === 'in' && answer.includes('key') && locationCurrent === 'roomThree') {
    console.log(`${key.useItem}`)
    return roomFour.openLock()
  } else if (itemStatus[answer].taken === 'in' && answer.includes('key') && locationCurrent === 'home') {
    return console.log(`You try using the key on the door. It does not unlock the door. You shake as you suddenly hear glass break on the other side of the door...`)
  } else if (itemStatus[answer].taken === 'in' && answer.includes('shovel') && locationCurrent === 'roomFour') {
    console.log(`${shovel.useItem}`)
    return hallway.openLock()
    //add drink option for liquids
  } else {
    return console.log(`You cannot use that.`)
  }
}

start();

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
    //add color txt??
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

    }  else if (answer.includes('drink')) {
      if (answer.includes('red')) {
        redLiquid.drinkFx()
      } else if (answer.includes('blue')) {
        blueLiquid.drinkFx()
        blueLiquid.taken = 'in'
      } else {
        console.log(`What did you want to drink?`)
      }
    } else {
      console.log(`${answer} is not a valid action`)
    }
    locationStatus = locationLookUp[locationCurrent].name
    locationExits = locationLookUp[locationCurrent].exits
  } while (blueLiquid.taken !== 'in')
  console.log(`Your brain hurts as you try to remember anything. You start to remember your name...\nYour name is John Wick.`)
  process.exit();
}

