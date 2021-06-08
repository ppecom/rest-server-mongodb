import dotenv from 'dotenv';
import Koa from 'koa';
import cors from 'koa-cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api/index.js';
import jwtMiddleware from './middleware/jwtMiddleware.js';

dotenv.config();

const cors_options = {
	origin: true,
	credentials: true,
};

const { PORT, MONGO_URI } = process.env;
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch(e => {
		console.error(e);
	});
const app = new Koa();
app.use(cors(cors_options));

const router = new Router();
router.use('/api', api.routes());

// middleware 적용순서 : bodyParser=>jwtMiddleware=>router
app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

// app.use(async (ctx, next) => {
// 	console.log(ctx.url);
// 	console.log(1);
// 	if (ctx.query.authorized !== '1') {
// 		ctx.status = 401;
// 		return;
// 	}
// 	// next().then(() => {
// 	// 	console.log('await end');
// 	// });
// 	await next();
// });

app.use((ctx, next) => {
	next();
});

// app.use(ctx => {
// 	ctx.body = 'hello world';
// });

const port = PORT || 4000;
app.listen(port, () => {
	console.log('Listening to port ' + port);
});
