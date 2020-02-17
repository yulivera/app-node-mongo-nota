const mongoose = require('mongoose');

// const local_uri = process.env.MONGODB_LOCAL;
// console.log(local_uri);
const uri_clever_cloud = process.env.MONGODB_ADDON_URI;

mongoose.connect(uri_clever_cloud, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));