"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var node_fetch_1 = require("node-fetch");
var CryptoniteWallet = /** @class */ (function () {
    function CryptoniteWallet(host, port) {
        var _this = this;
        this.CoinUnits = 100000000;
        this.Fee = 100000;
        this.GetBalance = function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._RPC("getbalance")];
                    case 1:
                        result = (_a.sent()).result;
                        return [2 /*return*/, {
                                Unlocked: parseInt(result.available_balance) / this.CoinUnits,
                                Locked: parseInt(result.locked_amount) / this.CoinUnits
                            }];
                }
            });
        }); };
        this.Transfer = function (amount, address) { return __awaiter(_this, void 0, void 0, function () {
            var payload, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            "destinations": [{ amount: (amount * this.CoinUnits), address: address }],
                            "mixin": 4,
                            "get_tx_key": true,
                            "fee": this.Fee,
                            "unlock_time": 3
                        };
                        return [4 /*yield*/, this._RPC("transfer", payload)];
                    case 1:
                        result = _a.sent();
                        if (result.error)
                            return [2 /*return*/, result.error.message];
                        return [2 /*return*/, result && result.result && result.result.tx_hash];
                }
            });
        }); };
        this.isIPBCAddressValid = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var pattern;
            return __generator(this, function (_a) {
                pattern = new RegExp(/b[0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{96}$/g);
                return [2 /*return*/, pattern.test(address)];
            });
        }); };
        this._RPC = function (method, params) { return __awaiter(_this, void 0, void 0, function () {
            var body, result, resultJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            jsonrpc: '2.0',
                            id: '0',
                            method: method
                        };
                        if (params)
                            body.params = params;
                        return [4 /*yield*/, node_fetch_1.default("http://" + this.Host + ":" + this.Port + "/json_rpc", {
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(body)
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        resultJson = _a.sent();
                        return [2 /*return*/, resultJson];
                }
            });
        }); };
        this.Host = host;
        this.Port = port;
    }
    return CryptoniteWallet;
}());
exports.CryptoniteWallet = CryptoniteWallet;
