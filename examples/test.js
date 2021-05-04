const unt = require("./../index.js");

const accessKey = "";
if (accessKey !== "")
	unt.getAuth(accessKey).then(function (untSession) {
		let untBot = new unt.Bot(untSession);

		return untBot.startEventListen(function (event) {
			console.log(event);

			return process.exit(0);
		}).then(function () {
			return console.log('[OK] yunNet. bot is started! Write some message for him...');
		}).catch(function (err) {
			return console.log('[!] yunNet. bot failed to start.');
		});
	}).catch(function (err) {
		return console.log('[!] yunNet. bot failed to auth.');
	});
else {
	console.log('[!] Pass your yunNet. access key to pass this test!');

	process.exit(1);
}
