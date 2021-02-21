"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __importDefault(require("../config/logging"));
var category_1 = require("../models/category");
var errors_1 = require("../interfaces/errors");
var sequelize_1 = require("sequelize");
var workspace = "category-ctrl";
var getCategories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, ex_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, category_1.Category.findAll({ attributes: ["id", "name"] })];
            case 1:
                categories = _a.sent();
                res.status(200).json({ categories: categories });
                return [3 /*break*/, 3];
            case 2:
                ex_1 = _a.sent();
                logging_1.default.error(workspace, "Could not fetch categories", ex_1.message);
                res.status(500).json({ message: "Something went wrong." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var newCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqCategory, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                reqCategory = req.body;
                if (!reqCategory || !reqCategory.name) {
                    throw new errors_1.NoCategoryError("No new category in body.");
                }
                return [4 /*yield*/, category_1.Category.create(reqCategory)];
            case 1:
                result = _a.sent();
                res.status(201).json({ category: result.name, id: result.id });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                if (err_1 instanceof errors_1.NoCategoryError) {
                    res.status(400).json(err_1.message);
                }
                else if (err_1 instanceof sequelize_1.ValidationError) {
                    if (err_1.name === "SequelizeUniqueConstraintError") {
                        res.status(400).json({ message: "Category already exists." });
                    }
                    else {
                        res.status(400).json({ message: err_1.message });
                    }
                }
                else {
                    res.status(500).json({ message: "Could not save category..." });
                    logging_1.default.error("Could not create new category.", err_1);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var deleteCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryToDeleteID, result, resCode, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryToDeleteID = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (isNaN(categoryToDeleteID)) {
                    throw new errors_1.ParameterError("No ID specified or ID is NaN.");
                }
                return [4 /*yield*/, category_1.Category.destroy({
                        where: {
                            id: categoryToDeleteID
                        }
                    })];
            case 2:
                result = _a.sent();
                resCode = (result == 0 ? 400 : 200);
                res.status(resCode).json({ rowsDeleted: result });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                if (err_2 instanceof errors_1.ParameterError) {
                    res.status(400).json({ message: err_2.message });
                }
                res.status(500).json({ message: "Something went wrong." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var updateCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryToUpdateID, newCategoryName, categoryRow, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryToUpdateID = req.params.id;
                newCategoryName = req.body.name;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                if (isNaN(categoryToUpdateID)) {
                    throw new errors_1.ParameterError("ID is not valid.");
                }
                else if (!newCategoryName) {
                    throw new errors_1.ParameterError("New category name undefined.");
                }
                return [4 /*yield*/, category_1.Category.findByPk(categoryToUpdateID)];
            case 2:
                categoryRow = _a.sent();
                if (categoryRow === null) {
                    throw new errors_1.ParameterError("Could not find Category with ID " + categoryToUpdateID);
                }
                return [4 /*yield*/, categoryRow.update({
                        name: newCategoryName
                    })];
            case 3:
                _a.sent();
                res.status(200).json({ message: "Name updated." });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                if (err_3 instanceof errors_1.ParameterError) {
                    res.status(400).json({ message: err_3.message });
                }
                else {
                    res.status(500).json({ message: "Something went wrong." });
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.default = { getCategories: getCategories, newCategory: newCategory, deleteCategory: deleteCategory, updateCategory: updateCategory };
