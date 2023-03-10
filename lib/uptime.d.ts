/**
 * Programmed by Pix4
 * Author: Z3NTL3
 *
 * License: GNU
 */
type HEADERS = Array<Record<string, string>>;
type STATUS = "online" | "offline" | "not-checked" | "maintenance";
type domainStates = {
    domain: string;
    state: STATUS;
};
type States = Array<domainStates>;
declare class UptimeCheck<IUP> {
    status: Array<domainStates>;
    private finalHeaders;
    private agent;
    constructor();
    humanify(headers: HEADERS): void;
    checkIfUp(): Promise<any>;
}
export { UptimeCheck, STATUS, States };
