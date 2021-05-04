const request = require('request');

class AuthError extends Error
{
	constructor (message) {
		super(message);

		this.name = 'AuthError';
		this.message = message;
	}
}

class APIError extends Error {

	#errorObject = {};
	#errorCode = 0;
	#errorText = '';

	constructor (object) {
		super(object);

		this.name = 'APIError';
		this.message = 'Some API error has occured!';

		if (object.error) {
			let errorObject = object.error;

			this.#errorCode = errorObject.error_code;
			this.#errorText = errorObject.error_message;
			this.#errorObject = errorObject;
		}

		this.message = '[' + this.getErrorCode() + '] ' + this.getMessage();
	}

	getErrorCode () {
		return this.#errorCode;
	}

	getMessage () {
		return this.#errorText;
	}

	toObject () {
		return this.#errorObject;
	}
}

class Unt 
{
	#accessKey = '';

	#domain = 'https://api.yunnet.ru/';

	constructor (key = '') {
		if (key.length != 75)
			throw new AuthError("Access key is invalid or must be provided");

		this.#accessKey = key;
	}

	getDomain () {
		return this.#domain;
	}

	setAPIDomain (domain) {
		this.#domain = domain;

		return this;
	}

	execute (methodName, params) {
		let currentObject = this;
		
		if (typeof params !== "object")
			params = {};

		let accessKey = currentObject.#accessKey;

		return new Promise(function (resolve, reject) {
			return request.post(currentObject.getDomain() + methodName + '?key=' + accessKey, function (err, res, body) {
				let response = JSON.parse(body);

				if (response.error) {
					return reject(new APIError(response));
				}

				return resolve(response);
			}).form(params)
		});
	}
}

module.exports = Unt;