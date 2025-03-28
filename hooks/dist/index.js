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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
app.listen(3000);
app.use(express_1.default.json());
app.post('/hooks/catch/:userid/:zapid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.params.userid;
    const zapId = req.params.zapid;
    const body = req.body;
    //store in db a new trigger
    yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const run = yield client.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        yield client.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        });
    }));
    res.json({
        message: "webhook recieved"
    });
}));
