aws s3 sync . s3://blr-home-public --exclude="*" --include="*.html" --include="*.css" --include="*.js"
aws cloudfront create-invalidation --distribution-id E21D7LFCTDRQAK --paths "/*"
