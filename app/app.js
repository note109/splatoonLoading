const COLOR = "#C7FF18";
const CENTER_X = 100;
const CENTER_Y = 100;

const DELAY_TIME = 250;
const DURATION_TIME = 3000;
const MAIN_RADIUS = 16;
const MAIN_DISTANCE = 25;
const SATELLITE_DATA = [
  {
    maxRadius: MAIN_RADIUS,
    dir: -72 * 1,
    distance: MAIN_DISTANCE,
  },
  {
    maxRadius: MAIN_RADIUS,
    dir: -72 * 2,
    distance: MAIN_DISTANCE,
  },
  {
    maxRadius: MAIN_RADIUS,
    dir: -72 * 3,
    distance: MAIN_DISTANCE,
  },
  {
    maxRadius: MAIN_RADIUS,
    dir: -72 * 4,
    distance: MAIN_DISTANCE,
  },
];

const COLORS = (() => {
  let colors = ["#AA005B", "#4E2897", "#2203A3", "#006782", "#00826E", "#00BF1E", "#7E4E00", "#990000"];
  return [...colors, colors[0]];
})();
let COUNTER = 0;

$(() => {
  const snap = Snap("#svg");

  const satellites = SATELLITE_DATA.map((s, i) => {
    const satellite = new Satellite(snap, s.dir, s.distance, i, s.maxRadius, 0);
    satellite.animateIn();
    return satellite;
  });
});

class Satellite {
  constructor(snap, dir, distance, delayBase, maxR = 18, minR = 0, initR = 0) {
    this.cx = CENTER_X;
    this.cy = CENTER_Y;
    this.distance = distance;
    this.delayBase = delayBase;
    this.maxR = maxR;
    this.minR = minR;

    this.svg = snap.circle(this.getX(dir), this.getY(dir), initR).attr({
      fill: "#C7FF18",
    }).addClass("filter");
  }

  getX(dir) {
    return this.cx + getAddXfromDir(dir, this.distance);
  }

  getY(dir) {
    return this.cy + getAddYfromDir(dir, this.distance);
  }

  animateIn() {
    this.svg.animate({
      r: this.maxR,
    }, DURATION_TIME, mina.easeinout, ::this.animateOut);
  }

  animateOut() {
    this.svg.animate({
      r: this.minR,
    }, DURATION_TIME, mina.easeinout, ::this.animateIn);
  }
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const getAddXfromDir = (dir, distance) => {
  return Math.cos(toRadian(dir)) * distance;
}
const getAddYfromDir = (dir, distance) => {
  return Math.sin(toRadian(dir)) * distance;
}
const toRadian = (dir) => {
  return dir * Math.PI / 180;
}
