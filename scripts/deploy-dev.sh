#!/bin/sh

set -e pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR/..

gcp_project="bavard-dev"

export REACT_APP_PROJECT_ID=$gcp_project
export REACT_APP_ENV=dev

npm install
npm run build

firebase deploy -f --token "$FIREBASE_TOKEN" --project $gcp_project --only hosting:bavard-ai-dev
