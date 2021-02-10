import "./styles.css";
import {SmoothScroll} from '../../src/index.js';

(function(){
    const direction = document.body.dataset.scroll;
    const container = document.querySelector('#section');

    const opts = {
        callback: [],
        touch: true,
        delay: .08,
        direction: direction,
        speed: .9,
        section: container,
        touchSpeed: 2,
        jump: 120,
        preloadFuncs: {
            // 'error': this.onPreloadError.bind(this)
        },
        // initFuncs: [() => console.log('yeah')],
        scrollFuncs: {
            // 'startFunc': this.atStart.bind(this),
            // 'runningFunc': this.atRun.bind(this),
            // 'endFunc': this.atEnd.bind(this)
        }
    };

    const scroll = new SmoothScroll(opts);
    console.log(scroll)
    // setTimeout(_ => {
    //     scroll.destroy()
    //     console.log(scroll)
    // }, 4000)
    

})()
