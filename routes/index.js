var mongoose = require('mongoose');
var Todo     = mongoose.model('Todo');
var utils    = require('connect').utils;

exports.index = function ( req, res, next ){
  Todo.find({ user_id : req.cookies.user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos, count ){
      if( err ) return next( err );
 
      res.render( 'index', {
          title : 'Todo',
          todos : todos
      });
    });
};
exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.login = function(req, res){
    res.render('partials/login');
};

//scotts middlewarz exmmmpple
// app.all('*', middleWare, function () {
//   next();
// });

exports.list = function ( req, res, next ){
  Todo.find({ user_id : req.cookies.user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos, count ){
      	if( err ) return next( err );
      	res.send( 'index', {todos : todos});
    });
};
 
exports.create = function ( req, res, next ){
  new Todo({
      user_id    : req.cookies.user_id,
      content    : req.body.content,
      done    : req.body.done,
      updated_at : Date.now()
  }).save( function ( err, todo, count ){
    if( err ) return next( err );
 
    res.redirect( '/' );
  });
};
 
exports.destroy = function ( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    if( todo.user_id !== req.cookies.user_id ){
      return utils.forbidden( res );
    }
    todo.remove( function ( err, todo, count ){
      if( err ) return next( err );
        console.log('Removed:'+req.params.id);
      res.redirect( '/' );
    });
  });
};

exports.update = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    if( todo.user_id !== req.cookies.user_id ){
      return utils.forbidden( res );
    }
    todo.content    = req.body.content;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );
 
      res.redirect( '/' );
    });
  });
};

exports.done = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    if( todo.user_id !== req.cookies.user_id ){
      return utils.forbidden( res );
    }
 
    todo.done    = true;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );
 
      res.redirect( '/' );
    });
  });
};
exports.notdone = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    if( todo.user_id !== req.cookies.user_id ){
      return utils.forbidden( res );
    }
 
    todo.done    = false;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );
 
      res.redirect( '/' );
    });
  });
};
 
// ** express turns the cookie key to lowercase **
exports.current_user = function ( req, res, next ){
  if( !req.cookies.user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }
 
  next();
};

// try making things sortable
