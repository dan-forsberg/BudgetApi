"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var entry_1 = __importDefault(require("../controllers/entry"));
var router = express_1.default.Router();
router.get("/", entry_1.default.getAllEntries);
router.get("/specific", entry_1.default.getSpecific);
router.post("/new", entry_1.default.addEntry);
router.patch("/update/:id", entry_1.default.updateEntry);
router.delete("/delete/:id", entry_1.default.removeEntry);
module.exports = router;
