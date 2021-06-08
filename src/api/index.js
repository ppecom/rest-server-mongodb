import Router from 'koa-router';
import posts from './posts.js';
import auth from './auth.js';
const api = new Router();

api.get('/test', ctx => {
	ctx.body = 'test성공';
});

api.get('/', ctx => {
	ctx.body = '홈';
});

api.get('/about/:name', ctx => {
	ctx.body = '소개';
});

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());
// api.get('/posts', ctx => {
// 	const { id } = ctx.query;
// 	ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다.';
// });

export default api;
