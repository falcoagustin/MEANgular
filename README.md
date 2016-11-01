MEANgular
=========

I saw many people having trouble including libraries with Angular 2 and typescript using MEAN architecture, so here is your solution.
This project is a simple example of how to create a server using Node.js, Express, MongoDB and Angular 2.
It also includes arcGIS library for javascript and socket.io to show points added in the map in **real time**.

Details and running
-------------------

It is configured to run in ports 3000 and default mongoDB port in 27017, you can change that in *server/app.js* as you need.

To run the project, just navigate to the root project and run:

`npm install`
`npm run webpack` or you can do `npm run webpack:w` to be watching for changes done in code.
`node server/app.js`

Enjoy!
