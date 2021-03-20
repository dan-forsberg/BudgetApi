import { Request, Response } from "express";
import sequelize from "sequelize";
import { Op } from "sequelize";
import logging from "../config/logging";
import { ParameterError } from "../interfaces/errors";
import { Category } from "../models/category";
import { DefaultEntry } from "../models/defaultEntry";
import { Entry } from "../models/entry";

const workspace = "default-entry-ctrl";
const selectRelevant = ["description", "amount"];

const getAllEntries = async (_: Request, res: Response): Promise<void> => {
	try {
		// first get all the default entries
		let { categories, entries } = await getDefaultEntries();
		// figure out what categories are missing
		let { otherCategories, otherEntries } = await getOtherCategoriesValues(categories);
		// append the data
		categories = [...categories, ...otherCategories];
		entries = [...entries, ...otherEntries];

		res.status(200).json({ categories: categories, result: entries });
	} catch (err) {
		logging.error(workspace, "Could not get entries.", err.message);
		res.status(500).json({ "message": "Internal error." });
	}
};

async function getDefaultEntries(): Promise<{ categories: string[], entries: any[]; }> {
	const defaultEntries = await DefaultEntry.findAll({
		attributes: [...selectRelevant, [sequelize.literal("NOW()"), "date"]],
		include: {
			model: Category,
			required: true,
			attributes: ["name", "id"]
		}
	}) as any[];

	return dateifyEntriesGetCategories(defaultEntries);
}

function dateifyEntriesGetCategories(result: any): { categories: string[], entries: any[]; } {
	const categories: string[] = [];
	result.forEach((entry: any) => {
		if (categories.indexOf(entry.Category.name) == -1) {
			categories.push(entry.Category.name);
		}
	});

	return { categories, entries: result };
}

async function getOtherCategoriesValues(ignoreCategories: string[]):
	Promise<{ otherCategories: string[], otherEntries: any[]; }> {
	let { categories, ids } = await findOtherCategories(ignoreCategories);
	let result: any[] = [];
	try {
		result = await Entry.findAll({
			attributes: [...selectRelevant, ["createdAt", "date"]],
			include: {
				model: Category,
				required: true,
				attributes: ["name", "id"]
			},
			where: {
				CategoryId: {
					[Op.in]: ids
				}
			}
		});
	} catch (err) {
		console.error(err);
	}

	return { otherCategories: categories, otherEntries: result };
}

async function findOtherCategories(ignoreCategories: string[]): Promise<{ categories: string[], ids: number[]; }> {
	let categories: string[] = [];
	let ids: number[] = [];

	try {
		const result = await Category.findAll({
			attributes: ["name", "id"],
			where: {
				name: {
					[Op.notIn]: ignoreCategories
				}
			}
		});

		result.forEach(category => {
			categories.push(category.getDataValue("name"));
			ids.push(category.getDataValue("id"));
		});

	} catch (err) {
		console.error(err);
	}

	return { categories, ids };
}

const addEntry = async (req: Request, res: Response): Promise<void> => {
	/*
	* Request should look like
	* entries: [{
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
			const { description, amount, CategoryId, category } = entries[i];
			if (!description || !amount || (!CategoryId && !category)) {
				throw new ParameterError(
					`Missing either parameters in entries[${i}]`);
			}

			/* Allow client to use category instead of CategoryId */
			if (category && !CategoryId) {
				entries[i].CategoryId = category;
			}
		}

		const result = await DefaultEntry.bulkCreate(entries);
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
	const entryToUpdateID = req.params.id as unknown as number;
	const newEntry = req.body.entry;

	try {
		if (!newEntry) {
			throw new ParameterError("No entry in body.");
		} else if (isNaN(entryToUpdateID)) {
			throw new ParameterError("ID is NaN.");
		} else if (!newEntry.description && !newEntry.amount && !newEntry.CategoryId) {
			throw new ParameterError("No proper parameters in body. Expected date, description, amount or CategoryId.");
		}

		const entryRow = await DefaultEntry.findByPk(entryToUpdateID);
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

		const result = await DefaultEntry.destroy({ where: { id: entryToRemoveID } });
		res.status(200).json({ message: `Removed ${result} rows.` });
	} catch (err) {
		if (err instanceof ParameterError) {
			res.status(400).json({ message: err.message });
		} else {
			res.status(500).json({ message: "Something went wrong." });
		}
	}
};

export default { getAllEntries, addEntry, updateEntry, removeEntry };