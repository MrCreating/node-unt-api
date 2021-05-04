const Unt = require('./src/unt.js');
const Bot = require('./src/bot.js');

module.exports = {
	getAuth: function (access_key) {
		return new Promise(function (resolve, reject) {
			let unt = new Unt(access_key);

			return unt.execute("users.get").then(function (response) {
				return resolve(unt);
			}).catch(function (error) {
				return reject(error);
			})
		})
	},
	Bot: Bot
};