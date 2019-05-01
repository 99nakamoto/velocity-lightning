module.exports = {
	checkNotLogin : (ctx) => {
		if (ctx.session && ctx.session.name) {
			ctx.redirect('/lobby')
			return false;
		}
		return true;
	},
	checkLogin : (ctx) => {
		if (!ctx.session || !ctx.session.name) {
			ctx.redirect('/login')
			return false;
		}
		return true;
	}
}