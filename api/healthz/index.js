(function (){
  'use strict';

  var async       = require("async")
    , express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()


  app.get("/healthz", function (req, res) {
      /* Should check various things here
       *  - are we up and running and responding to requests?
       *  - can we access our dependencies?
       *
       *  If healthy, return 200 with empty json {}
       *  Otherwise return 500 with details of errors in json.
       */
      res.status(200);
      res.send('{}');
  });


  app.get("/login", function (req, res, next) {
    console.log("Received login request");

    async.waterfall([
        function (callback) {
          var options = {
            headers: {
              'Authorization': req.get('Authorization')
            },
            uri: endpoints.loginUrl
          };
          request(options, function (error, response, body) {
            if (error) {
              callback(error);
              return;
            }
            if (response.statusCode == 200 && body != null && body != "") {
              console.log(body);
              var customerId = JSON.parse(body).user.id;
              console.log(customerId);
              callback(null, customerId);
              return;
            }
            console.log(response.statusCode);
            callback(true);
          });
        },
        function (custId, callback) {
          var sessionId = req.session.id;
          console.log("Merging carts for customer id: " + custId + " and session id: " + sessionId);

          var options = {
            uri: endpoints.cartsUrl + "/" + custId + "/merge" + "?sessionId=" + sessionId,
            method: 'GET'
          };
          request(options, function (error, response, body) {
            if (error) {
              callback(error);
              return;
            }
            console.log('Carts merged.');
            callback(null, custId);
          });
        }
    ],
    function (err, custId) {
      if (err) {
        console.log("Error with log in: " + err);
        res.status(401);
        res.end();
        return;
      }
      res.status(200);
      res.cookie(cookie_name, custId, {maxAge: 3600000}).send('Cookie is set');
      console.log("Sent cookies.");
      res.end();
      return;
    });
  });

  module.exports = app;
}());
