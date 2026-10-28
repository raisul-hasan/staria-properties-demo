# Development project media

The Development showcase and Projects portfolio use the supplied project photographs:

- BAFWWA Café (ongoing): `docs/pictures/Development Projects/BAFWWA Roadside Cafe & Boutique Shop/BAFWWA Cafe.jpeg` is the featured architectural visualisation. All 22 images in `Updated` form the site-progress gallery.
- BAF Ops Office Interior Project (completed): `Finished/IMG_20260927_161555_920.jpg` is the detail-page featured photo. Project cards in the Development showcase and Projects portfolio use the supplied `3D/3 conf. room.png` render, exported as `office-conference-room-03.webp` and labelled `3D Visualisation`. The before and after galleries contain all 36 `In Progress` and 67 `Finished` photos respectively.
- SKS City (proposed): the development summary and approximate BUA figures are supplied by the project owner. The cover is an illustrative commercial-building photograph: [MChe Lee on Unsplash](https://unsplash.com/photos/modern-glass-office-buildings-in-city-r326KF3bG5o), provided under the Unsplash License. The credit is also shown on the project page.

Web exports are in `frontend/public/images/projects`. Galleries use 640px thumbnails and full photos up to 1600px, loaded on demand. `frontend/src/app/services/projectMedia.json` records image paths and dimensions. Originals in `docs/pictures` are preserved.

## 3D visualisations

The supplied `3D` folders are added to the corresponding project detail pages in the existing gallery style. Full renderings can be enlarged, and the thumbnails use `object-contain` to show the complete design. Existing site-progress and before/after galleries remain alongside these visualisations.

- BAF Ops Office Interior Project: all 8 PNGs from `BAF Ops Office Interior Project/3D` form the 3D gallery: 2 auditorium views, 3 conference-room views, the AOC meeting room, the AOC room and the waiting room.
- BAFWWA Café: all 4 PNGs (`EX 1.png` through `EX 4.png`) from `BAFWWA Roadside Cafe & Boutique Shop/3D` form the exterior 3D gallery.
- BAFWWA Café walkthrough: the complete `2nd Animation BAFWWA Roadside Boutique Shop.mp4` is exported as a web-ready H.264/AAC MP4 at 1920×1080 with its original timing. The original AAC audio track is copied directly from the source and explicitly marked as the default track. The player has native play/pause and fullscreen controls, uses `preload="none"` and starts only when the visitor presses play. On first play, it enables audio at full player volume; subsequent native volume and mute choices are respected. Its poster comes from the supplied video.

Image exports and 640px thumbnails are in `frontend/public/images/projects/3d`. The walkthrough is in `frontend/public/videos/projects/bafwwa-cafe-3d-walkthrough-with-audio.mp4`; the new URL avoids reusing a previously cached media response. `frontend/src/app/services/projectVisualisations.json` records project associations, image dimensions, descriptions, captions and video paths. Original source files are preserved in `docs/pictures`; the site serves the smaller web exports.

The 12 source PNGs total about 27.42 MiB; their full-size WebP exports and thumbnails total about 3.51 MiB. The source video is about 206.18 MiB. The web export uses a 4 Mbps video bitrate cap, light denoising, the original AAC audio and MP4 fast-start metadata for playback over HTTP. Both the source and the prior export were measured at approximately -14.4 dB mean audio volume; the player-level fix addresses silent initial playback rather than increasing an already audible source track.
