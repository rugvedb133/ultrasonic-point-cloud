# ultrasonic-point-cloud

A 3D scanner built from a single ultrasonic sensor on a pan/tilt mount.
A microcontroller reads the sensor's distance at each servo angle, and a Python script turns those readings into a point cloud.

**Live page:** https://rugvedb133.github.io/ultrasonic-point-cloud/

The page covers the hardware, how a distance becomes an x, y, z point (with an interactive viewer), the mount, what limits the result, a demo video, and what we learned.
The scanner's source code isn't public, so this repository contains only the project page.

## Built with

**The scanner**

![HC-SR04 ultrasonic sensor](https://img.shields.io/badge/HC--SR04-1D6FB8)
![MSP430](https://img.shields.io/badge/MSP430-CC0000)
![Arduino](https://img.shields.io/badge/Arduino-00878F?logo=arduino&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)

**This page**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-663399?logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)
![three.js](https://img.shields.io/badge/three.js-000000?logo=threedotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?logo=githubpages&logoColor=white)

## Repository layout

```
.
├── docs/                 the published site (GitHub Pages: gh-pages branch, /docs folder)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── favicon.svg, favicon.ico, apple-touch-icon.png
│   ├── .nojekyll
│   └── images/           photos, diagrams and component drawings
├── og.svg                editable source of the social preview image (docs/images/og.png)
├── .gitattributes
├── .gitignore
└── README.md
```

## Run it locally

There is no build step. Serve the `docs` folder with any static server, for example:

```
python -m http.server 3000 --directory docs
```

then open http://localhost:3000.

## How it is built

- Plain HTML, CSS and JavaScript, with no framework and no build tooling.
- The diagrams and component drawings are original SVGs loaded through `<object>`, so the hover tooltips inside them work.
- **three.js** (MIT) is loaded from jsDelivr, pinned to a fixed version, only when a visitor presses "Start interactive viewer". Without it, the page shows the static diagram instead.
- One shared `<dialog>` powers the "Enlarge" view for images, diagrams, the viewer and the video.
- The demo video is a YouTube embed served from `youtube-nocookie.com`.

## Credits

- Tool and board icons come from [Simple Icons](https://simpleicons.org/) (CC0) through jsDelivr.
The Texas Instruments and Code Composer Studio marks are inlined in `docs/styles.css` from the files on ti.com.
- Fonts (Bricolage Grotesque, Atkinson Hyperlegible, JetBrains Mono) are served by Google Fonts under the SIL Open Font License.
- The badges above are made with [Shields.io](https://shields.io/).
- Product and company names and logos belong to their owners. They are used here only to identify the tools we used.
