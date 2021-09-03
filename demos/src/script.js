import "./styles.css";
import {SmoothScrollr} from '../../src/index.js';

(function(){
    const direction = document.body.dataset.scroll;
    const container = document.querySelector('#section');

    const opts = {
        touch: true,
        delay: .08,
        direction: direction,
        speed: .9,
        section: container,
        touchSpeed: 2,
        jump: 120,
    };

    const scroll = new SmoothScrollr(opts);

    // pos data available in 'scroll' event only
    const callback = (pos) => { console.log(pos)}
    scroll.on('scroll', callback);
    setTimeout(_=>{
        scroll.scrollTo(200, true);
        console.log('scroll')
    }, 3000)

})()
