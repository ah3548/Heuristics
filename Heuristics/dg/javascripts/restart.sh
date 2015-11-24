#!/bin/bash          
process=`ps -ef | grep server.js`
arr=($process)
kill -9 ${arr[1]}
node server.js &
