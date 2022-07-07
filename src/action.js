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
exports.run = void 0;
const core_1 = __importDefault(require("@actions/core"));
const ConnectedServiceName = core_1.default.getInput('ConnectedServiceName');
function run(ConnectedServiceName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (ConnectedServiceName == '72f988bf-86f1-41af-91ab-2d7cd011db47') {
                console.log("Valid ConnecterServiceName");
            }
            else {
                console.log("Invalid ConnecterServiceName" + ConnectedServiceName);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.run = run;
