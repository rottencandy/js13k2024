#!/usr/bin/env bash

mkdir -p zip
#rm zip/*

echo Creating new zip...

#zip -j -9 zip/game inline/index.html
ect -strip -zip -9 inline/index.html && mv inline/index.zip zip/game.zip

echo Finished.

USED=$(stat --format="%s" zip/game.zip)
echo "Zip size:  $USED bytes"
echo "Limit:     13,312 bytes"
echo "Remaining: $((13312 - $USED))"
