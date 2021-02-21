"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var defaultEntry_1 = __importDefault(require("../controllers/defaultEntry"));
var router = express_1.default.Router();
router.get("/", defaultEntry_1.default.getAllEntries);
router.post("/new", defaultEntry_1.default.addEntry);
router.patch("/update/:id", defaultEntry_1.default.updateEntry);
router.delete("/delete/:id", defaultEntry_1.default.removeEntry);
module.exports = router;
