var express                 = require("express"),
    app                     = express(),
    session                 = require("express-session"),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    flash                   = require("connect-flash"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require('method-override'),
    User                    = require("./models/user"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./seed");
    
var campgroundsRoutes   = require("./routes/campgrounds"),
    commentsRoutes      = require("./routes/comments"),
    indexRoutes         = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v11", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //Seed database!

//PASSPORT CONFIG
app.use(session({
  secret: 'Salomeja is my princess',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Current user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/", indexRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is on!!!");
});