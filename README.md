# Bear Loves Rocks Site Home

## Architecture
Files are stored in S3 bucket `blr-home-public`. Cloudfront distribution points to the `blr-home-public` to serve via https. Route53 has A and AAAA record alias mapping `home.bearloves.rocks` to the Cloudfront distro. A second S3 bucket `bearloves.rocks` (must be this name) is configured as a static website for redirect, with redirect address `home.bearloves.rocks`. Another Route53 A record is set as an alias for the address `bearloves.rocks` to the S3 bucket endpoint `bearloves.rocks`. This serves the function of redirecting traffic from `bearloves.rocks` to `home.bearloves.rocks`.

## Overall TODO
- Move bowl-pickem to cloudfront
- Dropdown menu to common file
- Deploy scripts to S3
- About BLR name content
- About projects content
- Menu to sat-finder
- Menu to pickem
- sat-finder pointing to search page
- S3 upload on commit

## Noun Project

Bear face: Bear by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/bear/" target="_blank" title="Bear Icons">Noun Project</a>

Bear sitting: Bear by Ed Harrison from <a href="https://thenounproject.com/browse/icons/term/bear/" target="_blank" title="Bear Icons">Noun Project</a>

Loves filled: Love by barurezeki from <a href="https://thenounproject.com/browse/icons/term/love/" target="_blank" title="Love Icons">Noun Project</a>

Loves hollow: Love by rex from <a href="https://thenounproject.com/browse/icons/term/love/" target="_blank" title="Love Icons">Noun Project</a>

Rocks stacked: rocks by Nick Kinling from <a href="https://thenounproject.com/browse/icons/term/rocks/" target="_blank" title="rocks Icons">Noun Project</a>

Rocks falling: Falling Rocks by Adrien Coquet from <a href="https://thenounproject.com/browse/icons/term/falling-rocks/" target="_blank" title="Falling Rocks Icons">Noun Project</a>
