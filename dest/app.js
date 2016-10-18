"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var COLOR = "#C7FF18";
var CENTER_X = 100;
var CENTER_Y = 100;

var DELAY_TIME = 250;
var DURATION_TIME = 2500;
var MAIN_RADIUS = 10;
var MAIN_DISTANCE = 25;
var SATELLITE_DATA = [{
  maxRadius: MAIN_RADIUS + 2,
  dir: -72 * 1,
  distance: MAIN_DISTANCE
}, {
  maxRadius: MAIN_RADIUS,
  dir: -72 * 2 + 20,
  distance: MAIN_DISTANCE - 6
}, {
  maxRadius: MAIN_RADIUS - 2,
  dir: -72 * 3 + 10,
  distance: MAIN_DISTANCE - 2
}, {
  maxRadius: MAIN_RADIUS - 3,
  dir: -72 * 4 + 10,
  distance: MAIN_DISTANCE
}];

var COLORS = function () {
  var colors = ["#AA005B", "#4E2897", "#2203A3", "#006782", "#00826E", "#00BF1E", "#7E4E00", "#990000"];
  return [].concat(colors, [colors[0]]);
}();
var COUNTER = 0;

$(function () {
  var snap = Snap("#svg");
  var gui = new dat.GUI();

  var satellites = SATELLITE_DATA.map(function (s, i) {
    var satellite = new Satellite(snap, s.dir, s.distance, i, s.maxRadius, 0);
    _.delay(function () {
      return satellite.animateIn();
    }, DELAY_TIME * i);
    var folder = gui.addFolder("satellite-0" + i);
    folder.add(satellite, "maxR", 0, 32);
    folder.add(satellite, "minR", 0, 32);
    folder.add(satellite, "cx", 50, 150).onChange(function () {
      satellite.renderPosition();
    });
    folder.add(satellite, "cy", 50, 150).onChange(function () {
      satellite.renderPosition();
    });
    folder.add(satellite, "distance", 0, 50).onChange(function () {
      satellite.renderPosition();
    });
    folder.add(satellite, "dir", 0, 360).onChange(function () {
      satellite.renderPosition();
    });
    return satellite;
  });

  var sibling = new Satellite(snap, 0, MAIN_DISTANCE - 0, 0, 12, 5, 5);
  sibling.animateIn();
  var sibling2 = new Satellite(snap, 20, MAIN_DISTANCE - 10, 0, 10, 5, 5);
  sibling2.animateIn();

  $("#mainCircle").addClass("animate");
  setTimeout(function () {
    $("#mainCircle").removeClass("animate");
  }, DURATION_TIME * 2 + DELAY_TIME * (SATELLITE_DATA.length - 1) * 2);

  setInterval(function () {
    $("#mainCircle").addClass("animate");
    sibling.animateIn();
    sibling2.animateIn();
    satellites.forEach(function (s, i) {
      _.delay(function () {
        s.animateIn();
      }, DELAY_TIME * i);
    });
  }, DURATION_TIME * 2 + DELAY_TIME * (SATELLITE_DATA.length - 1) * 2);

  gradient(snap, [].concat(_toConsumableArray(satellites), [sibling, sibling2, { svg: Snap("#mainCircle") }]))();
});

var gradient = function gradient(snap, elems) {
  return function () {
    var i = COUNTER % (COLORS.length - 1);
    var leftColor = COLORS[i];
    var rightColor = COLORS[i + 1];
    var g = snap.gradient("L(0, 0, 0, 0)" + rightColor + ":40-" + leftColor + ":60");
    elems.forEach(function (el) {
      el.svg.attr({ fill: g });
    });
    g.animate({ x1: 0, y1: 0, x2: 0, y2: 300 }, 5000, mina.easeout, gradient(snap, elems));

    COUNTER++;
  };
};

var Satellite = function () {
  function Satellite(snap, dir, distance, delayBase) {
    var maxR = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 18;
    var minR = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var initR = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

    _classCallCheck(this, Satellite);

    this.cx = CENTER_X;
    this.cy = CENTER_Y;
    this.distance = distance;
    this.delayBase = delayBase;
    this.maxR = maxR;
    this.minR = minR;
    this.dir = dir;

    this.svg = snap.circle(this.getX(), this.getY(), initR).attr({
      fill: COLOR
    }).addClass("filter");
  }

  _createClass(Satellite, [{
    key: "renderPosition",
    value: function renderPosition() {
      this.svg.attr({
        cx: this.getX(),
        cy: this.getY() });
    }
  }, {
    key: "getX",
    value: function getX() {
      return this.cx + getAddXfromDir(this.dir, this.distance);
    }
  }, {
    key: "getY",
    value: function getY() {
      return this.cy + getAddYfromDir(this.dir, this.distance);
    }
  }, {
    key: "animateIn",
    value: function animateIn() {
      this.svg.animate({
        r: this.maxR
      }, DURATION_TIME, mina.easeinout, this.animateOut.bind(this));
    }
  }, {
    key: "animateOut",
    value: function animateOut() {
      var _this = this;

      var delay = DELAY_TIME * (SATELLITE_DATA.length - 1 - this.delayBase) * 2;
      _.delay(function () {
        _this.svg.animate({
          r: _this.minR
        }, DURATION_TIME, mina.easeinout);
      }, delay);
    }
  }]);

  return Satellite;
}();

;

var getRandomInt = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
var getAddXfromDir = function getAddXfromDir(dir, distance) {
  return Math.cos(toRadian(dir)) * distance;
};
var getAddYfromDir = function getAddYfromDir(dir, distance) {
  return Math.sin(toRadian(dir)) * distance;
};
var toRadian = function toRadian(dir) {
  return dir * Math.PI / 180;
};