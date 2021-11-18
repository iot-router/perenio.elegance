///--Copyright (C) 2021 Perenio IoT spol. s r.o.*

import JsonRpcConnector from "./JsonRpcConnector.js";

export default class JsonRpcUci extends JsonRpcConnector {

    static instance = null;

    static get Instance() {

        if (!JsonRpcUci.instance)
            this.instance = new JsonRpcUci();

        return this.instance;
    }

    /**
     * @param {string} params 
     * @param {string} method [http://openwrt.github.io/luci/api/modules/luci.model.uci.html]
     */
    async performRequest(method, params) {

        try {

            const uci = await this.doRequest("uci", `{"id": "1", "method": "${method}", "params": ${params}}`);

            return uci;

        } catch (err) {
            console.error(`"webgui jsonrpc-uci error": "${err}"`);
        }
    }

    /**
     * @param {string} config_name 
     */
    async commit(config_name) {

        try {

            const uci = await this.doRequest("uci", `{"id": "1","method": "commit", "params": ["${config_name}"]}`);

            return uci;

        } catch (err) {
            console.error(`Catch in JsonRpc commitIntoUCI method, ${err}`);
        }
    }
}