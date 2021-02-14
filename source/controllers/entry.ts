import { Request, Response } from "express";
import { Op } from "sequelize";
import logging from "../config/logging";
import { ParameterError } from "../interfaces/errors";
import { Category } from "../models/category";
import { Entry } from "../models/entry";

const workspace = "entry-ctrl";
const selectRelevant = ["id", "date", "description", "amount"];

const getAllEntries = async (_: Request, res: Response): Promise<void> => {
	try {
		const result = await Entry.findAll({
			attributes: selectRelevant,
			include: {
				model: Category,
				required: true,
				attributes: ["name"]
			}
		}) as any[]; // Typescript is being really annoying

		const categories: string[] = [];
		result.forEach(entry => {
			console.log(entry);
			if (categories.indexOf(entry.Category.name) == -1) {
				categories.push(entry.Category.name);
			}
		});


		res.status(200).json({ categories: categories, result: result });
	} catch (err) {
		logging.error(workspace, "Could not get entries.", err.message);
		res.status(500);
	}
};
type whereQuery = { date?: unknown, CategoryID?: unknown, amount?: unknown, description?: unknown; };
const constructWhereQuery = (req: Request): whereQuery => {
	const query = req.query;

	const result: whereQuery = {};

	// Date
	const year = query.year as unknown as number;
	const month = query.month as unknown as number;

	if (query.year && !isNaN(year)) {
		/* Do some NodeJS Date magic
		   new Date("2021") => 2021-01-01
		   new Date(2021, 12) => 2021-12-31

		   new Date("2021-03") => 2021-03-01
		   new Date(2021, 3) => 2021-03-30
		*/
		let start = new Date(`${query.year}`);
		let end = new Date(year, 12);

		if (query.month && !isNaN(month)) {
			start = new Date(`${query.year}-${query.month}`);
			end = new Date(year, month);
		}

		result.date = { [Op.between]: [start, end] };
	}

	if (query.category) {
		result.CategoryID = query.category;
	}

	if (query.amount) {
		result.amount = query.amount;
	}

	if (query.description) {
		result.description = query.description;
	}

	return result;
};

/**
 * Get entries with specificed parameters.
 * Req.body can contain category: string, year: number, month: number, value: number
 * @param req 
 * @param res 
 */
const getSpecific = async (req: Request, res: Response): Promise<void> => {
	try {
		const query = constructWhereQuery(req);
		const result = await Entry.findAll({
			//@ts-expect-error TS doesn't like this, but it constructs a completely valid query as expected
			where: { ...query },
			attributes: selectRelevant,
			include: {
				model: Category,
				required: true,
				attributes: ["name"]
			}
		}) as any[]; // Typescript is being really annoying

		const categories: string[] = [];
		result.forEach(entry => {
			if (categories.indexOf(entry.Category.name) == -1) {
				categories.push(entry.Category.name);
			}
		});

		res.status(200).json({ categories: categories, result: result });
	} catch (err) {
		logging.error(workspace, "Could not get specific.", err);
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
	*   CategoryId: {id of Dan}
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
			const { date, description, amount, CategoryId, category } = entries[i];
			if (!date || !description || !amount || (!CategoryId && !category)) {
				throw new ParameterError(
					`Missing either parameters in entries[${i}]`);
			}

			/* Allow client to use category instead of CategoryId */
			if (category && !CategoryId) {
				entries[i].CategoryId = category;
			}
		}

		const result = await Entry.bulkCreate(entries);
		console.log(result);
		res.status(201).json(result);
	} catch (err) {
		if (err instanceof ParameterError) {
			res.status(400).json(err.message);
		} else {
			logging.error(workspace, "Could not add entry.", err.message);
			res.status(500);
		}
	}
};

const updateEntry = async (req: Request, res: Response): Promise<void> => {
	/* "cast" req.params.id to number, check later that it's a number */
	const entryToUpdateID = req.body.id as unknown as number;
	const newEntry = req.body.entry;

	try {
		if (!newEntry) {
			throw new ParameterError("No entry in body.");
		} else if (isNaN(entryToUpdateID)) {
			throw new ParameterError("ID is NaN.");
		} else if (!newEntry.date && !newEntry.description && !newEntry.amount && !newEntry.CategoryId) {
			throw new ParameterError("No proper parameters in body. Expected date, description, amount or CategoryId.");
		}

		const entryRow = await Entry.findByPk(entryToUpdateID);
		if (!entryRow) {
			throw new ParameterError(`Could not find entry with ID ${entryToUpdateID}`);
		}

		const result = await entryRow.update(newEntry);
		res.status(200).json({ result: result });
	} catch (err) {
		if (err instanceof ParameterError) {
			res.status(400).json({ message: err.message });
		}
		else {
			res.status(500).json({ message: "Something went wrong." });
		}
	}
};

const removeEntry = async (req: Request, res: Response): Promise<void> => {
	const entryToRemoveID = req.params.id as unknown as number;
	try {
		if (isNaN(entryToRemoveID)) {
			throw new ParameterError("ID is NaN.");
		}

		const result = await Entry.destroy({ where: { id: entryToRemoveID } });
		res.status(200).json({ message: `Removed ${result} rows.` });
	} catch (err) {
		if (err instanceof ParameterError) {
			res.status(400).json({ message: err.message });
		} else {
			res.status(500).json({ message: "Something went wrong." });
		}
	}
};

export default { getAllEntries, addEntry, getSpecific, updateEntry, removeEntry };