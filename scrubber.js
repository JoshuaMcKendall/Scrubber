/*
 *  scrubber.js
 *  Scrubber
 */

'strict mode';

var Scrubber = (function() {

  function Scrubber(obj) {

    var selector = obj.selector.trim();

    this.name = obj.name || '';
    this.scrubber = document.querySelector(selector);
    this.scrubberFill = document.querySelector(selector + ' .scrubber__fill');
    this.scrubberBack = document.querySelector(selector + ' .scrubber__back');
    this.scrubberKnob = document.querySelector(selector + ' .scrubber__knob');
    //this.scrubberLoad = document.querySelector(selector + ' .scrubber__load');
    //this.scrubberTrack = document.querySelector(selector + ' .scrubber__track');

    this.scrubberBCR = this.scrubber.getBoundingClientRect().left;
    this.offsetLeft = this.scrubber.offsetLeft;
    this.clientWidth = this.scrubber.clientWidth;
    this.minValue = parseInt(obj.minValue, 10) || 0;
    this.maxValue = parseInt(obj.maxValue, 10) || 100;
    this.position = 0;
    this.percentage = 0;
    this.value = 0;


    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = this.onResize.bind(this);
    this.update = this.update.bind(this);

    this.tracking = false;

    this.init(obj);
    this.addEventListeners();
    this.onResize();

    requestAnimationFrame(this.update);
  }

  Object.defineProperty(Scrubber, 'percentage', {
    get: function() {
      return this.percentage;
    }
  });

  Object.defineProperty(Scrubber, 'value', {
    get: function() {
      return this.value;
    }
  });

  Scrubber.prototype.init = function (obj) {
    this.scrubber.style.display = 'block';
    this.scrubber.style.position = 'relative';
    this.scrubber.style.height = '15px';
    this.scrubber.style.width = '100%';

    this.scrubberKnob.style.background = obj.knobColor || 'Orange';
    this.scrubberFill.style.background = obj.fillColor || 'Orange';
  };

  Scrubber.prototype.onStart = function (evt) {
    if((evt.target === this.scrubberFill || evt.target === this.scrubberKnob || evt.target === this.scrubberBack) && (evt.which == 1)) {
      evt.preventDefault();
      evt.stopPropagation();
      if(this.percentage <= 100) {
        this.scrubberKnob.style.willChange = 'transform';
        this.clientWidth = this.scrubber.clientWidth;
        this.offsetLeft = this.scrubber.offsetLeft;
        this.position = evt.pageX || evt.touches[0].pageX;
        this.percentage = this.getPercentage();
        this.value = this.getValue();
        this.tracking = true;
      }
      return true;
    }
    return;
  };

  Scrubber.prototype.onMove = function (evt) {

    if(!this.tracking)
      return;
    if(!this.buttonPressed(evt)) {
      this.removeEventListeners();
    } else if(this.percentage <= 100) {
      this.position = evt.pageX || evt.touches[0].pageX;
      this.percentage = this.getPercentage();
      this.value = this.getValue();
      //console.log(this.name + ':', this.value, this.percentage + "%");
    }
    return true;
  };

  Scrubber.prototype.onEnd = function (evt) {
    if(!this.tracking)
      return;
    this.scrubberKnob.style.willChange = 'initial';
    this.percentage = this.getPercentage();
    this.value = this.getValue();
    this.tracking = false;
    return true;
  };

  Scrubber.prototype.update = function () {
    requestAnimationFrame(this.update);

    this.scrubberFill.style.width = this.percentage + '%';
    this.scrubberKnob.style.left = this.percentage + '%';
  };

  Scrubber.prototype.buttonPressed = function (evt) {
    if(evt.buttons == null)
      return evt.which != 0;
    else
      return evt.buttons != 0;
  };

  Scrubber.prototype.onResize = function (evt) {
    this.clientWidth = this.scrubber.clientWidth;
    this.offsetLeft = this.scrubber.offsetLeft;
  };

  Scrubber.prototype.getPercentage = function () {
    return Math.min(100, Math.ceil((Math.max(0, (this.position - this.offsetLeft) / this.clientWidth)) * 100));
  };

  Scrubber.prototype.getValue = function () {
    return Math.min(this.maxValue, this.maxValue * (this.percentage / 100));
  };

  Scrubber.prototype.addEventListeners = function () {
    document.addEventListener('mousedown', this.onStart);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
    window.addEventListener('resize', this.onResize);

    document.addEventListener('touchstart', this.onStart);
    document.addEventListener('touchmove', this.onMove);
    document.addEventListener('touchend', this.onEnd);
  };

  Scrubber.prototype.removeEventListeners = function () {
    document.removeEventListener('mousedown', this.onStart);
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseup', this.onEnd);
    window.removeEventListener('resize', this.onResize);

    document.removeEventListener('touchstart', this.onStart);
    document.removeEventListener('touchmove', this.onMove);
    document.removeEventListener('touchend', this.onEnd);
  };

  return Scrubber;
})();

//examples

var red = new Scrubber({
  name: 'Red',
  minValue: 0,
  maxValue: 255,
  selector: ' .red ',
  knobColor: 'Red',
  fillColor: 'Red'
});

var green = new Scrubber({
  name: 'Green',
  minValue: 0,
  maxValue: 255,
  selector: ' .green ',
  knobColor: 'Green',
  fillColor: 'Green'
});

var blue = new Scrubber({
  name: 'Blue',
  minValue: 0,
  maxValue: 255,
  selector: ' .blue ',
  knobColor: 'Blue',
  fillColor: 'Blue'
});
