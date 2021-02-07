import { Request, Response } from 'express';
import logging from '../config/logging';
import { Category } from '../models/category';
import { NoCategoryError, ParameterError } from '../interfaces/errors';
import { ValidationError } from 'sequelize';

const workspace = "category-ctrl"

const getCategories = async (req: Request, res: Response) => {
    try {
        let categories = await Category.findAll(
            { attributes: ['id', 'category'] }
        );
        res.status(200).json({ categories: categories });
    } catch (ex) {
        logging.error(workspace, "Could not fetch categories", ex.message);
        res.status(500).json({ message: "Something went wrong." });
    }
};

const newCategory = async (req: Request, res: Response) => {
    try {
        const reqCategory = req.body;
        if (!reqCategory || !reqCategory.category) {
            throw new NoCategoryError("No new category in body.");
        }

        const result = await Category.create(reqCategory);
        res.status(201).json({ category: result.category, id: result.id });
    } catch (err) {
        if (err instanceof NoCategoryError) {
            res.status(400).json(err.message);
        } else if (err instanceof ValidationError) {
            if (err.name === "SequelizeUniqueConstraintError") {
                res.status(400).json({ message: "Category already exists." });
            } else {
                res.status(400).json({ message: err.message });
            }
        } else {
            res.status(500).json({ message: "Could not save category..." });
            logging.error("Could not create new category.", err);
        }
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    const categoryToDeleteID = req.params.id;
    try {
        //@ts-expect-error
        if (isNaN(categoryToDeleteID)) {
            throw new ParameterError("No ID specified or ID is NaN.");
        }

        const result = await Category.destroy({
            where: {
                id: categoryToDeleteID
            }
        });

        /* is a category with that ID found? */
        const resCode = (result == 0 ? 400 : 200);
        res.status(resCode).json({ rowsDeleted: result });

    } catch (err) {
        if (err instanceof ParameterError) {
            res.status(400).json({ message: err.message });
        }

        res.status(500).json({ message: "Something went wrong." });
    }
};

const updateCategory = async (req: Request, res: Response) => {
    const categoryToUpdateID = req.params.id;
    const newCategoryName = req.body.category;

    try {
        //@ts-expect-error
        if (isNaN(categoryToUpdateID)) {
            throw new ParameterError("ID is not valid.");
        } else if (!newCategoryName) {
            throw new ParameterError("New category name undefined.");
        }

        const categoryRow = await Category.findByPk(categoryToUpdateID);
        if (categoryRow === null) {
            throw new ParameterError
                (`Could not find Category with ID ${categoryToUpdateID}`);
        }

        await categoryRow.update({
            category: newCategoryName
        });

        res.status(200).json({ message: "Name updated." });

    } catch (err) {
        if (err instanceof ParameterError) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Something went wrong." });
        }
    }
};

export default { getCategories, newCategory, deleteCategory, updateCategory };