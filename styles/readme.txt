Pour que le CSS fonctionne (avec EJS):

app.use("/css",express.static(__dirname + "/css")); //dans le .js
<link href="../css/style.css" rel="stylesheet" type="text/css"> //dans le .ejs
