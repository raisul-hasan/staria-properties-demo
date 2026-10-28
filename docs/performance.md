# Public site loading improvements

The live site was transferring several large source images and displaying a loading
overlay for a fixed 2.4 seconds, followed by its fade-out. Public static resources
were also served with `max-age=0, must-revalidate`.

The overlay has been removed. `SiteImage` renders a native image with responsive
sources for known public photos and Unsplash URLs, prioritizes first-screen images,
and lazy-loads other images. Existing styles, crops, captions, links, and full-image
viewing remain in place. Unknown CMS URLs still work without a manifest entry.

`imageSources.json` maps 19 existing photos to 63 WebP files in
`public/media/optimized`. Variants use 480, 960, and 1600 pixels where available,
plus the source width up to 1920 pixels. Their filenames include a content hash;
replace both the filename and manifest entry when changing one of these images.
Source images are retained. Branded property artwork uses a 2160-pixel WebP to
preserve its small text.

| Resource | Previous bytes | Optimized bytes | Reduction |
| --- | ---: | ---: | ---: |
| Bashundhara property artwork | 5,004,322 | 377,120 | 92.5% |
| Shatadru portrait | 1,072,575 | 55,992 | 94.8% |
| Mahirul portrait | 508,265 | 119,390 | 76.5% |
| Six consultancy project images combined, 960px variants | 6,980,631 | 585,150 | 91.6% |

Both logos now use small lossless WebP files with transparency. The same font
families and weights are linked in HTML with preconnect hints, avoiding a CSS
`@import` discovery chain.

The public domain is served by Netlify. `netlify.toml` gives content-hashed Vite
assets and optimized images a one-year immutable browser cache. Unversioned images
and videos receive a one-hour cache. HTML continues to revalidate for deployments.
The existing walkthrough still uses `preload="none"` and its original audio.

Validation included a production build, TypeScript checks for the image helper,
static rendering of home/projects/consultancy/cafe detail routes, and React 18
priority-attribute compatibility. All 63 responsive files were decoded and checked
against their width descriptors, content hashes, and production copies. The property
artwork and portrait were visually compared against their originals. These are asset
size reductions, not measured Core Web Vitals or a claim about total load time.
