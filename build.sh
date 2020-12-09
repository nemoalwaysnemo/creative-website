#!/usr/bin/env bash
find ./project/dist/LibraryWebUI -iname '*.css' | xargs sed -i -e "s/assets\/images/nuxeo\/LibraryWebUI\/assets\/images/g"
find ./project/dist/LibraryWebUI -iname '*.js' | xargs sed -i -e "s/assets\/images/nuxeo\/LibraryWebUI\/assets\/images/g"
