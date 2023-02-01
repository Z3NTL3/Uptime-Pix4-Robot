"use strict";
/**
 * Programmed by Pix4
 * Author: Z3NTL3
 *
 * License: GNU
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UptimeCheck = void 0;
const undici_1 = __importStar(require("undici"));
const maintenanceHeader = 'x-pix4-maintenance';
var DOMAINS;
(function (DOMAINS) {
    DOMAINS["main"] = "pix4.dev";
    DOMAINS["api"] = "api.pix4.dev";
    DOMAINS["my"] = "my.pix4.dev";
})(DOMAINS || (DOMAINS = {}));
const listDomains = [
    `https://${DOMAINS.main}`,
    `https://${DOMAINS.api}`,
    `https://${DOMAINS.my}`,
];
class UptimeCheck {
    constructor() {
        this.finalHeaders = {};
        this.status = [];
        this.agent = new undici_1.Agent({
            keepAliveTimeout: 5,
            keepAliveMaxTimeout: 5
        });
        for (var i = 0; i < listDomains.length; i++) {
            this.status.push({ domain: listDomains[i].replace("https://", ""), state: "not-checked" });
        }
    }
    humanify(headers) {
        for (const [_, v] of Object.entries(headers)) {
            for (const [k, _v] of Object.entries(v)) {
                this.finalHeaders[k] = _v;
            }
        }
    }
    checkIfUp() {
        return new Promise(async (resolve, reject) => {
            const req = (i, v) => {
                return new Promise(async (_resolve, _reject) => {
                    try {
                        let index = this.status.findIndex((ctx) => ctx.domain === v.replace("https://", ""));
                        let req = await undici_1.default.request(v, { method: "GET", dispatcher: this.agent });
                        if (req.statusCode >= 200 && req.statusCode <= 399) {
                            if (req.headers[maintenanceHeader] === "yes") {
                                this.status[index].state = "maintenance";
                            }
                            else {
                                this.status[index].state = "online";
                            }
                        }
                        else {
                            this.status[index].state = "offline";
                        }
                        _resolve(1);
                    }
                    catch (err) {
                        _reject(err);
                    }
                });
            };
            let errT = false;
            let errI;
            for (const [i, v] of Object.entries(listDomains)) {
                await req(i, v).catch((err) => {
                    errT = true;
                    errI = err;
                });
            }
            if (errT) {
                return reject(errI);
            }
            return resolve(1);
        });
    }
}
exports.UptimeCheck = UptimeCheck;
