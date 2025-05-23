# !/bin/bash

# This script is used to update the version of @builderio/morpho in the CLI package dependencies
# Workaround for https://github.com/changesets/changesets/issues/432

VERSION_NUMBER=$(jq -r '.version' ../core/package.json)

echo "Updating package.json to use version $VERSION_NUMBER of @builder.io/morpho"
jq --arg VERSION_NUMBER $VERSION_NUMBER '.dependencies."@builder.io/morpho" = $VERSION_NUMBER' package.json >temp.json && mv temp.json package.json
