const pdiscount = 0.2; //priority discount
const alldiscount = 0; //storewide discount

const prioritymin = 500000; //minimum cost before discounts for priority
require('dotenv').config()
const codes = {
  //code: [disabled?, discount] - disabled codes are false
  //discounts are their percentages in decimal form i.e. 100% is 1, 50% is 0.5, etc.
  reopen2020: { valid: false, discount: { type: 0, value: 0.1 } },
  bottestcode: { valid: false, discount: { type: 0, value: 0.05 } },
  bottestcode2: { valid: false, discount: { type: 0, value: 1 } },
  usertesting: { valid: false, discount: { type: 0, value: 1 } },
  gratis100persen: { valid: true, discount: { type: 0, value: 1 } }, //for special promotions
  nevergonnagiveyouup: { valid: false, discount: { type: 0, value: -100 } }, //troll
  mothersday2020: { valid: false, discount: { type: 0, value: 0.05 } }, //because I'm mean
  eid2020: { valid: false, discount: { type: 0, value: 0.2 } },
  //1 day in fizzstores: great prices for great items. 1 month in fizzstores: *speaks arabic*. 1 year in fizz stores: *pulls out quaran and starts praying*. 10 years in fizzstores: ALLAHU AKBAR *9/11 repeats*
  jessstores: { valid: false, discount: { type: 0, value: 0.15 } }, //when jess became owner code
  botttest3: { valid: true, discount: { type: 1, value: 1000 } }
};

const bots = [
  "663989176374525963",
  "713239165763977216"
]

const processors = {
  //fizzy is gone now lol F
  //fjorge
  "314539203801382912": {
    list: false,
    tz: { has: true, value: "UTC-05:00", observesdst: true },
    perms: "11"
  },
  //here lies where scoop's id used to be :(
  //fizzalt is gone
  //jess
  "549024663205052448": {
    list: true,
    tz: { has: true, value: "UTC-03:30", observesdst: true },
    perms: "11"
  },
  //here lies tarrah
  "298299934871126019": {
    list: true,
    tz: { has: true, value: "UTC-06:00", observesdst: true },
    perms: "11"
  },
  "366332452894933017": {
    list: false,
    tz: { has: false },
    perms: "01"
  }
};

const ops = [process.env.FJORGEID, "549024663205052448", "328665489041784832"];

