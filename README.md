# pdp-tech-test
Time Taken: Approx: 12hrs
## Running docker
Assuming you have docker already installed you can just run

        . dockerBuildRun.sh
And it will do the rest
Site is exposed on port `3000`
API is `5000`
Example URLs:
- Site http://localhost:3000/pdp/p22245233
- Api: http://localhost:5000/pdp/p22245233

NB: Docker containers are networks together and can be fiddly I've done my best to avoid problems once done kill the network with `docker network rm mynet`

## Running locally
Both apps run using node so you need to run 

        npm i

Starting the app is done with:

        npm start

Running dev build inc linting and tests

        npm run dev


## Areas for Improvement
- Client side testing - Would use JSDOM to test event handlers working and changing required attributes
- Functional testing - Would use WDIO to test that pressing the Add to bad button creates needed post message 
- Api security - Implement at least basic Auth or use passport for something more secure
- Api Caching? - Investigate what level of caching could be used and where.
- More scalable implementation of the colour switching method - maybe only render markup for first 5 and do network requests for extra colours (expects colours to be in order of popularity)
- Api in a more performant language  - python compiled into C maybe
- Improvement of Images - I know they are scene 7 so I can get responsive imagery given time
- Accessibility - make use of `aria` and screen reading tech to improve accessibility  

