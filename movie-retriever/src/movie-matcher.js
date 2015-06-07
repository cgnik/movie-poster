log = global['log'];
fuzzy = module.require('fuzzy');

module.exports = {
	matches : function(name, title) {
		return title === name.toLowerCase();
	},
};