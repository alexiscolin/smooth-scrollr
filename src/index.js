import { options } from './config';
import { Preloader } from './preloader';
import { Events } from './events';

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
    this.sections = [];
    this.callback = [];
    this.scrollStatut = 'start';
  
    this.init(config, viewPortclass);
};
  
  
SmoothScroll.prototype = function () {
  
    /***********************
     ****** PRIVATES ******
     **********************/
  
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
        this.move.dest = Math.round(Math.max(0, Math.min(this.events.dest, this.config.scrollMax)));
        this.events.dest = this.move.dest;
        // calc new value of scroll if there was a scroll
        if (this.move.prev !== this.move.dest) {
            this.move.current += (this.move.dest - this.move.current) * this.config.delay;
  
            // update scroll && parallax positions
            const moveTo = -this.move.current.toFixed(2);

            // iterate over section and update translate and visibility
            for (let i = this.sections.length - 1; i >= 0; i--) {

                // check if section should move (inView)
                if (this.move.current > this.sections[i].offset && this.move.current < this.sections[i].limit) {
                    this.sections[i].el.style.transform = this.events.enableSmoothScroll && !this.prevent && `translate3D(${this.config.direction === 'horizontal' ? moveTo : 0}px,${this.config.direction === 'vertical' ? moveTo : 0}px, 0)`;
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
            prev: 0
        };
  
        /** FUNCS **/
        // preload medias
        this.preload = this.config.preload && new Preloader(this.DOM.scroller, [success => this.resize(), ...this.config.initFuncs]);

        // set scroll module size
        resize.call(this);
  
        // if parallax, get elements to move
        this.callback = this.config.callback;
  
        //bind events
        const eventOpt = (({touch, parallax, speed, multFirefox, touchSpeed, jump}) => ({touch, parallax, speed, multFirefox, touchSpeed, jump}))(this.config);
        this.events = new Events(eventOpt, _requestTick.bind(this));
        bindEvent.call(this);
        
    },
  
  
    /**
    /*  BIND-EVENT - bind events to the DOM && start rAF */
    /* */
    bindEvent = function () {
        this.events.enableSmoothScroll && _fixedViewPort.call(this);
        this.events.domEvent('bind');
        // _domEvent.call(this, 'bind');
    },
  
  
    /**
    /*  UNBIND-EVENT - unbind events from the DOM && stop rAF */
    /* */
    unbindEvent = function () {
        // _domEvent.call(this, 'unbind');
        this.events.domEvent('unbind');

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
        immediate && (this.DOM.scroller.style.transform = this.events.enableSmoothScroll && `translate3D(${this.config.direction === 'horizontal' ? dir : 0}px,${this.config.direction === 'vertical' ? dir : 0}px, 0)`);
    },

    /**
    /*  SCROLL-OF - scroll of given path */
    /* */
    scrollOf = function (path, immediate = false) {
        this.move.dest += path;
        immediate || (_requestTick.call(this)); // start animation
        immediate && (this.DOM.scroller.style.transform = this.events.enableSmoothScroll && `translate3D(${this.config.direction === 'horizontal' ? dir : 0}px,${this.config.direction === 'vertical' ? dir : 0}px, 0)`);
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

        if(this.preload) this.preload.destroy()
  
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
  