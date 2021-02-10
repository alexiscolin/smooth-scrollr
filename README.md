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
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">🖱️ smooth-scrollr</h3>

  <p align="center">
    Simple smooth scrolling module based on fake scroll events (aka wheel and touch and keyPress...).
    <br />
    <br />
    <a href="https://github.com/github_username/demos">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a>
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
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This repo 
**To avoid retyping too much info. Do a search and replace with your text editor for the following:**
`github_username`, `repo_name`, `twitter_handle`, `email`, `project_title`, `project_description`


### Built With

* [JS ES6/7/8](https://www.ecma-international.org/technical-committees/tc39/)
* [Babel](https://babeljs.io/)
* [Webpack](https://webpack.js.org/)


<!-- GETTING STARTED -->
## Getting Started

Made as a prototype reveal based class, initialize the module to use it.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm i smooth-scrollr@latest
  ```

* yarn
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

``` javascript
import { SmoothScroll } from 'smooth-scrollr';

const opts = {
  section: document.querySelector('#section'),
  speed: .8,
};

const smoothscroll = new SmoothScroll(opts, 'fixedClass');

```

### Options and Settings

| Option        | Type      | Default    | Description                                                                                                                                                                                                                                                                                                                    |
|---------------|-----------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `section`     | `object`  | `body`     | DOM section that you want to make scrollable or data-scroll-containers parent if you want to use multi wrapper option (make sure the parent wrap all children in horizontal scroll case).                                                                                                                                      |
| `direction`   | `string`  | `vertical` | `vertical` || `horizontal` Scroll direction: If horizontal, avoid to set section width in any value other than `auto` in order to create a container that is bigger than the viewport.                                                                                                                                         |
| `speed`       | `number`  | `1`        | Speed value on the range 0-1 that is slowing the smoothing effect.                                                                                                                                                                                                                                                             |
| `delay`       | `number`  | `.1`       | Easing value between 0 & 1                                                                                                                                                                                                                                                                                                     |
| `fixedClass`  | `string`  |            | The class you want to set in order to fix the viewport (at least you need `overflow: hidden` and `height: 100vh` on the container and `overscroll-behavior: none` or `overflow: hidden` on the body). If the smooth scrolling is activated on the device and there are not fixedClass defined, some inline style will be used. |
| `touch`       | `boolean` | `false`    | Enable smooth scroll on touch event                                                                                                                                                                                                                                                                                            |
| `touchSpeed`  | `number`  | `1.5`      | Scrolling speed on touch event                                                                                                                                                                                                                                                                                                 |
| `jump`        | `number`  | `110`      | Scrolling step on keyPress event                                                                                                                                                                                                                                                                                               |
| `multFirefox` | `number`  | `15`       | Scrolling speed on Firefox                                                                                                                                                                                                                                                                                                     |
| `preload`     | `boolean` | `true`     | Enable preload media function in order to resize page after async                                                                                                                                                                                                                                                              |
| `resize`      | `boolean` | `true`     | Enable auto resize                                                                                                                                                                                                                                                                                                             |
|  `initFuncs`  | `array`   |            | Array of functions that must be fired after the instance has been initialised. If `preload`, init takes place after the event                                                                                                                                                                                                  |
# Methods

<!-- #### ```start```
In order to enable smoothscroll on the page. This method is **required at first**. At that point all the function parameters are loaded and are waiting for starting before running scroll animation. So you have to start smoothscroll after requesting for a new instance to allow user scrolling on the page.
You can also use this method after setting `preventScroll` to `true` if you want to unfreeze the scroll.

```javascript
smoothscroll.start(); // run smoothscroll
``` -->

#### ```destroy```
In order to destroy smooth-scroll class instance and all its properties.

#### ```resize```
In order to recalculate scroll container size

#### ```scrollTo```
In order to force scroll to a location on the webpage. This method has two parameters, the first one is for the location on the page (in px) and the second one is used to tell the method if you want a smooth scroll or an imediate position rendering (true/false).
```javascript
smoothscroll.scrollTo(0, true); // go to the top without smoothing
```

### Events
#### ```init``` -> inside the opts at start (after preload)
#### ```scroll``` -> fired during scroll
#### ```collisionTop``` -> fired when the scroll is at top of the page
#### ```collisionBottom``` -> fired when the scroll is at bottom of the page
#### ```collisionEnded``` -> fired once when the scroll stop to be blocked by the collision with page edges.




## Properties
#### ```preventScroll``` - setter
In order to freeze scrolling movement. Change this property by setting it to true/false.
``` javascript
smoothscroll.preventScroll = true; // freeze scroll
smoothscroll.preventScroll = false; // let it free
```




<!-- ROADMAP -->
## Roadmap

- [x] ScrollTo method
- [x] destroy method
- [x] horizontal scroll support
- [ ] add a scroll bar


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

Alexis Colin - [linkedin](https://www.linkedin.com/in/alexiscolin/) - alexis@jaunebleu.com

Project Link: [https://github.com/alexiscolin/smooth-scrollr](https://github.com/alexiscolin/smooth-scrollr)






<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/alexiscolin
