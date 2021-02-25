"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var sequelize_1 = require("sequelize");
var logging_1 = __importDefault(require("../config/logging"));
var errors_1 = require("../interfaces/errors");
var category_1 = require("../models/category");
var entry_1 = require("../models/entry");
var workspace = "entry-ctrl";
var selectRelevant = ["id", "date", "description", "amount"];
var getAllEntries = function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, categories_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, entry_1.Entry.findAll({
                        attributes: selectRelevant,
                        include: {
                            model: category_1.Category,
                            required: true,
                            attributes: ["name"]
                        }
                    })];
            case 1:
                result = _a.sent();
                categories_1 = [];
                result.forEach(function (entry) {
                    console.log(entry);
                    if (categories_1.indexOf(entry.Category.name) == -1) {
                        categories_1.push(entry.Category.name);
                    }
                });
                res.status(200).json({ categories: categories_1, result: result });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                logging_1.default.error(workspace, "Could not get entries.", err_1.message);
                res.status(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var constructWhereQuery = function (req) {
    var _a;
    var query = req.query;
    var result = {};
    // Date
    var year = query.year;
    var month = query.month;
    if (query.year && !isNaN(year)) {
        /* Do some NodeJS Date magic
           new Date("2021") => 2021-01-01
           new Date(2021, 12) => 2021-12-31

           new Date("2021-03") => 2021-03-01
           new Date(2021, 3) => 2021-03-30
        */
        var start = new Date("" + query.year);
        var end = new Date(year, 12);
        if (query.month && !isNaN(month)) {
            start = new Date(query.year + "-" + query.month);
            end = new Date(year, month);
        }
        result.date = (_a = {}, _a[sequelize_1.Op.between] = [start, end], _a);
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
var getSpecific = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, result, categories_2, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = constructWhereQuery(req);
                return [4 /*yield*/, entry_1.Entry.findAll({
                        //@ts-expect-error TS doesn't like this, but it constructs a completely valid query as expected
                        where: __assign({}, query),
                        attributes: selectRelevant,
                        include: {
                            model: category_1.Category,
                            required: true,
                            attributes: ["name"]
                        }
                    })];
            case 1:
                result = _a.sent();
                categories_2 = [];
                result.forEach(function (entry) {
                    if (categories_2.indexOf(entry.Category.name) == -1) {
                        categories_2.push(entry.Category.name);
                    }
                });
                res.status(200).json({ categories: categories_2, result: result });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                logging_1.default.error(workspace, "Could not get specific.", err_2);
                res.status(500).json({ message: "Something went wrong." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addEntry = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var entries, i, _a, date, description, amount, CategoryId, Category_1, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                entries = req.body.entries;
                // check that entries is an array
                if (!entries || !Array.isArray(entries) || entries.length < 1) {
                    throw new errors_1.ParameterError("Expected entries to be an array.");
                }
                // check that entries.date, description, amount and categories exist
                for (i = 0; i < entries.length; i++) {
                    _a = entries[i], date = _a.date, description = _a.description, amount = _a.amount, CategoryId = _a.CategoryId, Category_1 = _a.Category;
                    if (!date || !description || !amount || (!CategoryId && !Category_1.id)) {
                        throw new errors_1.ParameterError("Missing either parameters in entries[" + i + "].");
                    }
                    /* Allow client to use category instead of CategoryId */
                    if (Category_1.id && !CategoryId) {
                        entries[i].CategoryId = Category_1.id;
                    }
                }
                return [4 /*yield*/, entry_1.Entry.bulkCreate(entries)];
            case 1:
                result = _b.sent();
                res.status(201).json(result);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                if (err_3 instanceof errors_1.ParameterError) {
                    console.log(err_3.message);
                    res.status(400).json(err_3.message);
                }
                else {
                    logging_1.default.error(workspace, "Could not add entry.", err_3);
                    res.status(500);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateEntry = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var entryToUpdateID, newEntry, entryRow, result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                entryToUpdateID = req.params.id;
                newEntry = req.body.entry;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                if (!newEntry) {
                    throw new errors_1.ParameterError("No entry in body.");
                }
                else if (isNaN(entryToUpdateID)) {
                    throw new errors_1.ParameterError("ID is NaN.");
                }
                else if (!newEntry.date && !newEntry.description && !newEntry.amount && !newEntry.CategoryId) {
                    throw new errors_1.ParameterError("No proper parameters in body. Expected date, description, amount or CategoryId.");
                }
                return [4 /*yield*/, entry_1.Entry.findByPk(entryToUpdateID)];
            case 2:
                entryRow = _a.sent();
                if (!entryRow) {
                    throw new errors_1.ParameterError("Could not find entry with ID " + entryToUpdateID);
                }
                return [4 /*yield*/, entryRow.update(newEntry)];
            case 3:
                result = _a.sent();
                res.status(200).json({ result: result });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                if (err_4 instanceof errors_1.ParameterError) {
                    res.status(400).json({ message: err_4.message });
                }
                else {
                    res.status(500).json({ message: "Something went wrong." });
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var removeEntry = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var entryToRemoveID, result, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                entryToRemoveID = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (isNaN(entryToRemoveID)) {
                    throw new errors_1.ParameterError("ID is NaN.");
                }
                return [4 /*yield*/, entry_1.Entry.destroy({ where: { id: entryToRemoveID } })];
            case 2:
                result = _a.sent();
                res.status(200).json({ message: "Removed " + result + " rows." });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                if (err_5 instanceof errors_1.ParameterError) {
                    res.status(400).json({ message: err_5.message });
                }
                else {
                    res.status(500).json({ message: "Something went wrong." });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = { getAllEntries: getAllEntries, addEntry: addEntry, getSpecific: getSpecific, updateEntry: updateEntry, removeEntry: removeEntry };
