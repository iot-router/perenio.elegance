///--Copyright (C) 2021 Perenio IoT spol. s r.o.*

import JsonRpcConnector from "./JsonRpcConnector.js";

export default class JsonRpcSys extends JsonRpcConnector {

    static instance = null;

    static get Instance() { 
        
        if (!JsonRpcSys.instance) 
            this.instance = new JsonRpcSys();
        
        return this.instance;
    }
    
    async performRequest(method, params) {

        try {

            const reqbody = JSON.stringify({ "id": "1", "method": method, "params": [params] });

            const responce = await this.doRequest("sys", reqbody);

            if (responce.error)
                console.error(`${responce.error.message}\nError code: ${responce.error.code}`);

            try {
                return JSON.parse(responce.result);

            } catch {
                return responce.result;
            }

        } catch (err) {
            console.error(`Error in JsonRpc requestIntoSYS method, ${err}`, err);
        }
    }
}