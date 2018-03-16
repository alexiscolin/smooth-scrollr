# smooth-scroll
Simple smooth scrolling and parallaxe module based on fake scroll events (aka wheel and touch and keyPress...).

## Getting Started
Made as a prototype reveal based class, initialize the module to use it.

``` javascript
import { SmoothScroll } from 'smooth-scroll';
let smoothscroll = new SmoothScroll({
  parallax: true,
  delay: .1,
  touchSpeed: 2,
  jump: 120
});
```
## Options and Settings
### parallax
* ```true```: enable parallax on scroll from parallax module
* ``` false ```: disable parallax on scroll from parallax module

### delay
* ```number```: easing value (between 0 & 1) 

### touchSpeed
* ```number```: the scrolling speed on touch event 


### jump
* ```number```: the scrolling step on keyPress event

## Methods
#### ```bindEvent```
In order to bind scrolling events to the DOM and start a requestAnimationFrame (auto in new instance, use it after an unbind method) 

#### ```bindEvent```
In order to unbind scrolling events to the DOM and cancel the requestAnimationFrame
