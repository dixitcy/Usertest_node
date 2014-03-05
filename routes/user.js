
/*
 * GET users listing.
 */

exports.userlist = function(db){
	return function(req, res){
		db.collection('userlist').find().toArray(function(err, items){
			res.json(items);
		})
	}
};

exports.adduser = function(db){
	return function(req, res){
		db.collection('userlist').insert(req.body, function(err, result){
			console.log(req.body);
			res.send(
				(err === null) ? {msg : ''} : {msg : err}
			);
		});
	}
};

exports.deleteuser = function(db){
	return function(req, res){
		var userToDelete = req.params.id;
		db.collection('userlist').removeById(userToDelete, function(err, result){
			res.send((result=== 1) ? {msg : ''} : {msg : "eroor: "+err});
		});
	}
};