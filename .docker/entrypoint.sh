#!/bin/bash

echo "Injecting env vars"

envsubst < src/environments/environment.template.ts > src/environments/environment.ts

ng build && ng run zerofiltre-blog:server

echo "The app is starting ..."

node dist/zerofiltre-blog/server/main.js