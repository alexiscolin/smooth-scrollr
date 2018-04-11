# 🖱️ smooth-scrollr
Simple smooth scrolling and parallaxe module based on fake scroll events (aka wheel and touch and keyPress...).



## Getting Started
Made as a prototype reveal based class, initialize the module to use it.

### Installation
By using yarn:
`yarn add smooth-scrollr`

or npm:
`npm i smooth-scrollr`


``` javascript
import { SmoothScroll } from 'smooth-scrollr';

let smoothscroll = new SmoothScroll({
  parallax: true,
  touch: false,
  delay: .1,
  speed: .8,
  touchSpeed: 2,
  jump: 120,
}, 'fixedClass');
```

### Notes about tools
* ES6
* Prototype reveal pattern

## Options and Settings
**parallax** - Boolean (optional | default: false) enable parallax on scroll from parallax module;

**touch** - Boolean (optional | default: false) enable smooth scroll on touch event;

**delay** - Number (optional | default: .1) easing value between 0 & 1;

**speed** - Number (optional | default: 1) speed value on the range 0-1 that is slowing the smoothing effect;

**touchSpeed** - Number (optional | default 1.5) the scrolling speed on touch event;

**jump** - Number (optional | default 110) the scrolling step on keyPress event;

**fixedClass** - String (optional) the class you want to set in order to fix the viewport (at least you need `overflow: hidden` and `height: 100vh`). If the smooth scrolling is activated on the device and there are not fixedClass defined, some inline style will be used.


## Methods
#### ```bindEvent```
In order to bind scrolling events to the DOM and start a requestAnimationFrame (auto in new instance, use it after an unbind method)

#### ```unbindEvent```
In order to unbind scrolling events to the DOM and cancel the requestAnimationFrame

#### ```destroy```
In order to destroy smooth-scroll class instance and all its properties.


#### ```scrollTo```
In order to force scroll to a location on the webpage. This method has two parameters, the first one is for the location on the page (in px) and the second one is used to tell the method if you want a smooth scroll or an imediate position rendering (true/false).
```javascript
smoothscroll.scrollTo(0, true); // go to the top without smoothing
```

## Properties
#### ```preventScroll``` - setter
In order to freeze scrolling movement. Change this property by setting it to true/false.
``` javascript
smoothscroll.preventScroll = true; // freeze scroll
smoothscroll.preventScroll = false; // let it free
```
