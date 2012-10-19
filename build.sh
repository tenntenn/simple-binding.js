#!/bin/sh

echo "create minified code..."
java -jar compiler.jar --js_output_file simple-binding.min.js --js simple-binding.js

echo "run testcode..."
cat simple-binding.min.js simple-binding-test.js | node
