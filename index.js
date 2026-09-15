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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");
var openai_1 = require("openai");
dotenv.config();
var client = new openai_1.OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});
/**
 * Analyze an image from a specific folder
 */
function analyzeImageFromFolder(folderPath_1, fileName_1) {
    return __awaiter(this, arguments, void 0, function (folderPath, fileName, question) {
        var imagePath, imageBuffer, base64Image, ext, mimeType, dataUrl, response;
        if (question === void 0) { question = "Describe this image in detail."; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    imagePath = path.join(folderPath, fileName);
                    if (!fs.existsSync(imagePath)) {
                        throw new Error("Image not found: ".concat(imagePath));
                    }
                    imageBuffer = fs.readFileSync(imagePath);
                    base64Image = imageBuffer.toString("base64");
                    ext = path.extname(fileName).toLowerCase();
                    mimeType = "image/jpeg";
                    if (ext === ".png")
                        mimeType = "image/png";
                    else if (ext === ".webp")
                        mimeType = "image/webp";
                    else if (ext === ".gif")
                        mimeType = "image/gif";
                    dataUrl = "data:".concat(mimeType, ";base64,").concat(base64Image);
                    console.log("Sending image: ".concat(fileName, "..."));
                    return [4 /*yield*/, client.chat.completions.create({
                            model: "openrouter/free", // Auto picks free vision model
                            // model: "google/gemma-4-31b-it:free", // alternative
                            messages: [
                                {
                                    role: "user",
                                    content: [
                                        {
                                            type: "text",
                                            text: question,
                                        },
                                        {
                                            type: "image_url",
                                            image_url: {
                                                url: dataUrl,
                                            },
                                        },
                                    ],
                                },
                            ],
                            max_tokens: 1024,
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.choices[0].message.content];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var FOLDER_PATH, IMAGE_NAME, QUESTION, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    FOLDER_PATH = "./images";
                    IMAGE_NAME = "photo.png";
                    QUESTION = "What is in this image? Describe it in detail.";
                    return [4 /*yield*/, analyzeImageFromFolder(FOLDER_PATH, IMAGE_NAME, QUESTION)];
                case 1:
                    result = _a.sent();
                    console.log("\n===== AI Response =====");
                    console.log(result);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
main();
