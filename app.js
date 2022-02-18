// setting constants for requiring different modules
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

// requiring mailchimps module
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

// accesing the public folder with images and CSS file
app.use(express.static("public"));

// Using body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// everything above is standard for setting up js file with express and body parser

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Setting up mailchimp
mailchimp.setConfig({
  apiKey: "8db94a24c97d9accd19bbe6dde9b3898-us14",
  server: "us14"
});

// Once sign me up button is pressed, the post is executed below
app.post("/", function(req, res) {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  const listID = "1ae776e68c7";

  // creating an object with the users jsonData
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  // uploading the data to the server
  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listID, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();

});

// redirects the failure page to the sign up page if it doesn't work

app.post("/failure", function(req, res) {
  res.redirect("/");
})

// listening on port 3000 and logging a message if the server is running
app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
