const processRequest = (ctx, next) => {
	//posts.ctrl.js의 checkObjectId를 processRequest 미들웨어에 통합한다.
	const { id } = ctx.params;
	if (id && !objectId.isValid(id)) {
		ctx.status = 400;
		return;
	}

	if (!ctx.state.user) {
		ctx.status = 401;
		return;
	}
	return next();
};

export default processRequest;
