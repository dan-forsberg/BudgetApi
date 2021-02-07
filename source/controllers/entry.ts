import { Request, Response } from "express";
import logging from "../config/logging";
import { ParameterError } from "../interfaces/errors";
//import { Entry } from "../models/entry";

const workspace = "entry-ctrl";

const getEntriesForMonth = async (req: Request, res: Response): Promise<void> => {
	try {
		//const result = await Entry.find();
		res.status(200);//.json(result);
	} catch (err) {
		logging.error(workspace, "Could not get entries.", err.message);
		res.status(500);
	}
};

const addEntry = async (req: Request, res: Response): Promise<void> => {
	/*
	* Request should look like
	* entries: [{
	*   date: 2021-03-01. 2021-03-31, somewhere in between or just 2021-03
	*   description: "Lön"
	*   amount: 1000
	*   category: {id of Dan}
	* }, ...]
	*/
	try {
		const entries = req.body.entries;
		// check that entries is an array
		if (!entries || !Array.isArray(entries) || entries.length < 1) {
			throw new ParameterError("No entries array in object.");
		}

		// check that entries.date, description, amount and categories exist
		for (let i = 0; i < entries.length; i++) {
			const { date, description, amount, category } = entries[i];
			if (!date || !description || !amount || !category) {
				throw new ParameterError(
					`Missing either parameters in entries[${i}]`);
			}
		}
		//const result = await Entry.insertMany(entries);
		//console.log(result);
		res.status(201);//.json(result);
	} catch (err) {
		if (err instanceof ParameterError) {
			res.status(400).json(err.message);
		} else {
			logging.error(workspace, "Could not add entry.", err.message);
			res.status(500);
		}
	}
};

export default { getEntriesForMonth, addEntry };