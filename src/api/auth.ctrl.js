import User from '../models/user.js';
export const register = async ctx => {
	//todo : ctx.request.body validation
	// if (result.error) {
	// 	ctx.status = 400;
	// 	ctx.body = result.error;
	// 	return;
	// }
	console.log('/auth/register : ', ctx.request);
	if (ctx.request.body.fields) {
		// routed with multipart form-data
		console.log('routed with multipart form-data', ctx.request.body.fields);
	}
	const { username, password } = ctx.request.body;
	try {
		const exists = await User.findByUsername(username);
		if (exists) {
			console.log('exist user : ', username);
			ctx.status = 409; //Conflict
			return;
		}
		const user = new User({ username });
		await user.setPassword(password);
		await user.save();

		ctx.body = user.serialize();

		const token = user.generateToken();
		ctx.cookies.set('access_token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, signed: false });
	} catch (e) {
		ctx.throw(500, e);
	}
};

export const login = async ctx => {
	console.log('/api/auth/login : ', ctx.request.body);
	const { username, password } = ctx.request.body;
	if (!username || !password) {
		ctx.status = 401;
		return;
	}
	try {
		const user = await User.findByUsername(username);
		if (!user) {
			ctx.status = 401;
			return;
		}
		const valid = await user.checkPassword(password);
		if (!valid) {
			ctx.status = 401;
			return;
		}
		ctx.body = user.serialize();

		const token = user.generateToken();
		ctx.cookies.set('access_token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
	} catch (e) {
		ctx.throw(500, e);
	}
};

export const check = async ctx => {
	console.log('/api/auth/check : ', ctx);
	const { user } = ctx.state;
	if (!user) {
		//로그인 안 한 상태
		ctx.status = 401;
		return;
	}
	ctx.body = user;
};

export const logout = async ctx => {
	console.log('/api/auth/logout : ');
	ctx.cookies.set('access_token');
	ctx.status = 204;
	return;
};
