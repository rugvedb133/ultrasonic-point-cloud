# ultrasonic-point-cloud

A 3D scanner built from a single ultrasonic sensor on a pan/tilt mount.
A microcontroller reads the sensor's distance at each servo angle, and a Python script turns those readings into a point cloud.

**Live page:** https://rugvedb133.github.io/ultrasonic-point-cloud/

This write-up page covers the hardware, how a distance becomes an x, y, z point (with an interactive viewer), the mount, what limits the result, and a demo video.
The source code isn't public, so this repository contains only the project page.

## Built with

**The project**

![HC-SR04 ultrasonic sensor](https://img.shields.io/badge/HC--SR04-1D6FB8)
![MSP430 Launchpad](https://custom-icon-badges.demolab.com/badge/TI_MSP430-CC0000?logo=texasinstruments&logoColor=fff)
![Arduino Uno](https://img.shields.io/badge/Arduino_Uno-00878F?logo=arduino&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=FFD43B)
![Arduino IDE](https://img.shields.io/badge/Arduino_IDE-00878F?logo=arduino&logoColor=white)
![Code Composer Studio](https://custom-icon-badges.demolab.com/badge/CCStudio-CC0000?logo=ccstudio&logoColor=fff)

**The writeup**

![HTML5](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-663399?logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=323330)
![three.js](https://img.shields.io/badge/three.js-000000?logo=threedotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?logo=githubpages&logoColor=white)

## How it is built

- Plain HTML, CSS and JavaScript, with no framework and no build tooling.
- The diagrams and component drawings are original SVGs loaded through `<object>`, so the hover tooltips inside them work.
- [three.js](https://threejs.org/) (MIT) is loaded from [jsDelivr](https://www.jsdelivr.com/), only when a visitor presses "Start interactive viewer". Without it, the page shows the static diagram instead.
- One shared `<dialog>` powers the "Enlarge" view for images, diagrams, the viewer and the video.
- The demo video is a YouTube embed served from `youtube-nocookie.com`.

## Credits

- Tool and board icons come from [Simple Icons](https://simpleicons.org/) (CC0) through jsDelivr.
The Texas Instruments and Code Composer Studio marks are inlined in `docs/styles.css` from the files on [ti.com](https://www.ti.com/).
- Fonts (Bricolage Grotesque, Atkinson Hyperlegible, JetBrains Mono) are served by [Google Fonts](https://fonts.google.com/) under the SIL Open Font License.
- The badges above are made with [Shields.io](https://shields.io/).
- Product and company names and logos belong to their owners. They are used here only to identify the tools we used.
