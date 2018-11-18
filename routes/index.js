var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//INDEX OR HOMEPAGE
router.get("/", function(req, res){
    res.render("home");
});

//AUTHENTICATION
router.get("/register", function(req, res){
   res.render("register"); 
});

//AUTH REGISTRATION FORM (LOGIC)
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp");
            res.redirect("/campgrounds"); 
        });
    });
});

//AUTH LOGIN
router.get("/login", function(req, res){
    res.render("login");
});

//AUTH LOGIN HANDLING (LOGIC)
router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
    }
), function(req, res){});

//LOGOUT LOGIC
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You Just Loged out!");
    res.redirect("/campgrounds");
});


module.exports = router;