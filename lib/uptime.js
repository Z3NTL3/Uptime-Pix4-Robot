"use strict";
/**
 * Programmged by Pix4
 * Author: Z3NTL3
 *
 * License: GNU
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UptimeCheck = void 0;
const http_1 = __importDefault(require("http"));
var DOMAINS;
(function (DOMAINS) {
    DOMAINS["main"] = "pix4.dev";
    DOMAINS["api"] = "api.pix4.dev";
})(DOMAINS || (DOMAINS = {}));
const listDomains = [
    `https://${DOMAINS.main}`,
    `https://${DOMAINS.api}`,
];
class UptimeCheck {
    constructor() {
        this.finalHeaders = {};
        this.status = [];
        this.agent = new http_1.default.Agent({
            timeout: 5000
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
        return new Promise(async (resolve) => {
            const req = (i, v) => {
                return new Promise((_resolve) => {
                    http_1.default.get({
                        timeout: 5000,
                        agent: this.agent,
                        headers: this.finalHeaders,
                        host: `${listDomains[i].replace("https://", "")}`,
                        path: `/`
                    }, (res) => {
                        let index = this.status.findIndex((ctx) => ctx.domain === v.replace("https://", ""));
                        if (typeof res.statusCode !== 'undefined') {
                            if (res.statusCode >= 200 && res.statusCode <= 399) {
                                this.status[index].state = "online";
                            }
                            else {
                                this.status[index].state = "offline";
                            }
                        }
                        _resolve(1);
                    });
                });
            };
            for (const [i, v] of Object.entries(listDomains)) {
                await req(i, v);
            }
            resolve(1);
        });
    }
}
exports.UptimeCheck = UptimeCheck;
