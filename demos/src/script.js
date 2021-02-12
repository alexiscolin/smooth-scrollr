import "./styles.css";
import {SmoothScroll} from '../../src/index.js';

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

    const scroll = new SmoothScroll(opts);

})()
