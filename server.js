var express = require('express'),
    port    = process.env.PORT || 3000,
    path    = require('path'),
    favicon = require('serve-favicon'),
    app     = express();


app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(favicon(__dirname + '/public/assets/images/favicon.png'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});