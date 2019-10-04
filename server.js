const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const whakapapa = require("./routes/api/whakapapa");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const feedback = require("./routes/api/form");
// const treeusers = require("./routes/api/treeusers");

const path = require("path");

const app = express();

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
app.use("/api/form", feedback);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

const NODE_ENV="production"

if (process.env.NODE_ENV === "production") {
 console.log("in production") // Exprees will serve up production asset
  app.use(express.static("client/build"));

  // Express serve up index.html file if it doesn't recognize route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
