var express = require('./server/config/express');

var app = express();

app.listen(Number(process.env.PORT || 3000), function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;