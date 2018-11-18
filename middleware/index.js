var Campground = require("../models/campground");
var Comment = require("../models/comment");

//ALL MIDDLEWARE GOES HERE!
var middlewareObj = {};


middlewareObj.checkOwnershipOfComment = function(req, res, next){
if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            if( foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that")
                res.redirect("back");
            }
        }
      });
    } else {
        req.flash("error", "You have to be Loged in");
        res.redirect("back");
    }
};

middlewareObj.checkIfThisIsAuthor = function(req, res, next){
//check authentication if someone is connected
if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        } else {
            if( foundCampground.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        }
      });
    } else {
        req.flash("error", "You have to be Loged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Loged In to do that");
    res.redirect("/login");
}; 


module.exports = middlewareObj