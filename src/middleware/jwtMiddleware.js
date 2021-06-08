import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const jwtMiddleware = async (ctx, next) => {
	console.log('jwtMiddleware ctx : ', ctx);
	const token = ctx.cookies.get('access_token');
	console.log('current token : ', token);
	if (!token) return next();
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		ctx.state.user = {
			_id: decoded._id,
			username: decoded.username,
		};
		console.log('decode token : ', decoded);
		//토큰 유효기간이 3일 미만이면 재발급
		const now = Math.floor(Date.now() / 1000);
		console.log('expires in ', decoded.exp - now);
		if (decoded.exp - now < 60 * 60 * 24 * 3.0) {
			const user = await User.findById(decoded._id);
			const token = user.generateToken();
			ctx.cookies.set('access_token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
		}
		console.log(decoded);
		return next();
	} catch (e) {
		console.log('jwtMiddleware exception e : ', e);
		return next();
	}
};

export default jwtMiddleware;
