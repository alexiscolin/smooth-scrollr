<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username, repo_name, twitter_handle, email, project_title, project_description
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url] -->

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/alexiscolin/smooth-scrollr">
    <img src="https://files.jaunebleu.co/img/github/smooth-scrollr/smooth-scroller-logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">🖱️ smooth-scrollr</h3>

  <p align="center">
    Simple smooth scrolling module based on fake scroll events (aka wheel and touch and keyPress...).
    <br />
    <br />
    <a href="https://github.com/alexiscolin/smooth-scrollr/tree/master/demos">View Demos</a>
    ·
    <a href="https://github.com/alexiscolin/smooth-scrollr/issues">Report Bug</a>
    ·
    <a href="https://github.com/alexiscolin/smooth-scrollr/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a>
        <ul>
            <li><a href="#options-and-settings">Options and Settings</a></li>
            <li><a href="#methods">Methods</a></li>
            <li><a href="#events">Events</a></li>
        </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#who-is-using">Who is Using</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Built With

- [JS ES6/7/8](https://www.ecma-international.org/technical-committees/tc39/)
- [Babel](https://babeljs.io/)
- [Webpack](https://webpack.js.org/)

<!-- GETTING STARTED -->

## Getting Started

Made as a prototype reveal based class, initialize the module to use it.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

  ```sh
  npm i smooth-scrollr@latest
  ```

- yarn
  ```sh
  yarn add smooth-scrollr
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/alexiscolin/smooth-scrollr.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<!-- USAGE EXAMPLES -->

## Usage

Basic usage :

```html
<main class="" id="section">
  <section class="" data-scroll-container>
    <article class=""></article>
    <article class=""></article>
    <article class=""></article>
  </section>
  <section class="" data-scroll-container>
    <article class=""></article>
    <article class=""></article>
    <article class=""></article>
  </section>
  ...
</main>
```

_Note: data-scroll-container are optional but recommended to improve long page performance._

```javascript
import { SmoothScrollr } from "smooth-scrollr";

const opts = {
  section: document.querySelector("#section"),
  speed: 0.8,
  fixedClass: "fixedClass",
};

const smoothscroll = new SmoothScrollr(opts);
```

_Note: 'fixedClass' is optional and set the class you define to block real scroll to the right container. Inline styles are used if not definied_

### ...Or in a global way (without bundler)

Get the `smooth-scrollr.min.js` file inside the `dist` folder. Then, use it in the html file :

```html
<script src="smooth-scrollr.min.js"></script>
<script>
  (function () {
    const opts = {
      /*opts here */
    };
    var scroll = new SmoothScrollr(opts);
  })();
</script>
```

## Options and Settings

| Option        | Type      | Default          | Description                                                                                                                                                                                          |
| ------------- | --------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `section`     | `object`  | `body`           | DOM section that you want to make scrollable or data-scroll-containers parent if you want to use multi wrapper option (make sure the parent wrap all children in horizontal scroll case).            |
| `listened`    | `object`  | `config.section` | DOM section that will be used as scroll listener.                                                                                                                                                    |
| `direction`   | `string`  | `vertical`       | `vertical`                                                                                                                                                                                           |     | `horizontal` Scroll direction: If horizontal, avoid to set section width in any value other than `auto` in order to create a container that is bigger than the viewport. |
| `speed`       | `number`  | `1`              | Speed value on the range 0-1 that is slowing the smoothing effect.                                                                                                                                   |
| `delay`       | `number`  | `.1`             | Easing value between 0 & 1                                                                                                                                                                           |
| `fixedClass`  | `string`  |                  | The class you want to set in order to fix the viewport (at least you need `overflow: hidden` and `height: 100%` on the container and `overscroll-behavior: none` or `overflow: hidden` on the body). |
| `touch`       | `boolean` | `false`          | Enable smooth scroll on touch event                                                                                                                                                                  |
| `touchSpeed`  | `number`  | `1.5`            | Scrolling speed on touch event                                                                                                                                                                       |
| `jump`        | `number`  | `110`            | Scrolling step on keyPress event                                                                                                                                                                     |
| `multFirefox` | `number`  | `15`             | Scrolling speed on Firefox                                                                                                                                                                           |
| `preload`     | `boolean` | `true`           | Enable preload media function in order to resize page after async                                                                                                                                    |
| `resize`      | `boolean` | `true`           | Enable auto resize                                                                                                                                                                                   |
| `initFuncs`   | `array`   |                  | Array of functions that must be fired after the instance has been initialised. If `preload`, init takes place after the event                                                                        |

## Element attribute

- `data-scroll-container` : create a scrollable container inside the `section`. Splitting the page into smaller container is good to improve performance. Only the viewed container will move, so lighten containers will move one after the other. This is totaly optional.

## Methods

| Methods         | Description                                                        | Arguments                                                                                                                                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scrollTo`      | In order to force scroll to a location on the webpage.             | `dir` : _(number)_ - the position in px you want to go on the page<br>- `imediate` : _(boolean - default: false)_ - go with/without smooth effect                                                                                                                                                                                               |
| `scrollOf`      | In order to scroll from a specific number of pixel.                | `path` : _(number)_ - the distance in px you want the page go through. Return the scroll position<br>- `imediate` : _(boolean - default: false)_ with/without smooth effect                                                                                                                                                                     |
| `getSize`       | In order to get the scroller container size.                       |                                                                                                                                                                                                                                                                                                                                                 |
| `on`            | In order to add a listener function on a specific scroll event.    | `event` : _(string)_ - the instance event you want to listen (see the list below)<br>`callback` : _(function)_ - the function you want to trigger when the event is dispatched<br>`context` : _(object - default : section)_ the content you want to listen (you should avoid to use it unless you know what you do)                            |
| `off`           | In order to remove a listener function on a specific scroll event. | `event` : _(string)_ - the instance event you want to remove a listener (see the list below)<br>`callback` : _(function)_ - the function you want to remove (use the same as you set to add the listener)<br>`context` : _(object - default : section)_ the content you want to listen (you should avoid to use it unless you know what you do) |
| `resize`        | In order to recalculate scroll container.                          |                                                                                                                                                                                                                                                                                                                                                 |
| `destroy`       | In order to destroy scroll container.                              |                                                                                                                                                                                                                                                                                                                                                 |
| `preventScroll` | In order to freeze scrolling movement.                             | `state` : _(boolean)_ - freeze or unfreeze scroll event                                                                                                                                                                                                                                                                                         |

### Exemples :

#### Force imediate scroll

```javascript
smoothscroll.scrollTo(0, true); // go to the top without smoothing
```

#### Smooth scroll of 200px

```javascript
smoothscroll.scrollFrom(200, false); // go 200px forward smoothly
```

#### Add a callback to scroll instance event

```javascript
const callback = () => {
  console.log("yeah!!");
};
smoothscroll.on("scroll", callback); // 'yeah!!` appears in the console during the scroll.
// You can access scroll position as parameter in callbak function (scroll event only)
```

#### Remove a callback to scroll instance event

```javascript
smoothscroll.off("scroll", callback); // use the same previous callback function
```

#### Destroy scroll instance

```javascript
smoothscroll.destroy(); // all events are removed and the instance has been killed
```

## Events

| Event             | Description                                                                      |
| ----------------- | -------------------------------------------------------------------------------- |
| `scroll`          | trigger during scroll                                                            |
| `collisionTop`    | trigger when the scroll is at top of the page                                    |
| `collisionBottom` | trigger when the scroll is at bottom of the page                                 |
| `collisionEnded`  | trigger once when the scroll stop to be blocked by the collision with page edges |

<!-- ROADMAP -->

## Roadmap

- [x] ScrollTo method
- [x] destroy method
- [x] horizontal scroll support
- [ ] add a scroll bar

<!-- Websites using smooth-scrollr-->

## Who is Using

- [jaunebleu.co](https://jaunebleu.co/)
- [gabriel-cuallado.com](https://gabriel-cuallado.com/)

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See [LICENCE FILE](https://github.com/alexiscolin/smooth-scrollr/blob/master/LICENSE) for more information.

<!-- CONTACT -->

## Contact

Alexis Colin - [linkedin](https://www.linkedin.com/in/alexiscolin/) - alexis@jaunebleu.co

Project Link: [https://github.com/alexiscolin/smooth-scrollr](https://github.com/alexiscolin/smooth-scrollr)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/alexiscolin/smooth-scrollr.svg?style=for-the-badge
[contributors-url]: https://github.com/alexiscolin/smooth-scrollr/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/alexiscolin/smooth-scrollr.svg?style=for-the-badge
[issues-url]: https://github.com/alexiscolin/smooth-scrollr/issues
[license-shield]: https://img.shields.io/github/license/alexiscolin/smooth-scrollr.svg?style=for-the-badge
[license-url]: https://github.com/alexiscolin/smooth-scrollr/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/alexiscolin