const itemprices = {
  amber: ["Amber Axe", { u: 5000, b: 8000 }, { has: false, value: 0 }],
  alpha: ["Alpha Axe of Testing", { u: 5000, b: 8000 }, { has: false, value: 0 }],
  beta: ["Beta Axe of Bosses", { u: 5000, b: 8000 }, { has: false, value: 0 }],
  bird: ["Bird Axe", { u: 7000 }, { has: false, value: 0 }],
  end: ["End Times Axe", { u: 7000 }, { has: false, value: 0 }],
  fire: ["Fire Axe", { u: 5000, b: 8000 }, { has: false, value: 0 }],
  cane: ["Candy Cane Axe", { u: 3000, b: 5000 }, { has: false, value: 0 }],
  chicken: ["CHICKEN AXE", { u: 8000, b: 10000 }, { has: false, value: 0 }],
  many: ["The Many Axe", { u: 8000, b: 10000 }, { has: false, value: 0 }],
  rusty: ["Rusty Axe", { u: 8000, b: 10000 }, { has: false, value: 0 }],
  bees: ["Beesaxe", { u: 5000 }, { has: false, value: 0 }],
  gingerbread: ["Gingerbread Axe", { b: 10000, u: 5000 }, { has: false, value: 0 }],
  corn: ["Candy Corn Axe", { u: 5000, b: 8000 }, { has: false, value: 0 }],
  bobilee: ["Wobilee Bobilee", { b: 250, u: 100 }, { has: false, value: 0 }],
  wobble: ["Wobblebobble", { u: 3500, b: 6000 }, { has: false, value: 0 }],
  wobblier: ["Wobblierbobblier", { u: 8000, b: 6000 }, { has: false, value: 0 }],
  "pink bone": ["Pink Bone Turkey", { b: 10000 }, { has: false, value: 0 }],
  "blue bone": ["Blue Bone Turkey", { b: 10000 }, { has: false, value: 0 }],
  "green bone": ["Green Bone Turkey", { b: 10000 }, { has: false, value: 0 }],
  blue: ["Blue Ball", { b: 3000 }, { has: false, value: 0 }],
  golden: ["Golden Toilet", { b: 15000 }, { has: false, value: 0 }],
  red: ["Red Ball", { b: 3000 }, { has: false, value: 0 }],
  green: ["Green Ball", { b: 3000 }, { has: false, value: 0 }],
  //"06": ["06 In Full Context", { b: 15000 }, { has: false, value: 0 }],
  sleigh: ["Sleigh", { b: 20000 }, { has: false, value: 0 }],
  spork: ["Spork", { b: 10000, u: 5000 }, { has: false, value: 0 }],
  "bobbily wobbily": ["Bobbily Wobbily", { b: 10000, u: 8000 }, { has: false, value: 0 }],
  wolliby: ["Wolliby Bolliwy", { b: 15000, u: 10000 }, { has: false, value: 0 }],
  bowl: ["Bowl", { b: 15000, u: 10000 }, { has: false, value: 0 }],
  quackert: ["Quackert", { u: 7000, b: 10000 }, { has: false, value: 0 }],
  daisy: ["Ball of Daisy", { b: 1000 }, { has: false, value: 0 }],
  burger: ["Burger Cola", { b: 8000, u: 5000 }, { has: false, value: 0 }],
  turkey: ["Turkey", { b: 6000 }, { has: false, value: 0 }],
  dark: ["Dark Pumpkin", { b: 12000, u: 8000 }, { has: false, value: 0 }],
  lumbkin: ["Lumbkin", { b: 15000, u: 10000 }, { has: false, value: 0 }],
  pineapple: ["Pineapple", { b: 20000 }, { has: false, value: 0 }],
  gloomy: ["Gloomy Seascape at Dusk", { b: 10000 }, { has: false, value: 0 }],
  arctic: ["Arctic Light", { b: 15000 }, { has: false, value: 0 }],
  scoobis: ["Scoobis", { u: 10000 }, { has: false, value: 0 }],
  "icicle lights": ["Spooky Icicle Lights", { b: 1000 }, { has: false, value: 0 }],
  purple: ["Purple Bag of Candy", { b: 500, u: 400 }, { has: false, value: 0 }],
  candy: ["Bag of Candy", { b: 250, u: 200 }, { has: false, value: 0 }],
  disturbed: ["Disturbed Painting", { b: 3000 }, { has: false, value: 0 }],
  outdoor: ["Outdoor Watercolor Sketch", { b: 1000 }, { has: false, value: 0 }],
  eye: ["Preserved Enlarged Ostrich Eye", { b: 12000, u: 10000 }, { has: false, value: 0 }],
  ghastly: ["Ghastly Pumpkin", { b: 700, u: 600 }, { has: false, value: 0 }],
  strange: ["Strange Pumpkin", { b: 5000, u: 2000 }, { has: false, value: 0 }],
  cursed: ["Cursed Pumpkin", { b: 5000, u: 2000 }, { has: false, value: 0 }],
  pumpkin: ["Pumpkin", { b: 5000, u: 1000 }, { has: false, value: 0 }],
  title: ["Title Unknown", { b: 6000 }, { has: false, value: 0 }],
  bold: ["Bold and Brash", { b: 50000 }, { has: true, value: 10 }], //people can order more then 10
  burnt: ["Burnt Painting", { b: 10000 }, { has: false, value: 0 }],
  snow: ["Ball of Snow", { b: 2000 }, { has: false, value: 0 }],
  mug: ["Mug of Cocoa", { b: 300, u: 200 }, { has: false, value: 0 }],
  plum: ["Plum Ball", { b: 1000 }, { has: false, value: 0 }],
  test2: ["Testing Item 2", { b: 100 }, { has: false, value: 0 }],
  test: ["Testing Item", { b: 500000 }, { has: false, value: 0 }],
  cranberry: ["Can of Cranberry Sauce", { b: 10000, u: 5000 }, { has: false, value: 0 }],
  giraffe: ["The Lonely Giraffe", { b: 10000 }, { has: false, value: 0 }],
  just: ["Just a Candy Cane", { b: 5000, u: 1000 }, { has: false, value: 0 }],
  lump: ["Lump of Coal", { b: 5000, u: 1000 }, { has: false, value: 0 }],
  //toboggan: ["Toboggan", { b: 5000 }, { has: false, value: 0 }],
  plate: ["Plate", { b: 5000, u: 1000 }, { has: false, value: 0 }],
  cone: ["Cone", { b: 5000, u: 2500 }, { has: false, value: 0 }]
};
const woodprices = {
  //name is tree name but without the word "tree"
  test: { name: "Test", price: { w: 1000 }, limit: { has: false, value: 0 } },
  oak: { name: "Oak", price: { w: 500 }, limit: { has: false, value: 10 } },
  elm: { name: "Elm", price: { w: 1000 }, limit: { has: false, value: 5 } },
  walnut: { name: "Walnut", price: { w: 2500 }, limit: { has: false, value: 5 } },
  cherry: { name: "Cherry", price: { w: 2500 }, limit: { has: false, value: 10 } },
  snowglow: { name: "SnowGlow", price: { w: 5000 }, limit: { has: false, value: 10 } },
  birch: { name: "Birch", price: { w: 1000 }, limit: { has: false, value: 10 } },
  koa: { name: "Koa", price: { w: 2500 }, limit: { has: false, value: 5 } },
  fir: { name: "Fir", price: { w: 2500 }, limit: { has: false, value: 5 } },
  pine: { name: "Pine", price: { w: 2500 }, limit: { has: false, value: 5 } },
  lava: { name: "Lava", price: { w: 5000 }, limit: { has: false, value: 5 } },
  zombie: { name: "Zombie", price: { w: 5000 }, limit: { has: false, value: 5 } },
  blue: { name: "Cavecrawler", price: { w: 7500 }, limit: { has: false, value: 5 } },
  palm: { name: "Palm", price: { w: 10000 }, limit: { has: false, value: 5 } },
  gold: { name: "Gold", price: { w: 5000 }, limit: { has: false, value: 5 } },
  frost: { name: "Frost", price: { w: 1000 }, limit: { has: false, value: 10 } },
  spook: { name: "Spook", price: { w: 10000 }, limit: { has: false, value: 5 } },
  sinister: { name: "Sinister", price: { w: 15000 }, limit: { has: false, value: 5 } },
  phantom: { name: "Phantom", price: { w: 25000 }, limit: { has: false, value: 5 } },
};
const giftprices = {
  //add all the gifts here and instead of the u and b make it g
  uncertainty: ["Wobbly Gift of Uncertainty", { g: 10000 }, { has: false, value: 0 }],
  blue: ["Happy Blue Gift of Fun", { g: 5000 }, { has: false, value: 0 }],
  "less certainty": ["Wobblier Gift of Less Certainty", { g: 10000 }, { has: false, value: 0 }],
  sweet: ["Sweet Gift", { g: 15000 }, { has: false, value: 0 }],
  fiery: ["Fiery Gift of Lumber", { g: 15000 }, { has: false, value: 0 }],
  "great times": ["Gift of Great Times", { g: 15000 }, { has: false, value: 0 }],
  //big: ["BIG GIFT", { g: 25000 }, { has: false, value: 0 }],
  golden: ["Golden Gift of Golden Times", { g: 30000 }, { has: false, value: 0 }],
  red: ["Happy Red Gift of Fun", { g: 5000 }, { has: false, value: 0 }],
  green: ["Joyful Green Gift of High Quality Charm", { g: 5000 }, { has: false, value: 0 }],
  //modern: ["Modern Gift", { g: 25000 }, { has: false, value: 0 }],
  jingly: ["Jingly Gift of Jingles", { g: 30000 }, { has: false, value: 0 }],
  acceptable: ["Acceptable Gift From Bob", { g: 15000 }, { has: false, value: 0 }],
  "high confidence": ["Wobbly Gift of High Confidence", { g: 15000 }, { has: false, value: 0 }],
  oxidation: ["Old Gift of Oxidation", { g: 20000 }, { has: false, value: 0 }],
  teal: ["Wobbly Gift of Mostly Teal", { g: 20000 }, { has: false, value: 0 }],
  unhealthy: ["Gift of Unhealthy Diets", { g: 10000 }, { has: false, value: 0 }],
  health: ["Gift of Good Health", { g: 15000 }, { has: false, value: 0 }],
  duck: ["Duck Shaped Gift", { g: 20000 }, { has: false, value: 0 }],
  daisy: ["Daisy Gift", { g: 8000 }, { has: false, value: 0 }],
  burnt: ["Burnt Gift", { g: 40000 }, { has: false, value: 0 }],
  cold: ["Cold and Wet and Lumpy Gift from Bob", { g: 5000 }, { has: false, value: 0 }],
  gingerbread: ["Gingerbread Gift", { g: 20000 }, { has: false, value: 0 }],
  warm: ["Warm Gift of Love and Safety", { g: 500 }, { has: false, value: 0 }],
  plum: ["Very Plum Gift", { g: 5000 }, { has: false, value: 0 }],
  stripes: ["Gift with Candy Cane Stripes", { g: 1000 }, { has: false, value: 0 }],
  poor: ["Poorly Wrapped Gift from Bob", { g: 10000 }, { has: false, value: 0 }],
  //adventure: ["Gift of Adventure", { g: 10000 }, { has: false, value: 0 }],
  flat: ["Round and Flat Gift", { g: 10000 }, { has: false, value: 0 }],
  "low confidence": ["Wobbly Gift of Low Confidence", { g: 500 }, { has: false, value: 0 }],
  orange: ["Orange Gift of Traffic Control and Corporate Power", { g: 10000 }, { has: false, value: 0 }]
};

module.exports = {
  prioritymin,
  ops,
  pdiscount,
  alldiscount,
  codes,
  processors,
  itemprices,
  woodprices,
  giftprices,
  bots
};
