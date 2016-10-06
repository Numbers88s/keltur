var express   = require('express'),
    port      = process.env.PORT || 3000,
    path      = require('path'),
    favicon   = require('serve-favicon'),
    basicAuth = require('basic-auth-connect'),
    app       = express();


app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(favicon(__dirname + '/public/assets/images/favicon.png'));

// Asynchronous Auth
var auth = basicAuth(function(user, pass, callback) {
  var result = (user === 'kelseybutt' && pass === 'birdsofafeather');
  callback(null /* error */, result);
});

app.get('/', auth, function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});