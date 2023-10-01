#!/bin/bash

# Run dockerStart.js
node dockerStart.js

# Run the main application
pm2-runtime server/index.js