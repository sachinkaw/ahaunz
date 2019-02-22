const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const whakapapa = require("./routes/api/whakapapa");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const app = express();

// ... other imports // heroku
const path = require("path");

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;

//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

//Use routes
app.use("/api/users", users);
app.use("/api/whakapapa", whakapapa);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

if (process.env.NODE_ENV === "production") {
  // ... other app.use middleware // heroku
  app.use(express.static("client/build"));

  // Right before your app.listen(), add this: // heroku
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
