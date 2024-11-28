# Sync to AWS
echo "Uploading frontend files to AWS..."
aws s3 sync ./dist "s3://blr-home-public" --cache-control="max-age=21600" \
    --exclude="*" \
    --include="*.html" \
    --include="*.css" \
    --include="*.js" \
    --include="*.ico" \
    --include="*.woff2"

aws cloudfront create-invalidation --distribution-id "E21D7LFCTDRQAK --paths "/*" > /dev/null 2>&1
