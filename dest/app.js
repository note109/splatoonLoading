"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COLOR = "#C7FF18";
var CENTER_X = 100;
var CENTER_Y = 100;

var DELAY_TIME = 250;
var DURATION_TIME = 3000;
var MAIN_RADIUS = 16;
var MAIN_DISTANCE = 25;
var SATELLITE_DATA = [{
  maxRadius: MAIN_RADIUS,
  dir: -72 * 1,
  distance: MAIN_DISTANCE
}, {
  maxRadius: MAIN_RADIUS,
  dir: -72 * 2,
  distance: MAIN_DISTANCE
}, {
  maxRadius: MAIN_RADIUS,
  dir: -72 * 3,
  distance: MAIN_DISTANCE
}, {
  maxRadius: MAIN_RADIUS,
  dir: -72 * 4,
  distance: MAIN_DISTANCE
}];

var COLORS = function () {
  var colors = ["#AA005B", "#4E2897", "#2203A3", "#006782", "#00826E", "#00BF1E", "#7E4E00", "#990000"];
  return [].concat(colors, [colors[0]]);
}();
var COUNTER = 0;

$(function () {
  var snap = Snap("#svg");

  var satellites = SATELLITE_DATA.map(function (s, i) {
    var satellite = new Satellite(snap, s.dir, s.distance, i, s.maxRadius, 0);
    satellite.animateIn();
    return satellite;
  });
});

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

    this.svg = snap.circle(this.getX(dir), this.getY(dir), initR).attr({
      fill: "#C7FF18"
    }).addClass("filter");
  }

  _createClass(Satellite, [{
    key: "getX",
    value: function getX(dir) {
      return this.cx + getAddXfromDir(dir, this.distance);
    }
  }, {
    key: "getY",
    value: function getY(dir) {
      return this.cy + getAddYfromDir(dir, this.distance);
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
      this.svg.animate({
        r: this.minR
      }, DURATION_TIME, mina.easeinout, this.animateIn.bind(this));
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