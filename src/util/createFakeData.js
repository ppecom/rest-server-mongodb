import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Post from '../models/post.js';
import User from '../models/user.js';
dotenv.config();

const { PORT, MONGO_URI } = process.env;
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch(e => {
		console.error(e);
	});

createFakeData();
export default async function createFakeData() {
	const users = await User.find().sort({ _id: 1 }).exec();
	console.log('users : ', users);
	const posts = [...Array(40).keys()].map(i => ({
		title: `포스트 #${i}`,
		body:
			'OXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOXOX',
		tags: ['가짜', '데이터'],
		user: { _id: users[0]._id, username: users[0].username },
	}));
	Post.insertMany(posts, (err, docs) => {
		console.log(docs);
	});
}
