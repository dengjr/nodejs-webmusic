var music = require('../models/music');
var user = require('../models/user');
var _ = require('underscore');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

module.exports = function(app){
	app.use(function(req ,res , next){
	//delete req.session.user;
	var _user = req.session.user;
console.log(_user);
	if(_user){
		app.locals._user = _user;
	}
	else{
		app.locals._user = "";
	}
	return next();
});

app.get('/',function(req , res){
	music.fetches(function(err , mus){
		if(err){
			console.log(err);
		}

		res.render('index',{
		title:'首页',
		list1:'if you',
		list2:'bang bang bang',
		list3:'sober',
		list4:'haluhalu',
		list5:'bea bea',
		list6:'tell me goodbye',
		singer1:'bigbang'
	})
	})

});


app.get('/edit',function(req , res){
	
		music.fetches(function(err , mus){
			if(err){
				console.log(err);
			}
			var singer = mus;
			res.render('edit',{
				title:'编辑',
				mus:mus

		})
	})
});


app.get('/new',function(req , res){
	
	res.render('new',{
		title:'首页'
	})
	
});





app.post('/show',function(req , res){
	console.log(req.body._id);
	music.findById(req.body._id , function(err , mus){
		if(err){
			console.log(err);
		}
		else{
			res.render('show',{
				title:"修改",
				mus:mus
			});
		}

		console.log(mus);
	})
});

app.post('/change' , function(req , res){
	music.findById(req.body._id , function(err , mus){
		if(err){
			console.log(err);
		}
		else{
			var _id = mus._id;
			delete mus._id;
			music.update({_id:_id} , req.body , function(err){});

			res.redirect("/edit");
		}
	})
})

app.delete('/delete',function(req , res){
	music.findById(req.query.id , function(err , mus){
		if(err){
			console.log(err);
		}
		else{
			music.remove({_id:mus._id},function(err , mus){});

		}
	})
})

var arr = [];

app.post('/ajax',function(req , res){
	//生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './source/'});
    form.encoding = 'utf-8';
    form.maxFilesSize = 20 * 1024 * 1024;
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files,null,2);
     if(err){
      console.log('parse error: ' + err);

      } else {
      	console.log(files.inputFile.length);
  		for(var i=0;i<files.inputFile.length;i++){
        var inputFile = files.inputFile[i];
        var uploadedPath = inputFile.path;
        var dstPath = './source/' + inputFile.originalFilename;
        arr[i] = uploadedPath;
        
      }}
      
      res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
      res.write('');
      res.end(util.inspect({fields: fields, files: filesTmp}));

   });
})


app.post('/new',function(req ,res){
	var id;
	var musicObj = req.body;
	var _music;
	if(id){
		music.findById(id,function(err , mus){
			if(err){
				console.log(err);
			}
			_music = _.extend(mus , musicObj);
			_music.save(function(err , mus){
				if(err){
					console.log(err);
				}
				res.redirect('/edit');
			})
		})		
	}
	else{
		_music = new music({
			musicName:musicObj.name1,
			singer:musicObj.singer,
			summary:musicObj.detial,
			publish:musicObj.ptime,
			lyric:musicObj.lyric,
			source:arr
		});
		_music.save(function(err , mus){
			if(err){
				console.log(err);
			}
			res.redirect("/edit");
		})
	}
});

app.post('/reg' , function(req , res){
	var _user = req.body;
	console.log(_user);
	var User = new user({
		name:_user.rname,
		password:_user.rpassword
	});
	console.log(User);
	User.save(function(err , user){
		if(err){
			console.log(err);
	}else{
		res.redirect('/edit');
	}		
	})
});

app.post('/login',function(req , res){
	var _user = req.body;
	console.log(_user);

	user.findOne({name:_user.lname} , function(err , us){
		if(err){
			console.log(err);
		}	
					
		if(us){
			if(us.password == _user.lpassword){
				req.session.user = us;
				console.log(req.session.user);
				res.status(200).json({success:1,name:us.name});
			}
			else{
				res.status(200).json({success:0});
				res.end();
			}	
		}	
		else{
			res.status(200).json({success:0});
			res.end();
		}				
	})	
});

app.post('/logout' , function(req , res){
	delete req.session.user;
	res.status(200);
    res.end();
});
}
