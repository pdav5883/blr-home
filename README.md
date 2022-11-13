# Bear Loves Rocks Site Home
This repo contains the html/css/javascript for the bearloves.rocks landing page. The site is very simple, and is meant to be hosted as a static site (e.g. using AWS S3). 

## Architecture
Files are stored in S3 bucket `blr-home-public`. Cloudfront distribution points to the `blr-home-public` to serve via https. Route53 has A and AAAA record alias mapping `home.bearloves.rocks` to the Cloudfront distro. A second S3 bucket `bearloves.rocks` (must be this name) is configured as a static website for redirect, with redirect address `home.bearloves.rocks`. Another Route53 A record is set as an alias for the address `bearloves.rocks` to the S3 bucket endpoint `bearloves.rocks`. This serves the function of redirecting traffic from `bearloves.rocks` to `home.bearloves.rocks`.

## Overall TODO
- Content
- Menu to sat-finder, pickem
