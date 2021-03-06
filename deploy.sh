#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

mkdir stage
cp index.html stage
cp -r style stage/
cp -r js stage/
cp -r widgets stage/
cd stage

git init
git config user.name "gasolin"
git config user.email "gasolin@gmail.com"

git remote add upstream "https://$GH_TOKEN@$GH_REF"
git fetch upstream
git reset upstream/gh-pages

echo "gasolin.github.io" > CNAME

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
