"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get('/api/hello', (_req, res) => {
    res.json({ message: 'Hello from the server!' });
});
app.get('/api/data', async (_req, res) => {
    // 1s delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.json({
        items: [
            { id: 1, name: 'Example Item 1', description: 'This is the first example item.' },
            { id: 2, name: 'Example Item 2', description: 'This is the second example item.' },
            { id: 3, name: 'Example Item 3', description: 'This is the third example item.' },
        ]
    });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
