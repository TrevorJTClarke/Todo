
/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    path = require('path');
var app = express();

require('./db.js');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(require('connect').bodyParser());
  app.use();
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieDecoder());
  app.use(express.session({store: MemStore}));
});

app.configure( 'development', function (){
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});

app.configure( 'production', function (){
  app.use( express.errorHandler());
});

var routes = require('./routes');

app.get('/', routes.index);
app.get('/list', routes.list );
app.get('/login', routes.login);
app.get('/partials/:name', routes.partials);

app.post( '/destroy/:id', routes.destroy );
app.post( '/update/:id', routes.update );
app.post( '/done/:id', routes.done );
app.post( '/notdone/:id', routes.notdone );
app.post( '/create', routes.create );

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
