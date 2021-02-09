import { options } from './config';
import { Preloader } from './preloader';

/*==============================*/
/*==============================*/
/*     MODULE SMOOTHSCROLL      */
/*==============================*/
/*==============================*/

var SmoothScroll = function (config = {}, viewPortclass = null) {
    this.name = 'scroll';
    this.DOM = {};
    this.config = {};
    this.move = {};
    this.callback = [];
    this.scrollStatut = 'start';
  
    this.init(config, viewPortclass);
};
  
  
SmoothScroll.prototype = function () {
  
    /***********************
     ****** PRIVATES ******
     **********************/
  
    /**
    /*  EVENTS - events binded to the DOM through addEventListener  */
    /*  @param {object} e - event properties */
    /* */
  
    const _onWheel = function (e) {
        //   e.preventDefault(); //need it here ?
        const dir = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        this.move.dest += (this.runFirefox && e.deltaMode == 1) ? dir * this.config.speed * this.config.multFirefox : dir * this.config.speed;
  
        _requestTick.call(this); // start animation
    };
  
    const _onTouchStart = function (e) {
        const t = (e.targetTouches) ? e.targetTouches[0] : e;
        this.move.touch = {
            pageY:  t.pageY,
            pageX: t.pageX
        };
    };
  
    const _onTouchMove = function (e) {
        const t = (e.targetTouches) ? e.targetTouches[0] : e;
        const moveY = t.pageY;
        const moveX = t.pageX;
        const dir = Math.abs(t.pageY - this.move.touch.pageY) > Math.abs(t.pageX - this.move.touch.pageX) ? 'pageY' : 'pageX';
        const move = (dir === "pageY" ? moveY : moveX);

        this.move.dest += -(move -  this.move.touch[dir]) * this.config.touchSpeed; //mouvement

        this.move.touch = {
            pageY: moveY,
            pageX: moveX
        }; // update touch
  
        _requestTick.call(this); // start animation
    };
  
    const _onKeydown = function (e) {
        if (e.keyCode === 38 || e.keyCode === 40) e.preventDefault();
  
        // if downKey is pressed, then jump + else if upKey is pressed, then jump - else 0
        this.move.dest += e.keyCode === 38 ? -this.config.jump : (e.keyCode === 40 ? this.config.jump : 0); // 38 up arrow && 40 down arrow
  
        _requestTick.call(this); // start animation
    };
  
    const _onScroll = function (e) {
        this.move.dest = window.scrollY || window.pageYOffset;
        _requestTick.call(this); // start animation
    };
  
  
    /**
    /*  REQUEST-TICK - request an animation from rAF if rAF is available  */
    /* */
    const _requestTick = function () {
        if (!this.config.ticking) {
            this.rAF = requestAnimationFrame(_update.bind(this));
            this.config.ticking = true; // wait for a ticket before request a new rAF
        }
    },
  
  
    /**
    /*  UPDATE - run animation in requestAnimationFrame  */
    /* */
    _update = function () {
        cancelAnimationFrame(this.rAF);
        this.rAF = requestAnimationFrame(_update.bind(this));
        
        // scroll action in function of scroll position (statut) -> a passer en fonction de callback ?
        if(this.move.dest >= this.config.scrollMax && this.scrollStatut !== 'end'){
            // this.config.scrollFuncs.endFunc(); --> ajouter un event
            this.scrollStatut = 'end';
        } else if(this.move.dest <= 0 && this.scrollStatut !== 'start') {
            // this.config.scrollFuncs.startFunc(); // ajouter un event
            this.scrollStatut = 'start';

        } else if (this.move.dest > 0 && this.move.dest < this.config.scrollMax && this.scrollStatut !== 'running') {
            // this.config.scrollFuncs.runningFunc(); --> ajouter un event - diff avec callback général ?
            this.scrollStatut = 'running';
        }

        // get scroll Level inside body size
        this.move.dest = Math.round(Math.max(0, Math.min(this.move.dest, this.config.scrollMax)));

        // calc new value of scroll if there was a scroll
        if (this.move.prev !== this.move.dest) {
            this.move.current += (this.move.dest - this.move.current) * this.config.delay;
  
            // update scroll && parallax positions
            const moveTo = -this.move.current.toFixed(2);

            // iterate over section and update translate and visibility
            for (let i = this.sections.length - 1; i >= 0; i--) {

                // check if section should move (inView)
                if (this.move.current > this.sections[i].offset && this.move.current < this.sections[i].limit) {
                    this.sections[i].el.style.transform = this.enableSmoothScroll && !this.prevent && `translate3D(${this.config.direction === 'horizontal' ? moveTo : 0}px,${this.config.direction === 'vertical' ? moveTo : 0}px, 0)`;
                    !this.sections[i].isInView && (this.sections[i].el.style.visibility = 'visible');
                    this.sections[i].isInView = true;
                } else {
                    this.sections[i].isInView && (this.sections[i].el.style.visibility = 'hidden');
                    this.sections[i].isInView = false;
                }
            }
            // this.DOM.scroller.style.transform = this.enableSmoothScroll && !this.prevent && `translate3D(${this.config.direction === 'horizontal' ? moveTo : 0}px,${this.config.direction === 'vertical' ? moveTo : 0}px, 0)`;
            if (this.callback.length > 0) {
                this.callback.forEach(fn => typeof fn === "function" && (fn(moveTo, this.move.prev, this.config.scrollMax)));
            }
  
            this.move.prev = Math.round(this.move.current);
        } else {
            this.config.ticking = false;
            cancelAnimationFrame(this.rAF);
        }
    },
  
  
    /**
    /*  DOM-EVENT - bind / unbind events to the DOM  */
    /*  @param {string} method - bind / unbind */
    /* */
    _domEvent = function (method = 'bind') {
  
        const listener = method === 'bind' ? 'addEventListener' : (method === 'unbind' ? 'removeEventListener' : null);
        if (listener === null) throw "_domEvent function - wrong method! expect 'bind' || 'unbind' : got " + method;
  
        //Add/remove resize event
        if (this.config.resize === true) {
            this._resize = this._resize || resize.bind(this)
            window[listener]('resize', this._resize, false);
        }
  
        // on/off smooth scroll events on device
        if (this.enableSmoothScroll) {
  
            // Events modifications
            this.deviceHasEvents.wheel && (this._wheelFunc || (this._wheelFunc = _onWheel.bind(this))) && document[listener]('wheel', this._wheelFunc, false);
            this.deviceHasEvents.mouseWheel && (this._mouWheelFunc || (this._mouWheelFunc = _onWheel.bind(this))) && document[listener]('mousewheel', this._mouWheelFunc, false);
            this.deviceHasEvents.keys && (this._keysFunc || (this._keysFunc = _onKeydown.bind(this))) && document[listener]('keydown', this._keysFunc, false);
  
            if (this.deviceHasEvents.touch) {
                !this._touchStatFunc && (this._touchStatFunc = _onTouchStart.bind(this));
                !this._touchMoveFunc && (this._touchMoveFunc = _onTouchMove.bind(this));
  
                document[listener]("touchstart", this._touchStatFunc);
                document[listener]("touchmove", this._touchMoveFunc);
            }
  
        } else if (this.config.parallax) {
            // bind scroll if touch is disabled and parallax enabled
            !this._scrollFunc && (this._scrollFunc = _onScroll.bind(this));
            document[listener]("scroll", this._scrollFunc, false);
        }
    },

    
  
  
    /**
    /*  PRELOAD - preload medias on the page -> get real height  */
    /* */
    // _preload = function () {
    //     const medias = [...this.DOM.scroller.querySelectorAll('img[src], video')];
    //     if (medias.length <= 0) return;
  
    //     const isPromise = window.Promise ? true : false;
    //     const isFetch = window.fetch ? true : false;
    //     const loading = isPromise ? [] : null;
  
    //     // funcs
        
    //     const promiseCallback = () => {
    //         // _getSize();
    //         this.resize();

    //         // start all function called in initFunc array
    //         if(this.config.initFuncs.length > 0) {
    //             this.config.initFuncs.forEach(fn => fn());
    //         }
    //     }
  
    //     // Loader
    //     medias.forEach((media, key, array) => {
  
    //         const eventType = media.nodeName.toLowerCase() === 'img' ? 'load' : 'loadstart';
    //         const el = document.createElement(media.nodeName.toLowerCase());

    //         if (isPromise) {
    //             let loader = null;
    //             if (isFetch) {
    //                 // If fetch available (no 400 error may be throwned - fetch only allow network error rejection)
    //                 loader = fetch(media.src)
    //                     .then(response => {
    //                         if (!response.ok) {
    //                             // make the promise be rejected if we didn't get a 2xx response
    //                             this.config.preloadFuncs.error(response);
    //                             throw new Error(response.url + " Is not a 2xx response")
    //                         } else {
    //                              return response
    //                         }
    //                     })
    //                     .catch(error => console.error('Fetch error: ' + error.message))
    //             } else {
    //                 // If at least one media is not available, an error is throwned -> initFuncs will not work art all 
    //                 loader = new Promise((resolve, reject) => {
    //                     el.src = media.src;

    //                     el.addEventListener(eventType, e => {
    //                             return resolve();
    //                     }, false);
    //                     el.addEventListener("error", e => {
    //                         this.config.preloadFuncs.error();
    //                         return reject(new Error("Media failed loading"));
    //                     }, false);
    //                 });
    //             }
    //             loading.push(loader);
  
    //         } else {
    //             // OLD way - No error message here (should add a timeout here for legacy)
    //             el.onloadstart = el.onload = () => {
    //                 array.splice(array.indexOf(media), 1);
    //                 array.length === 0 && promiseCallback();
    //             };
    //         }
    //     });
        
    //     isPromise && Promise.all(loading).then(values => { 
    //         promiseCallback()
    //     }).catch(error => {
    //         console.error(error.message)
    //     })
    // },
  
  
    /**
    /*  FIXED-VIEWPORT - block the viewport for smoothscroll with class or inline style */
    /* */
    _fixedViewPort = function () {
  
        // set the container sticky
        if (this.config.fixedClass) {
            this.DOM.container.classList.add(this.config.fixedClass);
        } else {
            this.DOM.container.style.overflow = 'hidden';
            this.DOM.container.style.height = '100vh';
            if ('CSS' in window && CSS.supports('overscroll-behavior', 'none')) {
                document.body.style.overscrollBehavior = 'none';
            } else {
                document.body.style.overflow = 'hidden';
            }
        }
        return true;
    },


    /**
    /*  ADD-SECTION - Create info and observer for section on the page  */
    /* */
    _addSection = function () {
        this.sections = [];

        let sections = this.DOM.scroller.querySelectorAll(`[data-${this.name}-section]`);
        if (sections.length === 0) {
           sections = [this.DOM.scroller];
        }

        //create observer and info for each section
        [...sections].forEach(section => {
            const sectionData = {};
            
            sectionData.isInView = false;
            sectionData.el = section;
            sectionData.boundrect = sectionData.el.getBoundingClientRect()

            // set section disposition
            if (this.config.direction === "vertical") {
                sectionData.offset = sectionData.boundrect.top - (window.innerHeight * 1.5) - _getTranslate(sectionData.el).y;
                sectionData.limit = sectionData.offset + sectionData.boundrect.height + (window.innerHeight * 2);
            } else {
                sectionData.offset = sectionData.boundrect.left - (window.innerWidth * 1.5) - _getTranslate(sectionData.el).x;
                sectionData.limit = sectionData.offset + sectionData.boundrect.width + (window.innerWidth * 2);
            }

            // add section info
            this.sections.push(sectionData)
        })

        //generate section order -> in order of apparition
        this.sections.sort((a, b) => this.config.direction === 'vertical' ? a.boundrect.top - b.boundrect.top : a.boundrect.left - b.boundrect.left);
    },


    /**
    /*  DEVICE-DETECT-EVENT - get events browsers compatibility  */
    /* */
    _deviceDetectEvent = function () {
        return {
            wheel: 'onwheel' in document,
            mouseWheel: 'onmousewheel' in document,
            touch: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0),
            keys: 'onkeydown' in document
        }
    }, 


    /**
    /*  GET-TRANSLATE - get translation style utility  */
    /* */
    _getTranslate = function (el) {
        const translate = {}
        if(!window.getComputedStyle) return;
    
        const style = getComputedStyle(el);
        const transform = style.transform || style.webkitTransform || style.mozTransform;
    
        let mat = transform.match(/^matrix3d\((.+)\)$/);
        if(mat) return parseFloat(mat[1].split(', ')[13]);
    
        mat = transform.match(/^matrix\((.+)\)$/);
        translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
        translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;
    
        return translate;
    }

    
  
  
    /**********************
     ****** PUBLICS ******
     *********************/
  
    const init = function (config, viewPortclass) {
        /** VARIABLES  **/
        // config init
        Object.assign(this.config, options, config);
        
        // DOM elements init
        this.DOM.scroller = config.section;
        this.DOM.container = this.DOM.scroller.parentNode;
        
        // movement refresh variables init
        this.move = {
            current: 0,
            dest: 0,
            prev: 0,
            touch: 0
        };
  
        /** FUNCS **/
        // preload medias
        this.config.preload && new Preloader(this.DOM.scroller, [success => this.resize(), ...this.config.initFuncs]);
        
        // set scroll module size
        resize.call(this);
  
        // detect if the browser is Firefox
        this.runFirefox = navigator.userAgent.indexOf("Firefox") > -1;
  
        // get event compatibility and allowance for scroll
        this.deviceHasEvents = _deviceDetectEvent();
        this.enableSmoothScroll = !this.deviceHasEvents.touch || this.config.touch;

        // if parallax, get elements to move
        this.callback = this.config.callback;
  
        //bind events
        bindEvent.call(this);
    },
  
  
    /**
    /*  BIND-EVENT - bind events to the DOM && start rAF */
    /* */
    bindEvent = function () {
        this.enableSmoothScroll && _fixedViewPort.call(this);
        _domEvent.call(this, 'bind');
    },
  
  
    /**
    /*  UNBIND-EVENT - unbind events from the DOM && stop rAF */
    /* */
    unbindEvent = function () {
        _domEvent.call(this, 'unbind');
        if (typeof this.rAF !== 'undefined') {
            cancelAnimationFrame(this.rAF);
            this.rAF = null;
        }
    },
  
  
    /**
    /*  SCROLL-TO - scroll to given location */
    /* */
    scrollTo = function (dir, immediate = false) {
        this.move.dest = dir;
        immediate || (_requestTick.call(this)); // start animation
        immediate && (this.DOM.scroller.style.transform = this.enableSmoothScroll && `translate3D(${this.config.direction === 'horizontal' ? dir : 0}px,${this.config.direction === 'vertical' ? dir : 0}px, 0)`);
    },

    /**
    /*  SCROLL-OF - scroll of given path */
    /* */
    scrollOf = function (path, immediate = false) {
        this.move.dest += path;
        immediate || (_requestTick.call(this)); // start animation
        immediate && (this.DOM.scroller.style.transform = this.enableSmoothScroll && `translate3D(${this.config.direction === 'horizontal' ? dir : 0}px,${this.config.direction === 'vertical' ? dir : 0}px, 0)`);
        return 'true';
    },
  
  
    /**
    /*  RESIZE - recalc vars after a resize */
    /* */
    resize = function () {
        _addSection.call(this);
        this.config.scrollMax = this.getSize;
    },
  
  
    /**
    /*  DESTROY - destroy content */
    /* */
    destroy = function () {
        // if (this.prlx) {
        //     this.prlx = this.prlx.destroy();
        //     delete this.prlx;
        // }
  
        this.unbindEvent.call(this);
  
        for (let prop in this) {
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
        scrollTo,
        scrollOf,
        destroy
    }
  }();
  
  // SETTER / GETTER
  Object.defineProperty(SmoothScroll.prototype, "preventScroll", {
    set: function (state) { this.prevent = state; }
  });

  Object.defineProperty(SmoothScroll.prototype, "getSize", {
    get: function () { return this.config.direction === 'vertical' ? (this.DOM.scroller.offsetHeight - (document.documentElement.clientHeight || window.innerHeight)) : (this.DOM.scroller.offsetWidth - (document.documentElement.clientWidth || window.innerWidth))}
  });
  
  
  export { SmoothScroll };
  