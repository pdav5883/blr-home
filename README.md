# Bear Loves Rocks Site Home
This repo contains the html/css/javascript for the bearloves.rocks landing page. The site is very simple, and is meant to be hosted as a static site (e.g. using AWS S3). 

## Architecture
Files are stored in S3 bucket `blr-home-public`. Cloudfront distribution points to the `blr-home-public` to serve via https. Route53 has A and AAAA record alias mapping `home.bearloves.rocks` to the Cloudfront distro. A second S3 bucket `bearloves.rocks` (must be this name) is configured as a static website for redirect, with redirect address `home.bearloves.rocks`. Another Route53 A record is set as an alias for the address `bearloves.rocks` to the S3 bucket endpoint `bearloves.rocks`. This serves the function of redirecting traffic from `bearloves.rocks` to `home.bearloves.rocks`.

## All BLR TODO
- Home
- Bowls
    - Change frontend to bootstrap
    - Allow adjust of picks until last second
    - Include spread and bonus points against spread
    - Complete "best finish" for more than 2 players in advanced
    - Don't hard code playoff size into UpdateMargins
    - Show "best finish" check box only when it is availalble
- Bracket
    - Improve error handling in lambdas
    - Use authorization for /add endpoint
    - Move text secret into cognito user pool, allow login via email link, persists in session
    - Change to cognito authorization for admin as well
    - See emails and pick links from admin page
    - Team logos in bracket
    - Test page to try out mini game
- Sats
    - Validate against STK visibility
    - Sort satellites by sun angle and elevation
    - ID visible flow
    - Get Opportunities flow
    - Switch to bootstrap and webpack
    - Add deploy scripts
- Budget
    - See README
- Salad
    - Improve admin page with delete games and game details
- New
    - Sports prognostication where each player picks
