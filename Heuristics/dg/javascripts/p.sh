#!/bin/bash          
process=`ps -ef | grep playerClient.js`
arr=($process)
kill -9 ${arr[1]}
node playerClient.js &

#!/bin/bash          
process=`ps -ef | grep matchmakerClient.js`
arr=($process)
kill -9 ${arr[1]}
node matchmakerClient.js &
