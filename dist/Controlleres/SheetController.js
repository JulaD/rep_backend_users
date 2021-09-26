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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SheetService_1 = __importDefault(require("../Services/SheetService"));
const logger_1 = __importDefault(require("../Logger/logger"));
const router = (0, express_1.Router)();
const parseSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sheet = req.body;
    try {
        const parsedSheet = SheetService_1.default.parseSheetService(sheet);
        return res.status(200).send(parsedSheet);
    }
    catch (error) {
        const e = error;
        logger_1.default.info(e.message);
        return res.status(400).json({ error: e.message });
    }
});
router.post('/', parseSheet);
exports.default = router;
//# sourceMappingURL=SheetController.js.map