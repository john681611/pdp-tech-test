#!/bin/bash -ex
function finish {
  docker network rm mynet
}
trap finish EXIT

docker build --rm -f "site/Dockerfile" -t site:latest site
docker build --rm -f "api/Dockerfile" -t api:latest api

docker network create --subnet=172.19.0.0/16 mynet
docker run -e PASS=password -e USR=admin -e APIHOST=interview-tech-testing.herokuapp.com -p 5000:5000 --network=mynet  api & 
docker run -e APIHOST=http://172.19.0.2:5000 -p 3000:3000 --network=mynet site

