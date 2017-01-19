# Auth0 + Socket.io

This is the seed project you need to use if you're going to create a Socket.io single page app that will use Auth0.

### Configure your Auth0 credentials

First, you need to set the ClientSecret, ClientId and Domain for your Auth0 app as environment variables with the following names respectively: `AUTH0_CLIENT_SECRET`, `AUTH0_CLIENT_ID` and `AUTH0_DOMAIN`. You can find this information in your Auth0 Dashboard.

So, create a file named `.env` in the directory and set the values like the following:

````bash
# .env file
AUTH0_CLIENT_SECRET=myCoolSecret
AUTH0_CLIENT_ID=myCoolClientId
AUTH0_DOMAIN=myCoolDomain
````

### Set up the Allowed Origin (CORS) in Auth0

Then, you need to put `http://localhost:3001` as an Allowed Origin (CORS) in the Application Settings on your Auth0.com dashboard.

### Running the example

In order to run the example, you need to have `node` installed. 

1. run `npm install` 
1. run `node index.js` in the directory of this project.


Go to [http://localhost:3001](http://localhost:3001) and you'll see the app running :).
