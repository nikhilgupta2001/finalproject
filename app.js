const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const ejs = require('ejs');
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(express.static("images"));
app.use('/', require("./router"))

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb+srv://admin-nikhil:Test123@cluster0-we2en.mongodb.net/userDB", {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const feedbackSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  rateus: Number,
  suggestion: String
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Feedback = new mongoose.model("Feedback", feedbackSchema)
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: "767162949022-fj4m2q1eb559h9ebvsurn4901td3kjpr.apps.googleusercontent.com",
    clientSecret: "F3O9C21QEFxaPaEBgRlR8DJp",
    callbackURL: "https://obscure-gorge-33633.herokuapp.com/auth/google/home",
    useProfileURL: "https://www.googleapis.com/oauth/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

app.post("/feedback", function(req, res) {
  const newFeedback = new Feedback({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    rateus: req.body.rateus,
    suggestion: req.body.sugestion
  })

newFeedback.save(function(err){
  if(err){
    console.log(err);
    res.render("feedback");
  }
  else {
    {
      res.redirect("/");
    }
  }
})

})
app.post("/signup", function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/signup")
    } else {
      passport.authenticate("local")(req, res, function() {
        res.render("/");
      })
    }
  })
})


app.get("/", function(req, res) {
  var request = require("request");
  var options = {
    method: 'GET',
    url: 'https://covid-193.p.rapidapi.com/statistics',
    headers: {
      'x-rapidapi-host': 'covid-193.p.rapidapi.com',
      'x-rapidapi-key': 'a091c6cf50msh034d39fd55b88fep1bc326jsn924ae5b0baff'
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    var data = JSON.parse(body);
    var New = data.response[42].cases.new;
    var Active = data.response[42].cases.active;
    var Critical = data.response[42].cases.critical;
    var Recovered = data.response[42].cases.recovered;
    var Total = data.response[42].cases.total;
    console.log(New);
    res.render("index", {
        New: New,
        Active: Active,
        Critical: Critical,
        Recovered: Recovered,
        Total: Total
      }

    );
  });
});




app.get("/auth/google",
  passport.authenticate('google', {
    scope: ["profile"]
  })
);

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      })
    }
  })
});


app.get('/auth/google/home',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.listen(process.env.PORT || 3000, function() {
  console.log("hello world!");
});
