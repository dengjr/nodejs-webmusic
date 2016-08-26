var mongoose = require('mongoose');

var musicSchema = new mongoose.Schema({
	musicName:String,
	singer:String,
	publish:Date,
	lyric:String,
	source:[String],
	summary:String,
	meta:{
		createAt:{
		type:Date,
		default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}

	}
	
})

musicSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

musicSchema.statics = {
	fetches:function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb);
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb);
	},
	findByName:function(name , cb){
		return this
		.findOne({musicName:name})
		.exec(cb);
	}

}

module.exports = musicSchema;


