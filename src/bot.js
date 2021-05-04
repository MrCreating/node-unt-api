const request = require('request');

class Bot {
	#currentSession = null;
	#lastEventId = 0;

	constructor (untSession) {
		if (typeof untSession !== "object")
			throw new TypeError("Session must be a Unt object");

		this.#currentSession = untSession;
	}

	startEventListen (callback) {
		let currentObject = this;

		function listenEvents (url) {
			return new Promise(function (resolve, reject) {
				return request.get((url + '&last_event_id=' + currentObject.getLastEventId()), function (err, res, body) {
					let response = JSON.parse(body);

					if (response.error)
						return reject();

					callback(response);
					listenEvents(url);

					currentObject.setLastEventId(response.last_event_id + 1);
					return resolve(response);
				})
			});
		}

		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");

		return new Promise(function (resolve, reject) {
			return currentObject.getSession().execute("realtime.connect", {mode: 'polling'}).then(function (response) {
				if (response.response) {
					let url = response.response.url;
					let lid = response.response.last_event_id;

					currentObject.setLastEventId(lid);
					listenEvents(url).then().catch(function () {
						return reject();
					})

					return resolve(true);
				}

				return reject();
			}).catch(function (err) {
				return reject(err);
			});
		});
	}

	setLastEventId (lastEventId = 0) {
		this.#lastEventId = lastEventId;

		return this;
	}

	getLastEventId () {
		return this.#lastEventId;
	}

	getSession () {
		return this.#currentSession;
	}
}

module.exports = Bot;