// jshint esversion:6

// set up express app
const express = require("express");
const request = require("request");
const app = express();
var PORT = process.env.PORT || 3000;

// set up middleware for parsing 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// middleware for serving up static files such as styles.css and images
app.use(express.static("public"));

// get route for our signup homepage
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

// post route
app.post("/", function(req, res){
  
  // create vars for firstname, lastname and email
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  // create JSON object we want to post. Looking at docs for mailchimp we see 'members' has to be an array of objects
  var data = {
    // members should be exactly as specified in API docs even if it is only one subscriber like in our case we need to have it as an array of objects
    members: [
      {
        email_address: email,
        status: "subscribed",
        // add merge_fields key as well for FNAME and LNAME as specified in docs so they are added too when someone subscribes
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  // use stringify to convert data object into a string since that is what is needed as per API docs
  var jsonDataAsString = JSON.stringify(data);

  // console log users inputs
  console.log(firstName);
  console.log(lastName);
  console.log(email);

  // create options for request module function
  var options = {
    // first part of list is the specific server we were allocated in api key. last part of this baseURL is the audience key from below
    url: "https://us4.api.mailchimp.com/3.0/lists/bed64645f3",
    // since default method is GET we need to change to POST since we are posting to mailchimp
    method: "POST",
    // create headers object for authentication
    // as specified in mailchimp docs, first string can be any string then seperate with space and second string is your api key
    headers: {
      "Authorization": "rishabh1 02ee7d3708dadd95ae9d13b078051cd9-us4"
    },
    // body will be the data we are actually posting in a stringified version
    body: jsonDataAsString

  };

  // call request function 
  request(options, function(error, response, body){
    if(error){
      // if error occurs while posting console log error. 
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    }else{
      // if no error console log status code
      console.log(response.statusCode);
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      } else{
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
  
});

// create post route for failure button on failure page
app.post("/failure", function(req, res){
  // completion route for when someone presses try again button
  // redirects to home page
  res.redirect("/");
});

// set up listener port for app
app.listen(PORT, function(){
  console.log("App listening on PORT: " + PORT);
});

// api key
// 02ee7d3708dadd95ae9d13b078051cd9-us4

// audience id
// bed64645f3