import { Request, Response } from "express";
import { Op, WhereOptions } from "sequelize";
import { ParameterError } from "../interfaces/errors";
import { Category } from "../models/category";
import { Entry } from "../models/entry";
import logging from "../config/logging";
import IEntry from "../interfaces/entry";

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

const constructWhereQuery = (req: Request): WhereOptions => {
	const query = req.query;

	const result: WhereOptions = {};

	// Date
	const year = query.year as unknown as number;
	const month = query.month as unknown as number;

	if (query.year && !isNaN(year)) {
		let start = new Date(`${query.year}`);
		let end = new Date(year, 12);

		if (query.month && !isNaN(month) && month <= 12) {
			const date = new Date(`${query.year}-${query.month}`);
			start = new Date(date.getFullYear(), date.getMonth(), 1);
			end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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
	try {
		const input = req.body.entries;
		if (!Array.isArray(input) || input.length === 0) {
			throw new ParameterError("Expected input to be array.");
		}

		const entries: IEntry[] = [];
		input.forEach((value) => {
			entries.push(parseEntry(value));
		});

		const result = await Entry.bulkCreate(entries);
		res.status(201).json(result);
	} catch (err) {
		if (err instanceof ParameterError) {
			console.log(err.message);
			res.status(400).json(err.message);
		} else {
			logging.error(workspace, "Could not add entry.", err);
			res.status(500);
		}
	}
};

const updateEntry = async (req: Request, res: Response): Promise<void> => {
	/* "cast" req.params.id to number, check later that it's a number */
	const entryToUpdateID = req.params.id as unknown as number;
	const newEntry = req.body.entry;

	try {
		if (!newEntry) {
			throw new ParameterError("No entry in body.");
		} else if (isNaN(entryToUpdateID)) {
			throw new ParameterError("ID is NaN.");
		}

		const entryRow = await Entry.findByPk(entryToUpdateID);
		if (!entryRow) {
			throw new ParameterError(`Could not find entry with ID ${entryToUpdateID}`);
		}

		const parsedEntry = parseEntry(newEntry);
		const result = await entryRow.update(parsedEntry);

		res.status(200).json({ result: result });
	} catch (err) {
		if (err instanceof ParameterError) {
			logging.error(workspace, `Unable to update entry. ${err.message}`, err);
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

/*
* Request should look like
* entries: [{
*   date: 2021-03-01. 2021-03-31, somewhere in between or just 2021-03
*   description: "Lön"
*   amount: 1000
*   CategoryId: {id of Dan}
* }, ...]
*/
function parseEntry(entry: any): IEntry {
	if (entry === undefined || entry === null) {
		throw new ParameterError("Entry is undefined or null.");
	}

	/* check that entries.date, description, amount and category exist */
	const { date, description, amount, CategoryId, Category } = entry;
	if (date === undefined ||
		description === undefined ||
		amount === undefined ||
		(Category === undefined && CategoryId === undefined && Category.id === undefined)
	) {
		throw new ParameterError(
			`Missing some parameter(s) in entry\n${entry}.`);
	}

	/* Allow client to use category instead of CategoryId */
	if (Category.id && !CategoryId) {
		entry.CategoryId = Category.id;
	}

	return entry;
}

export default { getAllEntries, addEntry, getSpecific, updateEntry, removeEntry };