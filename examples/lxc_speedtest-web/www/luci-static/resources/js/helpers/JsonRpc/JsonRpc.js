///--Copyright (C) 2021 Perenio IoT spol. s r.o.*
import JsonRpcUci from "./JsonRpcUci.js";

import JsonRpcSys from "./JsonRpcSys.js";

export default class JsonRpc {

    static _uci = JsonRpcUci.Instance;

    static _sys = JsonRpcSys.Instance;
 
    /**
     * Request into UCI
     * 
     * @param {string} params 
     * @param {string} method 
     */
    static requestIntoUCI(method, params) { 
        return this._uci.performRequest(method, params);
    }

    /**
     * Commit changes into UCI
     * 
     * @param {string} configName 
     */
    static commitIntoUCI(configName) {
        return this._uci.commit(configName);
    }

    /**
     * Request into openwrt system os.execute
     *  
     * @param {string} method 
     * @param {string} params 
     */
    static requestIntoSYS(method, params) {
        return this._sys.performRequest(method, params);
    }
}