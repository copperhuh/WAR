# WAR
![Screenshot 1](https://github.com/copperhuh/Portfolio/blob/master/src/screenshots/ss-war.png?raw=true)

A browser game/simulation, of the war card game built only with vanilla JS, HTML and CSS.

All assets exluding the skull model were hand-drawn by me for this project.

## Demo

[Github Pages](https://copperhuh.github.io/WAR/)

## Technologies

-   **JavaScript**
-   **CSS** 
-   **HTML**

## How It Works

There isn't much in terms of complexity in this project - just basic programming. The only thing that I think is worth clarifying is that the skull animation is not a gif nor a THREE JS model but just png images that are being switched out every couple of milliseconds - I know it's not very optimal but it was the best thing I came up at the time (since the skull can in any frame change between having hearts or crosses in its eyes).

## Appendix

I'm aware that the site is in no way responsive - it was my first real personal project and I didn't tackle it with a mobile-first approach but rather a desktop-first one. Then when I finally finished I realized that to make it usable on mobile I'd have to redo the whole site and just gave up.

There are some other problems - if a player's cards run out and there is a war happening the site will just break (though I find it somewhat realistic since I myself don't know what to do when that happens) and needs to be reloaded. The other problem is that the manual mode uses a very unnecessary recursion that causes stack overflow if too many hands were played (auto mode doesn't have this problem). 

## Author

-   [Jakub Koper](https://github.com/copperhuh)

## Feedback

If you have any feedback, feel free to reach out to me at jakub.koper@wpc-huh.com
