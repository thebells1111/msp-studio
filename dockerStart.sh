#!/bin/sh -x

# Run dockerStart.js
node dockerStart.js

# Run the main application
exec pm2-runtime server/index.js
