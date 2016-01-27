// COTE SERVEUR

// Ici on charge les modules nécessaires
var express = require('express');
var app = express();
var server = require('http').createServer(app); 
var fs = require('fs'); 
var io = require('socket.io')(server);
var session = require('cookie-session'); 
var bodyParser = require('body-parser'); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

// on indique le fichier css utilisé
app.use("/styles",express.static(__dirname + "/styles"));

// le serveur demande au client d'afficher la page html dès qu'on entre l'URL
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');
});

// le serveur ouvre la socket puis attend la connexion du client et l'envoi des différents messages
io.sockets.on('connection', function (socket) {
    
    // quand le serveur reçoit un message de type clickUp, il teste s'il s'agit d'un mur ou pas puis il envoie au client la sous 
    // matrice correspondante à ce qu'il doit afficher 
		socket.on('clickUp',function(message){
        if (socket.map[socket.ord -1][socket.abs] != 1){
            var matrice=[
                [socket.map[socket.ord-2][socket.abs-1], socket.map[socket.ord-2][socket.abs],socket.map[socket.ord-2][socket.abs+1] ],
                [socket.map[socket.ord-1][socket.abs-1], socket.map[socket.ord-1][socket.abs],socket.map[socket.ord-1][socket.abs+1] ], 
                [socket.map[socket.ord][socket.abs-1], socket.map[socket.ord][socket.abs],socket.map[socket.ord][socket.abs+1] ]
            ]; 
            // ici pour tous les mouvements le serveur envoie le meme message c juste la matrice qui diffère
            socket.emit('move',matrice);
		        socket.ord --;   
        }
    });	

    socket.on('clickDown',function(message){
        if (socket.map[socket.ord +1][socket.abs] != 1){
            var matrice=[
                [socket.map[socket.ord][socket.abs-1], socket.map[socket.ord][socket.abs],socket.map[socket.ord][socket.abs+1] ],
                [socket.map[socket.ord+1][socket.abs-1], socket.map[socket.ord+1][socket.abs],socket.map[socket.ord+1][socket.abs+1] ], 
                [socket.map[socket.ord+2][socket.abs-1], socket.map[socket.ord+2][socket.abs],socket.map[socket.ord+2][socket.abs+1] ]
            ]; 
		        socket.emit('move',matrice);
            socket.ord ++;
        }
    });
    
    socket.on('clickLeft',function(message){
        if (socket.map[socket.ord ][socket.abs-1] != 1){
            var matrice=[
                [socket.map[socket.ord-1][socket.abs-2], socket.map[socket.ord-1][socket.abs-1],socket.map[socket.ord-1][socket.abs] ],
                [socket.map[socket.ord][socket.abs-2], socket.map[socket.ord][socket.abs-1],socket.map[socket.ord][socket.abs] ], 
                [socket.map[socket.ord+1][socket.abs-2], socket.map[socket.ord+1][socket.abs-1],socket.map[socket.ord+1][socket.abs] ]
            ];  
            socket.emit('move',matrice);
            socket.abs --;  
        }
    });

    socket.on('clickRight',function(){
       if (socket.map[socket.ord ][socket.abs+1] != 1){
    		    var matrice=[
                [socket.map[socket.ord-1][socket.abs], socket.map[socket.ord-1][socket.abs+1],socket.map[socket.ord-1][socket.abs+2] ],
                [socket.map[socket.ord][socket.abs], socket.map[socket.ord][socket.abs+1],socket.map[socket.ord][socket.abs+2] ], 
                [socket.map[socket.ord+1][socket.abs], socket.map[socket.ord+1][socket.abs+1],socket.map[socket.ord+1][socket.abs+2] ]
            ];
            socket.emit('move',matrice);
            socket.abs ++;
    }
    });
	 
    // ici c la matrice codée en dur :D
	  if (typeof(socket.map) == 'undefined') {
        socket.map=[
            [1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,0,1,1,1,1,1,1,1,1,1,1],
            [1,1,0,1,1,0,0,0,0,1,1,1,1],
            [1,1,0,1,1,0,1,1,0,0,1,1,1],
            [1,1,0,0,0,0,1,1,0,1,1,1,1],
            [1,1,1,1,1,0,1,1,0,0,1,1,1],
            [1,1,0,0,0,0,1,1,0,1,1,1,1],
            [1,1,0,1,1,1,1,1,0,1,1,1,1],
            [1,1,0,1,1,1,1,1,0,0,0,1,1],
            [1,1,0,1,0,0,0,0,0,1,0,1,1],
            [1,1,0,0,0,1,1,1,1,1,0,1,1],
            [1,1,0,1,0,1,1,0,0,0,0,1,1],
            [1,1,0,1,0,0,0,1,1,0,1,1,1],
            [1,1,0,1,0,1,0,0,1,0,1,1,1],
            [1,1,0,0,0,1,1,0,0,0,1,1,1],
            [1,1,1,1,0,1,1,1,1,0,1,1,1],
            [1,1,1,1,0,0,0,0,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1]
            ];
    }

    // c sont les coordonnées du joueur
    if (typeof(socket.ord) == 'undefined'){
        socket.ord = 2;
    }

    if (typeof(socket.abs) == 'undefined'){
        socket.abs = 2;
    }
    
});

// ici le serveur se met à l'écoute 
server.listen(8080);
