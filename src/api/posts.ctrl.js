import Post from '../models/post.js';

import mongoose from 'mongoose';

const { objectId } = mongoose.Types;

// notice :  ../middleware/processRequest.js에 통합
// export const checkObjectId = (ctx, next) => {
// 	const { id } = ctx.params;
// 	if (!objectId.isValid(id)) {
// 		ctx.status = 400;
// 		return;
// 	}
// 	return next();
// };

// notice : 수정삭제 권한 확인을 위한 getPostById는 middleware를 이용한 common model 방식으로
// 구현을 위해 구현을 생략한다.

let post_id = 1;

const posts = [{ id: 1, title: '제목', body: '내용' }];
/*포스트작성
POST /api/posts
{title, body}
*/
export const write = async ctx => {
	const { title, body, tags } = ctx.request.body;
	const post = new Post({
		title,
		body,
		tags,
		user: ctx.state.user,
	});
	try {
		await post.save();
		ctx.body = post;
	} catch (e) {
		ctx.throw(500, e);
	}
};

// GET /api/posts?username=&tag=&page=&sort=_id&orderby=-1
// username :
// tag :
// sort : field_name
// orderby : 1 => ascending
//          -1 => descending
// limit : result size
// page : list table page number

export const list = async ctx => {
	const { sort, orderby, limit, tag, username } = ctx.request.query;
	const page = parseInt(ctx.query.page || '1', 10);
	if (page < 1) {
		ctx.status = 400;
		return;
	}
	const q = { ...(username ? { 'user.username': username } : {}), ...(tag ? { tags: tag } : {}) };
	try {
		let posts =
			sort !== undefined
				? await Post.find(q)
						.sort({ [sort]: orderby })
						.limit(parseInt(limit))
						.skip((page - 1) * 10)
						.lean()
						.exec()
				: await Post.find(q)
						.limit(parseInt(limit))
						.skip((page - 1) * 10)
						.lean()
						.exec();

		const postCount = await Post.countDocuments(q).exec();
		ctx.set('Last-Page', Math.ceil(postCount / 10));
		console.log('posts count : ', posts.length);
		ctx.body = posts
			//.map(post => post.toJSON()) // use Post.find().lean().exec() instead of using post.toJSON()
			.map(post => ({ ...post, body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...` }));
	} catch (e) {
		ctx.throw(500, e);
	}
};

// GET /api/posts/:id
export const read = async ctx => {
	const { id } = ctx.params;
	//const post = posts.find(p => p.id.toString() === id);
	try {
		const post = await Post.findById(id).exec();
		console.log('Post read by id : ', id, post);
		if (!post) {
			ctx.status = 404;
			ctx.body = {
				message: '포스트가 존재하지 않습니다.',
			};
			return;
		}
		ctx.body = post;
	} catch (e) {
		ctx.throw(500, e);
	}
};

// DELETE /api/posts/:id
export const remove = async ctx => {
	const { id } = ctx.params;
	try {
		await Post.findByIdAndRemove(id).exec();
		ctx.status = 204;
	} catch (e) {
		ctx.throw(500, e);
	}
};

// PATCH /api/posts/:id
export const update = async ctx => {
	const { id } = ctx.params;
	try {
		const post = await Post.findByIdAndUpdate(id, ctx.request.body, { new: true }).exec();
		if (!post) {
			ctx.status = 404;
			return;
		}
		ctx.body = post;
	} catch (e) {
		ctx.throw(500, e);
	}

	// posts[index] = {
	// 	...posts[index],
	// 	...ctx.request.body,
	// };
	// ctx.body = posts[index];
};
