var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
app.use("/styles",express.static(__dirname + "/styles"));
app.use(session({secret: 'todotopsecret'}))

//Utilisation du clavier
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');



app.use(function(req, res, next){
    if (typeof(req.session.map) == 'undefined') {
        req.session.map=[
          [0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,0],
          [0,1,0,1,1,0,0,0,0,1,1,1,0],
          [0,1,0,1,0,0,1,1,0,0,1,1,0],
          [0,1,0,0,0,0,1,1,0,1,1,1,0],
          [0,1,1,1,1,0,1,1,0,0,1,1,0],
          [0,1,0,0,0,0,1,1,0,1,1,1,0],
          [0,1,0,1,1,1,1,1,0,0,1,1,0],
          [0,1,0,1,1,1,1,1,0,0,1,1,0],
          [0,1,0,1,0,0,0,0,0,1,1,1,0],
          [0,1,0,0,0,1,1,1,1,1,1,1,0],
          [0,1,0,1,0,1,1,0,0,0,0,1,0],
          [0,1,0,1,0,0,0,1,1,0,1,1,0],
          [0,1,0,1,0,1,0,0,1,0,1,1,0],
          [0,1,0,1,0,1,1,0,0,0,1,1,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];}

    if (typeof(req.session.ord) == 'undefined'){
        req.session.ord = 2;
    }

    if (typeof(req.session.abs) == 'undefined'){
        req.session.abs = 2;
    }

    next();
})

app.get('/labyrinthe', function(req, res) {
    res.render('test.ejs',{map:req.session.map, ord:req.session.ord, abs:req.session.abs});
});

app.get('/goup', function(req, res) {
    if (req.session.map[req.session.ord +1][req.session.abs] != 1){
        req.session.ord ++;
    }
    res.redirect('/labyrinthe');
});

app.get('/godown', function(req, res) {
    if (req.session.map[req.session.ord -1][req.session.abs] != 1){
        req.session.ord --;
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


stdin.on('data', function(key){
    if (key == '\u001B\u005B\u0041') {
        process.stdout.write('up');
    }
    if (key == '\u001B\u005B\u0043') {
        process.stdout.write('right');
    }
    if (key == '\u001B\u005B\u0042') {
        process.stdout.write('down');
    }
    if (key == '\u001B\u005B\u0044') {
        process.stdout.write('left');
    }

    if (key == '\u0003') { process.exit(); }    // ctrl-c
});

app.listen(8080);
