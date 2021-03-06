#!/bin/bash

set -e pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/..

gcp_project="bavard-prod"

export REACT_APP_PROJECT_ID=$gcp_project
export REACT_APP_ENV=prod

rm -rf build
npm install
npm run build

firebase deploy -f --token "$FIREBASE_TOKEN" --project $gcp_project --only hosting:bavard-prod
