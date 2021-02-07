import { Request, Response } from "express";
import { Op } from "sequelize";
import { any } from "sequelize/types/lib/operators";
import logging from "../config/logging";
import { ParameterError } from "../interfaces/errors";
import { Entry } from "../models/entry";

const workspace = "entry-ctrl";

const getAllEntries = async (_: Request, res: Response): Promise<void> => {
	try {
		const result = await Entry.findAll();
		res.status(200).json(result);
	} catch (err) {
		logging.error(workspace, "Could not get entries.", err.message);
		res.status(500);
	}
};
type whereQuery = { date?: unknown, category?: unknown, amount?: unknown, description?: unknown; };
const constructWhereQuery = (req: Request): whereQuery => {
	const body = req.body;

	const result: whereQuery = {};

	// Date
	if (body.year && !isNaN(body.year)) {
		/* Do some NodeJS Date magic
		   new Date("2021") => 2021-01-01
		   new Date(2021, 12) => 2021-12-31

		   new Date("2021-03") => 2021-03-01
		   new Date(2021, 3) => 2021-03-30
		*/
		let start = new Date(`${body.year}`);
		let end = new Date(body.year, 12);

		if (body.month && !isNaN(body.month)) {
			start = new Date(`${body.year}-${body.month}`);
			end = new Date(body.year, body.month);
		}

		result.date = { [Op.between]: [start, end] };
	}

	if (body.category) {
		result.category = body.category;
	}

	if (body.amount) {
		result.amount = body.amount;
	}

	if (body.description) {
		result.description = body.description;
	}

	return result;
};

/**
 * Get entries with specificed parameters.
 * Req.body can contain category: [], year: number, month: number, value: number
 * @param req 
 * @param res 
 */
const getSpecific = async (req: Request, res: Response): Promise<void> => {
	try {
		const query = constructWhereQuery(req);
		//@ts-expect-error TS doesn't like this, but it constructs a completely valid query as expected
		const result = await Entry.findAll({ where: { ...query } });
		console.log(result);
	} catch (err) {
		res.status(500).json({ message: "Something went wrong." });
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
			throw new ParameterError("Expected entries to be an array.");
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

export default { getAllEntries, addEntry, getSpecific };