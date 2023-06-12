var Events = function (config, callback) {
  this.config = {};
  this.move = {};
  this.callback = null;

  this.init(config, callback);
};

Events.prototype = (function () {
  /**********************
   ****** PRIVATE *******
   *********************/

  /**
    /*  EVENTS - events binded to the DOM through addEventListener  */
  /*  @param {object} e - event properties */
  /* */
  const _onWheel = function _onWheel(e) {
    //   e.preventDefault(); //need it here ?
    const dir = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    this.move.dest += this.runFirefox && e.deltaMode == 1 ? dir * this.config.speed * this.config.multFirefox : dir * this.config.speed;
    this.callback(); // start animation
  };

  const _onTouchStart = function _onTouchStart(e) {
    const t = e.targetTouches ? e.targetTouches[0] : e;
    this.move.touch = {
      pageY: t.pageY,
      pageX: t.pageX,
    };
  };

  const _onTouchMove = function _onTouchMove(e) {
    const t = e.targetTouches ? e.targetTouches[0] : e;
    const moveY = t.pageY;
    const moveX = t.pageX;
    const dir = Math.abs(t.pageY - this.move.touch.pageY) > Math.abs(t.pageX - this.move.touch.pageX) ? "pageY" : "pageX";
    const move = dir === "pageY" ? moveY : moveX;

    this.move.dest += -(move - this.move.touch[dir]) * this.config.touchSpeed; //mouvement

    this.move.touch = {
      pageY: moveY,
      pageX: moveX,
    }; // update touch

    this.callback.call(this); // start animation
  };

  const _onKeydown = function _onKeydown(e) {
    if (e.keyCode === 38 || e.keyCode === 40) e.preventDefault();

    // if downKey is pressed, then jump + else if upKey is pressed, then jump - else 0
    this.move.dest += e.keyCode === 38 ? -this.config.jump : e.keyCode === 40 ? this.config.jump : 0; // 38 up arrow && 40 down arrow

    this.callback.call(this); // start animation
  };

  const _onScroll = function _onScroll(e) {
    this.move.dest = window.scrollY || window.pageYOffset;
    this.callback.call(this); // start animation
  };

  const _deviceDetectEvent = function _deviceDetectEvent() {
    return {
      wheel: "onwheel" in document,
      mouseWheel: "onmousewheel" in document,
      touch: "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
      keys: "onkeydown" in document,
    };
  };

  /**********************
   ****** PUBLIC ********
   *********************/

  const init = function init(config, callback) {
    Object.assign(this.config, config);
    this.config.listened = config.listened || this.config.section;
    this.callback = callback;

    // movement variables
    this.move = {
      dest: 0,
      touch: 0,
    };

    // detect if the browser is Firefox
    this.runFirefox = navigator.userAgent.indexOf("Firefox") > -1;

    this.deviceHasEvents = _deviceDetectEvent();
    this.enableSmoothScroll = !this.deviceHasEvents.touch || this.config.touch;
  };

  const domEvent = function domEvent(method = "bind") {
    const listener = method === "bind" ? "addEventListener" : method === "unbind" ? "removeEventListener" : null;
    if (listener === null) throw "_domEvent function - wrong method! expect 'bind' || 'unbind' : got " + method;

    // on/off smooth scroll events on device
    if (this.enableSmoothScroll) {
      // Events modifications
      this.deviceHasEvents.wheel && (this._wheelFunc || (this._wheelFunc = _onWheel.bind(this))) && this.config.listened[listener]("wheel", this._wheelFunc, false);
      this.deviceHasEvents.mouseWheel && (this._mouWheelFunc || (this._mouWheelFunc = _onWheel.bind(this))) && this.config.listened[listener]("mousewheel", this._mouWheelFunc, false);
      this.deviceHasEvents.keys && (this._keysFunc || (this._keysFunc = _onKeydown.bind(this))) && this.config.listened[listener]("keydown", this._keysFunc, false);

      if (this.deviceHasEvents.touch) {
        !this._touchStatFunc && (this._touchStatFunc = _onTouchStart.bind(this));
        !this._touchMoveFunc && (this._touchMoveFunc = _onTouchMove.bind(this));

        this.config.listened[listener]("touchstart", this._touchStatFunc);
        this.config.listened[listener]("touchmove", this._touchMoveFunc);
      }
    } else if (this.config.parallax) {
      // bind scroll if touch is disabled and parallax enabled
      !this._scrollFunc && (this._scrollFunc = _onScroll.bind(this));
      this.config.listened[listener]("scroll", this._scrollFunc, false);
    }
  };

  const enableSmoothScroll = function enableSmoothScroll() {
    return this.enableSmoothScroll;
  };

  const destroy = function destroy() {
    for (let prop in this) {
      if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
      this[prop] = null;
      delete this[prop];
    }

    return null;
  };

  return {
    init,
    domEvent,
    enableSmoothScroll,
    destroy,
  };
})();

export { Events };

Object.defineProperty(Events.prototype, "dest", {
  set: function (dir) {
    this.move.dest = dir;
  },
  get: function () {
    return this.move.dest;
  },
});
