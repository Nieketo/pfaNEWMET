var express = require('express'); 
var session = require('cookie-session'); 
var bodyParser = require('body-parser'); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
app.use(session({secret: 'todotopsecret'}))

app.use(function(req, res, next){
    if (typeof(req.session.map) == 'undefined') {
        req.session.map=[
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,0,0,0,0,1,1,1],
                [1,0,1,0,0,1,1,0,0,1,1],
                [1,0,0,0,0,1,1,0,1,1,1],
                [1,1,1,1,0,1,1,0,0,1,1],
                [1,0,0,0,0,1,1,0,1,1,1],
                [1,0,1,1,1,1,1,0,0,1,1],
                [1,0,1,1,1,1,1,0,0,1,1],
                [1,0,1,0,0,0,0,0,1,1,1],
                [1,0,0,0,1,1,1,1,1,1,1],
                [1,0,1,0,1,1,0,0,0,2,1],
                [1,0,1,0,0,0,1,1,0,1,1],
                [1,0,1,0,1,0,0,1,0,1,1],
                [1,0,1,0,1,1,0,0,0,1,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1]
                ];
    }

    if (typeof(req.session.ord) == 'undefined'){
        req.session.ord = 1;
    }

    if (typeof(req.session.abs) == 'undefined'){
        req.session.abs = 1;
    }
    
    next();
})

app.get('/labyrinthe', function(req, res) {
    res.render('labyrinthe.ejs',{map:req.session.map, ord:req.session.ord, abs:req.session.abs});  
});

app.get('/goup', function(req, res) {
    if (req.session.map[req.session.ord -1][req.session.abs] != 1){
        req.session.ord --;
    }
    res.redirect('/labyrinthe');
});

app.get('/godown', function(req, res) {
    if (req.session.map[req.session.ord +1][req.session.abs] != 1){
        req.session.ord ++;
    }
    res.redirect('/labyrinthe');
});

app.get('/goright', function(req, res) {
    if (req.session.map[req.session.ord][req.session.abs +1] != 1){
        req.session.abs ++;
    }
    res.redirect('/labyrinthe');
});

app.get('/goleft', function(req, res) {
    if (req.session.map[req.session.ord][req.session.abs -1] != 1){
        req.session.abs --;
    }
    res.redirect('/labyrinthe');
});

app.listen(8080);