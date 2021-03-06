const COLOR = "#C7FF18";
const CENTER_X = 100;
const CENTER_Y = 100;

const DELAY_TIME = 250;
const DURATION_TIME = 2500;
const MAIN_RADIUS = 10;
const MAIN_DISTANCE = 25;
const SATELLITE_DATA = [
  {
    maxRadius: MAIN_RADIUS + 2,
    dir: -72 * 1,
    distance: MAIN_DISTANCE,
  },
  {
    maxRadius: MAIN_RADIUS,
    dir: -72 * 2 + 20,
    distance: MAIN_DISTANCE - 6,
  },
  {
    maxRadius: MAIN_RADIUS - 2,
    dir: -72 * 3 + 10,
    distance: MAIN_DISTANCE - 2,
  },
  {
    maxRadius: MAIN_RADIUS - 3,
    dir: -72 * 4 + 10,
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
  const gui = new dat.GUI();

  const satellites = SATELLITE_DATA.map((s, i) => {
    const satellite = new Satellite(snap, s.dir, s.distance, i, s.maxRadius, 0);
    _.delay(() => {
      return satellite.animateIn();
    }, DELAY_TIME * i);
    const folder = gui.addFolder(`satellite-0${i}`);
    folder.add(satellite, "maxR", 0, 32);
    folder.add(satellite, "minR", 0, 32);
    folder.add(satellite, "cx", 50, 150).onChange(() => {satellite.renderPosition()});
    folder.add(satellite, "cy", 50, 150).onChange(() => {satellite.renderPosition()});
    folder.add(satellite, "distance", 0, 50).onChange(() => {satellite.renderPosition()});
    folder.add(satellite, "dir", 0, 360).onChange(() => {satellite.renderPosition()});
    return satellite;
  });

  const sibling = new Satellite(snap, 0, MAIN_DISTANCE - 0, 0, 12, 5, 5);
  sibling.animateIn();
  const sibling2 = new Satellite(snap, 20, MAIN_DISTANCE - 10, 0, 10, 5, 5);
  sibling2.animateIn();

  $("#mainCircle").addClass("animate");
  setTimeout(() => {
    $("#mainCircle").removeClass("animate");
  }, DURATION_TIME * 2 + DELAY_TIME * (SATELLITE_DATA.length - 1) * 2);

  setInterval(() => {
    $("#mainCircle").addClass("animate");
    sibling.animateIn();
    sibling2.animateIn();
    satellites.forEach((s, i) => {
      _.delay(() => {
        s.animateIn();
      }, DELAY_TIME * i);
    });
  }, DURATION_TIME * 2 + DELAY_TIME * (SATELLITE_DATA.length - 1) * 2);

  gradient(snap, [...satellites, sibling, sibling2, {svg: Snap("#mainCircle")}])();

});

const gradient = (snap, elems) => () => {
  const i = COUNTER % (COLORS.length - 1);
  const leftColor = COLORS[i];
  const rightColor = COLORS[i + 1];
  const g = snap.gradient(`L(0, 0, 0, 0)${rightColor}:40-${leftColor}:60`);
  elems.forEach((el) => {
    el.svg.attr({fill: g});
  });
  g.animate({ x1: 0, y1: 0, x2: 0, y2: 300 }, 5000, mina.easeout, gradient(snap, elems));

  COUNTER++;
};

class Satellite {
  constructor(snap, dir, distance, delayBase, maxR = 18, minR = 0, initR = 0) {
    this.cx = CENTER_X;
    this.cy = CENTER_Y;
    this.distance = distance;
    this.delayBase = delayBase;
    this.maxR = maxR;
    this.minR = minR;
    this.dir = dir;

    this.svg = snap.circle(this.getX(), this.getY(), initR).attr({
      fill: COLOR,
    }).addClass("filter");
  }

  renderPosition() {
    this.svg.attr({
      cx: this.getX(),
      cy: this.getY()}
    );
  }

  getX() {
    return this.cx + getAddXfromDir(this.dir, this.distance);
  }

  getY() {
    return this.cy + getAddYfromDir(this.dir, this.distance);
  }

  animateIn() {
    this.svg.animate({
      r: this.maxR,
    }, DURATION_TIME, mina.easeinout, ::this.animateOut);
  }

  animateOut() {
    const delay = DELAY_TIME * (SATELLITE_DATA.length - 1 - this.delayBase) * 2;
    _.delay(() => {
      this.svg.animate({
        r: this.minR,
      }, DURATION_TIME, mina.easeinout);
    }, delay);
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
