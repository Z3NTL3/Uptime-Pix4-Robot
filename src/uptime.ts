
/**
 * Programmed by Pix4
 * Author: Z3NTL3
 * 
 * License: GNU
 */

import Undici , { Agent } from 'undici'

const maintenanceHeader = 'x-pix4-maintenance'
type HEADERS = Array<Record<string,string>>
type STATUS = "online" | "offline" | "not-checked" | "maintenance"
enum DOMAINS {
    main="pix4.dev",
    api="api.pix4.dev",
    my="my.pix4.dev"
}
type domainStates = {
    domain: string
    state: STATUS
}
type States = Array<domainStates>
const listDomains: Array<String> = [
    `https://${DOMAINS.main}`,
    `https://${DOMAINS.api}`,
    `https://${DOMAINS.my}`,
]

interface IUP {
    humanify: (headers: HEADERS) => void
    checkIfUp: () => Promise<any>
    status: Array<domainStates> // call checkifup before to update the property
}
class UptimeCheck<IUP> {
    status: Array<domainStates>
    private finalHeaders: { [key: string]: string }
    private agent: Agent

    constructor(){
        this.finalHeaders = {}
        this.status = []
        this.agent = new Agent({
            keepAliveTimeout: 5,
            keepAliveMaxTimeout: 5
        })
        for(var i = 0; i < listDomains.length; i++){
            this.status.push({domain: listDomains[i].replace("https://",""), state: "not-checked"})
        }
    }

    humanify(headers: HEADERS){
        for(const [_, v] of Object.entries(headers)){
            for(const [k, _v] of Object.entries(v)){
                this.finalHeaders[k] = _v
            }
        }
    }

    checkIfUp():Promise<any> {
        return new Promise( async (resolve, reject) =>{
            const req = (i: any, v: any) => {
                return new Promise(async (_resolve,_reject)=>{
                    try {
                        let index = this.status.findIndex((ctx) => ctx.domain === v.replace("https://",""))
                        let req = await Undici.request(v,{method: "GET",dispatcher: this.agent})
                        
                        if(req.statusCode >= 200 && req.statusCode <= 399){
                            if(typeof req.headers[maintenanceHeader] !== 'undefined' && req.headers[maintenanceHeader] === "yes") {this.status[index].state === 'maintenance'}
                            else { this.status[index].state = "offline" }
                        } else {
                            this.status[index].state = "offline"
                        }
                        _resolve(1)
                    } catch(err){
                        _reject(err)
                    }
                })
            }
            
            let errT = false
            let errI: Error | undefined
            for (const [i, v] of Object.entries(listDomains)) {
                await req(i,v).catch((err: Error) =>{
                    errT = true
                    errI = err
                })            
            } 
            if(errT){
                return reject(errI)
            }
            return resolve(1)             
        })
    }
}

export  { UptimeCheck , STATUS , States}