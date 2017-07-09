# Welcome to my personal NodeJS server!
##### You can find this server hosted by openshift [here](http://nodejs-silibcloud.rhcloud.com).

##Openshift configuration
I started with a `Node.js 0.10` small gear with `MongoDB 2.4` as database and `RockMongo 1.1` as database manager.

Using [ramr nodejs-custom-version-openshift](https://github.com/ramr/nodejs-custom-version-openshift) I managed to have a custom version of NodeJS. (The default 0.10 was a little to hold)

On my github I added a second pushurl (pointing the openshift repo) so that I can work just with
one and have both repos always up to date. 

##Developing
If you want to try it locally you will need NodeJS > 6.10.0 and an instance of [MongoDB](https://docs.mongodb.com/manual/administration/install-community/).

* Install all dependencies with `npm install`
* Run MongoDB with `mongod`
* Run `npm dev`

You will have the app running on port 8080 (if not already in use) with `nodemon`that will care of restarting the server when changes happen.