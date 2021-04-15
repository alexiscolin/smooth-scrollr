import { options } from './modules/config';
import { Preloader } from './modules/preloader';
import { Events } from './modules/events';
import { getTranslate } from './modules/utils';

/*==============================*/
/*==============================*/
/*     MODULE SMOOTHSCROLL      */
/*==============================*/
/*==============================*/

var SmoothScrollr = function SmoothScrollr(config = {}) {
    this.DOM = {};
    this.config = {};
    this.move = {};
    this.sections = [];
  
    this.init(config);
};
  
  
SmoothScrollr.prototype = function () {
  
    /***********************
     ****** PRIVATES ******
     **********************/
    /**
    /*  VARIABLES
    /* */
    const callbackslisteners = {};
    const bindedlisteners = {};
    const global = {};

  
    /**
    /*  REQUEST-TICK - request an animation from rAF if rAF is available  */
    /* */
    const _requestTick = function _requestTick () {
        if (!this.config.ticking) {
            this.rAF = requestAnimationFrame(_update.bind(this));
            this.config.ticking = true; // wait for a ticket before request a new rAF
        }
    },
  
    /**
    /*  UPDATE - run animation in requestAnimationFrame  */
    /* */
    _update = function _update() {
        cancelAnimationFrame(this.rAF);
        this.rAF = requestAnimationFrame(_update.bind(this));
        
        // scroll action in function of scroll position (statut)
        if(this.move.dest >= this.config.scrollMax && this.scrollStatut !== 'end'){
            if (callbackslisteners.collisionBottom && callbackslisteners.collisionBottom.length > 0) {
                _scrollCallback.call(this, 'collisionBottom');
            }
            this.scrollStatut = 'end';
        } else if(this.move.dest <= 0 && this.scrollStatut !== 'start') {
            if (callbackslisteners.collisionTop && callbackslisteners.collisionTop.length > 0) {
                _scrollCallback.call(this, 'collisionTop');
            }
            this.scrollStatut = 'start';

        } else if (this.move.dest > 0 && this.move.dest < this.config.scrollMax && this.scrollStatut !== 'running') {
            if (callbackslisteners.collisionEnded && callbackslisteners.collisionEnded.length > 0) {
                _scrollCallback.call(this, 'collisionEnded');
            }
            this.scrollStatut = 'running';
        }

        // get scroll Level inside body size
        this.move.dest = this.prevent ? this.move.current : Math.round(Math.max(0, Math.min(this.events.dest, this.config.scrollMax)));
        this.events.dest = this.move.dest;

        // cancel or not the scroll
        if(this.prevent) {
            this.move.prev = this.move.dest;
            this.events.dest = this.events.dest
        } else {
            this.move.dest = Math.round(Math.max(0, Math.min(this.events.dest, this.config.scrollMax)));
            this.events.dest = this.move.dest;    
        }

        // calc new value of scroll if there was a scroll
        if (this.move.prev !== this.move.dest) {
            this.move.current += this.prevent ? 0 : (this.move.dest - this.move.current) * this.config.delay;
  
            // update scroll && parallax positions
            this.move.position = -this.move.current.toFixed(2);

            // iterate over section and update translate and visibility
            for (let i = this.sections.length - 1; i >= 0; i--) {

                // check if section should move (inView)
                if (this.move.current > this.sections[i].offset && this.move.current < this.sections[i].limit) {
                    this.sections[i].el.style.transform = this.events.enableSmoothScroll && !this.prevent && `translate3D(${this.config.direction === 'horizontal' ? this.move.position : 0}px,${this.config.direction === 'vertical' ? this.move.position : 0}px, 0)`;
                    !this.sections[i].isInView && (this.sections[i].el.style.visibility = 'visible');
                    this.sections[i].isInView = true;
                } else {
                    this.sections[i].isInView && (this.sections[i].el.style.visibility = 'hidden');
                    this.sections[i].isInView = false;
                }
            }

            // scroll callbacks
            if (callbackslisteners.scroll && callbackslisteners.scroll.length > 0) {
                _scrollCallback.call(this, 'scroll');
            }
  
            this.move.prev = Math.round(this.move.current);
        } else {
            this.config.ticking = false;
            cancelAnimationFrame(this.rAF);
        }
    },  
  
    /**
    /*  FIXED-VIEWPORT - block the viewport for smoothscroll with class or inline style */
    /* */
    _fixedViewPort = function _fixedViewPort() {
  
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
    _addSection = function _addSection() {
        this.sections = [];
        let sections = this.DOM.scroller.querySelectorAll(`[data-scroll-container]`);
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
                sectionData.offset = sectionData.boundrect.top - (window.innerHeight * 1.5) - getTranslate(sectionData.el).y;
                sectionData.limit = sectionData.offset + sectionData.boundrect.height + (window.innerHeight * 2);
            } else {
                sectionData.offset = sectionData.boundrect.left - (window.innerWidth * 1.5) - getTranslate(sectionData.el).x;
                sectionData.limit = sectionData.offset + sectionData.boundrect.width + (window.innerWidth * 2);
            }

            // add section info
            this.sections.push(sectionData)
        })

        //generate section order -> in order of apparition
        this.sections.sort((a, b) => this.config.direction === 'vertical' ? a.boundrect.top - b.boundrect.top : a.boundrect.left - b.boundrect.left);
    },

    /**
    /*  _SCROLL-CALLBACKS - fire event */
    /* */
    _scrollCallback = function _scrollCallback(event = 'scroll') {
        const scrollEvent = new Event(`on-${event}`);
        this.DOM.scroller.dispatchEvent(scrollEvent);
    },

    /**
    /*  _LIST-CALLBACKS - events callbacks actions  */
    /* */
    _listCallbacks = function _listCallbacks(e) {
        // get real name
        const eventName = e.type.replace('on-','');
        // get the global list of dedicated event
        const list = callbackslisteners[eventName];

        if (!list || list.length === 0) return;

        // call the right callback with dedicated arguments
        list.forEach((callback) => {
            if(typeof callback !== "function") return;
            switch (eventName) {
                case 'scroll':
                    return callback(this.move);
                default:
                    return callback();
            }
        });
    },

    /**
    /*  BIND-EVENT - bind events to the DOM && start rAF */
    /* */
    _bindEvent = function _bindEvent() {
        this.events.enableSmoothScroll && _fixedViewPort.call(this);
        this.events.domEvent('bind');

        // add resize event
        if (this.config.resize === true) {
            global.resize = resize.bind(this);
            this.on('resize', global.resize, window);
        }
    },
    
    /**
    /*  UNBIND-EVENT - unbind events from the DOM && stop rAF */
    /* */
    _unbindEvent = function _unbindEvent() {
        // remove internal scroll events
        this.events.domEvent('unbind');


        // // remove resize event
        if (this.config.resize === true) {
            this.off('resize', global.resize, window);
        }

        // remove external events - recursive named iife to avoid breaking foreach erasing itself loop or "deep copy perf issue" 
        for (let [key, value] of Object.entries(callbackslisteners)) {
            (function deleteVal () {
                off.call(this, key, value[value.length - 1])
                if(value.length > 0) deleteVal.call(this)
            }).call(this);
        }

        // remove rAF
        if (typeof this.rAF !== 'undefined') {
            cancelAnimationFrame(this.rAF);
            this.rAF = null;
        }
    };

  
    /**********************
     ****** PUBLICS ******
     *********************/
  
    const init = function init(config) {
        /** VARIABLES  **/
        // config init
        Object.assign(this.config, options, config);

        this.scrollStatut = 'start';

        
        // DOM elements init
        this.DOM.scroller = config.section;
        this.DOM.container = this.DOM.scroller.parentNode;
        
        // movement refresh variables init
        this.move = {
            current: 0,
            dest: 0,
            prev: 0
        };

        // prevent scroll init
        this.prevent = false;
  
        /** FUNCS **/
        // preload medias
        if(this.config.preload){
            this.preload = new Preloader(this.DOM.scroller, [success => this.resize(), ...this.config.initFuncs]);
        } else {
            this.config.initFuncs && this.config.initFuncs.forEach(fn => fn());
        } 
        // set scroll module size
        resize.call(this);
  
  
        //bind events
        const eventOpt = (({touch, parallax, speed, multFirefox, touchSpeed, jump, section}) => ({touch, parallax, speed, multFirefox, touchSpeed, jump, section}))(this.config);
        this.events = new Events(eventOpt, _requestTick.bind(this));
        _bindEvent.call(this);
        
    },

    /**
    /*  GET-SIZE - get container size */
    /* */
    getSize = function getSize() { 
        const dirVert = this.config.direction === 'vertical';
        let size = dirVert ? (this.DOM.scroller.offsetHeight - (document.documentElement.clientHeight || window.innerHeight)) : (this.DOM.scroller.offsetWidth - (document.documentElement.clientWidth || window.innerWidth))
       
        // if parent doesn't wrap completely section children
        // if (size === 0) {
            // size = this.sections.reduce((result, section) => result + (this.config.direction === 'vertical' ? section.boundrect.height : section.boundrect.width), 0);
            // size -= dirVert ? (document.documentElement.clientHeight || window.innerHeight) : (document.documentElement.clientWidth || window.innerWidth);
        // }
        return size;
    },

    /**
    /*  SCROLL-TO - scroll to given location */
    /* */
    scrollTo = function scrollTo(dir, immediate = false) {
        this.move.dest = dir;
        immediate || (_requestTick.call(this)); // start animation
        immediate && (this.DOM.scroller.style.transform = this.events.enableSmoothScroll && `translate3D(${this.config.direction === 'horizontal' ? dir : 0}px,${this.config.direction === 'vertical' ? dir : 0}px, 0)`);
    },

    /**
    /*  SCROLL-OF - scroll of given path */
    /* */
    scrollOf = function scrollOf(path, immediate = false) {
        this.move.dest += path;
        immediate || (_requestTick.call(this)); // start animation
        immediate && (this.DOM.scroller.style.transform = this.events.enableSmoothScroll && `translate3D(${this.config.direction === 'horizontal' ? dir : 0}px,${this.config.direction === 'vertical' ? dir : 0}px, 0)`);
        return 'true';
    },

    /**
    /*  RESIZE - recalc vars after a resize */
    /* */
    resize = function resize() {
        _addSection.call(this);
        this.config.scrollMax = getSize.call(this);
    },

    /**
    /*  PREVENT-SCROLL - recalc vars after a resize */
    /* */
    preventScroll = function preventScroll(state) {
        this.prevent = state;
    },

    /**
    /*  ON - public event binder */
    /* */
    on = function on(event, cb, context = this.DOM.scroller) {
        const events = [
            'scroll',
            'collisionTop',
            'collisionBottom',
            'collisionEnded',
            'resize'
        ]
        if (!events.includes(event)) throw "'on' function - wrong event! : got " + event;

        // test if there are at least one event
        if (!callbackslisteners[event]) {
            callbackslisteners[event] = [];
        }

        const list = callbackslisteners[event];
        list.push(cb);

        // listen if related function
        if (list.length === 1) {
            bindedlisteners[event] = _listCallbacks.bind(this);
            context.addEventListener(context !== window ? 'on-' : '' + event, bindedlisteners[event], false);
        }
    },

    /**
    /*  OFF - remove public events */
    /* */
    off = function off(event, cb, context = this.DOM.scroller) {
        const list = callbackslisteners[event];
        // remove event from original events listing index
        list.forEach((el, index) => el === cb && list.splice(index,1))

        // if no more event, remove the listener
        if (list.length === 0) {
            context.removeEventListener(context !== window ? 'on-' : '' + event, bindedlisteners[event], false);
            delete bindedlisteners[event];
        }
    },
  
    /**
    /*  DESTROY - destroy content */
    /* */
    destroy = function destroy() {

        if(this.preload) this.preload.destroy()
  
        _unbindEvent.call(this);
        this.events.destroy()
  
        for (let prop in this) {
            if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
            this[prop] = null;
            delete this[prop];
        }
  
        return null;
    };
  
    return {
        init,
        getSize,
        on,
        off,
        resize,
        scrollTo,
        scrollOf,
        preventScroll,
        destroy
    }
  }();
  
  export { SmoothScrollr };
  