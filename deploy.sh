#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

mkdir stage
cp index.html stage
cp -r style stage/
cp -r js stage/
cd stage

git init
git config user.name "Fred Lin"
git config user.email "gasolin@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/gasolin/moonbar.git"
git fetch upstream
git reset upstream/gh-pages

echo "www.mozilla.org" > CNAME

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
