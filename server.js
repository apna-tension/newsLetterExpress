const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// const https = require("https");

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: firstName, LNAME: lastName },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/4dd4ea2b60";

  const options = {
    method: "POST",
    auth: "aminul:f1bdbd49f4dbba001614a4c4389c227b-us21",
  };

  const request = https.request(url, options, (response) => {
    let data = "";
    if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }
    // Handle data received from the API
    response.on("data", (chunk) => {
      data += chunk;
    });

    // Handle the end of the response
    response.on("end", () => {
      try {
        // Attempt to parse the response data as JSON
        const responseData = JSON.parse(data);
        console.log(responseData);
      } catch (error) {
        // Log and handle any JSON parsing errors
        console.error("Error parsing JSON:", error);
      }
    });
  });

  // Handle errors during the API request
  request.on("error", (error) => {
    console.error("Request error:", error);
  });

  // Write the JSON data to the request
  // request.write(jsonData);

  // End the request
  request.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});


// This is used for only on local server and if you want to deploy it on live server then you have to use process.env.PORT
// app.listen(3000, () => {
//   console.log("Example app listening on port 3000!");
// });


// This is used for live server as well as local server
app.listen(process.env.PORT || 3000, () => {
  console.log("Example app listening on Heroku port and our localserver!");
});

// api key 
// f1bdbd49f4dbba001614a4c4389c227b-us21

// list id
// 4dd4ea2b60
