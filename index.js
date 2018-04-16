
/*==============================*/
/*==============================*/
/*     MODULE SMOOTHSCROLL      */
/*==============================*/
/*==============================*/

var SmoothScroll = function(config = {}, viewPortclass = null){
  this.DOM = {};
  this.config = {};
  this.move = {};
  this.prlxItems = [];

  this.init(config, viewPortclass);
};


SmoothScroll.prototype = function(){

  /***********************
   ****** PRIVATES ******
   **********************/

  /**
  /*  EVENTS - events binded to the DOM through addEventListener  */
  /*  @param {object} e - event properties */
  /* */

  const _onWheel = function(e){
    e.preventDefault(); //need it here ?
    this.move.destY += (this.runFirefox && e.deltaMode == 1) ? (e.deltaY * this.config.speed) * this.config.multFirefox : e.deltaY * this.config.speed;

    _requestTick.call(this); // start animation
  };

  const _onMouseWheel = function(e){
    e.preventDefault(); //need it here ?
    this.move.destY += (e.wheelDeltaY) ? e.wheelDeltaY * -1 : e.wheelDelta;

    _requestTick.call(this); // start animation
  };

  const _onTouchStart = function(e){
		const t = (e.targetTouches) ? e.targetTouches[0] : e;
		this.move.touchY = t.pageY;
  };

  const _onTouchMove = function(e) {
		e.preventDefault();
		const t = (e.targetTouches) ? e.targetTouches[0] : e;

		this.move.destY += (t.pageY - this.move.touchY) * this.config.touchSpeed; //mouvement
		this.move.touchY = t.pageY; // update touch

    _requestTick.call(this); // start animation
	};

  const _onKeydown = function(e) {
    if(e.keyCode === 38 || e.keyCode === 40) e.preventDefault();

    // if downKey is pressed, then jump + else if upKey is pressed, then jump - else 0
    this.move.destY += e.keyCode === 38 ? -this.config.jump : (e.keyCode === 40 ? this.config.jump : 0); // 38 up arrow && 40 down arrow

    _requestTick.call(this); // start animation
	};

  const _onScroll = function(e){
    this.move.destY = window.scrollY || window.pageYOffset;
    _requestTick.call(this); // start animation
  };


  /**
  /*  REQUEST-TICK - request an animation from rAF if rAF is available  */
  /* */
  const _requestTick = function(){
    if(!this.config.ticking) {
      this.rAF = requestAnimationFrame(_update.bind(this));
      this.config.ticking = true; // wait for a ticket before request a new rAF
    }
  },


  /**
  /*  UPDATE - run animation in requestAnimationFrame  */
  /* */
  _update = function(){

    this.rAF = requestAnimationFrame(_update.bind(this));

    // get scroll Level inside body size
    this.move.destY = this.prevent || Math.round(Math.max(0, Math.min(this.move.destY, this.config.scrollMax)));

    // calc new value of scroll if there was a scroll
    if(this.move.prevY !== this.move.destY){

      if(!this.prevent){

        this.move.currentY += (this.move.destY - this.move.currentY) * this.config.delay;

        // update scroll && parallax positions
        const moveTo = -this.move.currentY.toFixed(2);
        this.DOM.scroller.style.transform = this.enableSmoothScroll && !this.prevent && `translate3D(0,${moveTo}px, 0)`;
        this.prlxItems && this.prlxItems.update(moveTo);

        this.move.prevY = Math.round(this.move.currentY);

      }

    }else{
      this.config.ticking = false;
      cancelAnimationFrame(this.rAF);
    }
  },


  /**
  /*  DOM-EVENT - bind / unbind events to the DOM  */
  /*  @param {string} method - bind / unbind */
  /* */
  _domEvent = function(method = 'bind'){
    const listener = method === 'bind' ? 'addEventListener' : (method === 'unbind' ? 'removeEventListener' : null);
    if(listener === null) throw "_domEvent function - wrong method! expect 'bind' || 'unbind' : got " + method;

    // on/off smooth scroll events on device
    if(this.enableSmoothScroll){

      // Events modifications
      this.deviceHasEvents.wheel && (this._wheelFunc || (this._wheelFunc = _onWheel.bind(this))) && document[listener]('wheel', this._wheelFunc, false);
      this.deviceHasEvents.mouseWheel && (this._mouWheelFunc || (this._mouWheelFunc = _onWheel.bind(this))) && document[listener]('mousewheel', this._mouWheelFunc, false);
      this.deviceHasEvents.keys  && (this._keysFunc || (this._keysFunc = _onKeydown.bind(this))) && document[listener]('keydown', this._keysFunc, false);

      if(this.deviceHasEvents.touch){
        !this._touchStatFunc && (this._touchStatFunc = _onTouchStart.bind(this));
        !this._touchMoveFunc && (this._touchMoveFunc = _onTouchMove.bind(this));

        document[listener]("touchstart", this._touchStatFunc);
        document[listener]("touchmove", this._touchMoveFunc);
      }

    }else if(this.config.parallax){
      // bind scroll if touch is disabled and parallax enabled
      !this._scrollFunc && (this._scrollFunc = _onScroll.bind(this));
      document[listener]("scroll", this._scrollFunc, false);
    }
  },


/**
/*  PRELOAD - preload medias on the page -> get real height  */
/* */
_preload = function(){
  const medias = [...this.DOM.scroller.querySelectorAll('img, video')];
  if(medias.length <= 0){
    this.config.scrollMax = this.DOM.scroller.offsetHeight - (document.documentElement.clientHeight || window.innerHeight);
    return;
  }

  const isPromise = window.Promise ? true : false;
  const loading = isPromise ? [] : null;

  const getSize = () => {
    this.config.scrollMax = this.DOM.scroller.offsetHeight - (document.documentElement.clientHeight || window.innerHeight);
  };

  medias.forEach((media, key, array) => {

    const eventType = media.nodeName.toLowerCase() === 'img' ? 'load' : 'loadstart';
    const el = document.createElement(media.nodeName.toLowerCase());

    if(isPromise){
      const loader = new Promise((resolve, error) => {
        el.addEventListener(eventType, () => {
          resolve();
        }, false);
      });
      loading.push(loader);

    }else{
      el.onloadstart = el.onload = () => {
        array.splice(array.indexOf(media), 1);
        array.length === 0 && getSize();
      };
    }

    el.src = media.src;

  });

  isPromise && Promise.all(loading).then( values => { getSize() });
},


  /**
  /*  FIXED-VIEWPORT - block the viewport for smoothscroll with class or inline style */
  /* */
  _fixedViewPort = function(){

    // set the container sticky
    if(this.config.fixedClass){
      this.DOM.container.classList.add(this.config.fixedClass);
    }else{
      this.DOM.container.style.overflow = 'hidden';
      this.DOM.container.style.height = '100vh';
    }
    return true;
  },


  /**
  /*  DEVICE-DETECT-EVENT - get events browsers compatibility  */
  /* */
  _deviceDetectEvent = function(){
    return {
      wheel: 'onwheel' in document,
      mouseWheel: 'onmousewheel' in document,
      touch: 'ontouchstart' in document,
      keys: 'onkeydown' in document
    }
  };


  /**********************
   ****** PUBLICS ******
   *********************/

  const init = function(config, viewPortclass){

    // DOM elements
    this.DOM.scroller =  document.querySelector('.js-scroller');
    this.DOM.container = this.DOM.scroller.parentNode;

    // configurations
    this.config = {
      delay: config.delay || .1,
      speed: config.speed || 1,
      touchSpeed: config.touchSpeed || 1.5,
      jump: config.jump || 110,
      parallax: config.parallax || false,
      touch: config.touch || false,
      fixedClass: viewPortclass || false,
      multFirefox: 15,
      scrollMax: 0,
      ticking: false
    };

    // movement refresh variables
    this.move = {
      currentY: 0,
      destY: 0,
      prevY: 0,
      touchY: 0
    };

    // preload medias
    _preload.call(this);

    // detect if the browser is Firefox
    this.runFirefox = navigator.userAgent.indexOf("Firefox") > -1;

    // get event compatibility and allowance for scroll
    this.deviceHasEvents = _deviceDetectEvent();
    this.enableSmoothScroll = !this.deviceHasEvents.touch || this.config.touch;

    // if parallax, get elements to move
    this.prlxItems = this.config.parallax ? new Parallax() : null;

    //bind events
    bindEvent.call(this);
  },


  /**
  /*  BIND-EVENT - bind events to the DOM && start rAF */
  /* */
  bindEvent = function(){
    this.enableSmoothScroll && _fixedViewPort.call(this);
    _domEvent.call(this, 'bind');
  },


  /**
  /*  UNBIND-EVENT - unbind events from the DOM && stop rAF */
  /* */
  unbindEvent = function(){
    _domEvent.call(this, 'unbind');
    if(typeof this.rAF !== 'undefined'){
      cancelAnimationFrame(this.rAF);
      this.rAF = null;
    }
  },


  /**
  /*  SCROLL-TO - scroll to given location */
  /* */
  scrollTo = function(dir, immediate = false){
    this.move.destY = dir;
    immediate || (_requestTick.call(this)); // start animation
    immediate && (this.DOM.scroller.style.transform = this.enableSmoothScroll && `translate3D(0,${dir}px, 0)`);
  },


  /**
  /*  RESIZE - recalc vars after a resize */
  /* */
  resize = function(){
    this.config.scrollMax = this.DOM.scroller.offsetHeight - (document.documentElement.clientHeight || window.innerHeight);
  };


  /**
  /*  DESTROY - destroy content */
  /* */
  destroy = function(){
    this.prlx = this.prlx.destroy();
    delete this.prlx;

    this.unbindEvent.call(this);

    for(let prop in this){
      if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;

      this[prop] = null;
      delete this[prop];
    }

    return null;
  };


  return {
    init,
    resize,
    bindEvent,
    unbindEvent,
    destroy
  }
}();

// SETTER / GETTER
Object.defineProperty(SmoothScroll.prototype, "preventScroll", {
  set: function(state) { this.prevent = state; }
});


export { SmoothScroll };
