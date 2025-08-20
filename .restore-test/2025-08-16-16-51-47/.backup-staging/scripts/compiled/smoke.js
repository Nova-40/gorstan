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
var GameEngine_1 = require("@/engine/GameEngine");
var roomRouter_1 = require("@/engine/roomRouter");
var npcEngine_1 = require("@/engine/npcEngine");
var teleportSystem_1 = require("@/engine/teleportSystem");
var items_1 = require("@/engine/items");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                console.log('Starting smoke test...');
                // Start a new game
                return [4 /*yield*/, (0, GameEngine_1.startGame)('Test Player')];
            case 1:
                // Start a new game
                _a.sent();
                console.log('Game started successfully.');
                // Move to two different rooms
                return [4 /*yield*/, (0, roomRouter_1.movePlayer)('room1')];
            case 2:
                // Move to two different rooms
                _a.sent();
                console.log('Moved to room1.');
                return [4 /*yield*/, (0, roomRouter_1.movePlayer)('room2')];
            case 3:
                _a.sent();
                console.log('Moved to room2.');
                // Interact with an NPC
                return [4 /*yield*/, (0, npcEngine_1.interactWithNPC)('npc1')];
            case 4:
                // Interact with an NPC
                _a.sent();
                console.log('Interacted with NPC.');
                // Trigger a teleport
                return [4 /*yield*/, (0, teleportSystem_1.triggerTeleport)('teleport1')];
            case 5:
                // Trigger a teleport
                _a.sent();
                console.log('Teleport triggered successfully.');
                // Interact with the Schrödinger coin
                return [4 /*yield*/, (0, items_1.interactWithSchrodingerCoin)()];
            case 6:
                // Interact with the Schrödinger coin
                _a.sent();
                console.log('Interacted with Schrödinger coin.');
                console.log('Smoke test completed successfully.');
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.error('Smoke test failed:', error_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); })();
