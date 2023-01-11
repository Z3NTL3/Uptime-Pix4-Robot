
/**
 * Programmged by Pix4
 * Author: Z3NTL3
 * 
 * License: GNU
 */

import http from 'http'

type HEADERS = Array<Record<string,string>>
type STATUS = "online" | "offline" | "not-checked"
enum DOMAINS {
    main="pix4.dev",
    api="api.pix4.dev"
}
type domainStates = {
    domain: string
    state: STATUS
}

type States = Array<domainStates>
const listDomains: Array<String> = [
    `https://${DOMAINS.main}`,
    `https://${DOMAINS.api}`,
]

interface IUP {
    humanify: (headers: HEADERS) => void
    checkIfUp: () => Promise<any>
    status: Array<domainStates> // call checkifup before to update the property
}
class UptimeCheck<IUP> {
    status: Array<domainStates>
    private finalHeaders: { [key: string]: string }
    private agent: http.Agent

    constructor(){
        this.finalHeaders = {}
        this.status = []
        this.agent = new http.Agent({
            timeout: 5000
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
        return new Promise(async (resolve) =>{
            const req = (i: any, v: any) => {
                return new Promise((_resolve)=>{
                    http.get({
                        timeout: 5000,
                        agent: this.agent,
                        headers: this.finalHeaders,
                        host: `${listDomains[i].replace("https://","")}`,
                        path: `/`
                    },(res) => {
                        let index = this.status.findIndex((ctx) => ctx.domain === v.replace("https://",""))
                        if(typeof res.statusCode !== 'undefined'){
                            if(res.statusCode >= 200 && res.statusCode <= 399){
                                this.status[index].state = "online"
                            } else {
                                this.status[index].state = "offline"
                            }
                        }
                        _resolve(1)
                    })
                })
            }
            
            for (const [i, v] of Object.entries(listDomains)) {
                await req(i,v)   
            } 
            resolve(1)             
        })
    }
}

export  { UptimeCheck }