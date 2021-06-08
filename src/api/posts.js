import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl.js';
import processRequest from '../middleware/processRequest.js';

const posts = new Router();

const printInfo = ctx => {
	ctx.body = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params,
	};
	console.log('printInfo : ', ctx.body);
};

posts.get('/', postsCtrl.list);
posts.post('/', processRequest, postsCtrl.write);
// notice : postsCtrl.checkObjectId => processRequest Middleware에 통합
// posts.get('/:id', processRequest, postsCtrl.checkObjectId, postsCtrl.read);
// posts.delete('/:id', processRequest, postsCtrl.checkObjectId, postsCtrl.remove);
// posts.patch('/:id', processRequest, postsCtrl.checkObjectId, postsCtrl.update);
posts.get('/:id', processRequest, postsCtrl.read);
posts.delete('/:id', processRequest, postsCtrl.remove);
posts.patch('/:id', processRequest, postsCtrl.update);

export default posts;
