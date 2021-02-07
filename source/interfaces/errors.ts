class NoCategoryError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "NoCategoryError";

		Object.setPrototypeOf(this, NoCategoryError.prototype);
	}
}

class ParameterError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "ParameterError";

		Object.setPrototypeOf(this, ParameterError.prototype);
	}
}

export { NoCategoryError, ParameterError };