///--Copyright (C) 2021 Perenio IoT spol. s r.o.*

export default class JsonRpcConnector {

    _rpc_url = `/cgi-bin/luci/rpc`;

    _rpc_username = "root";

    _rpc_password = "";

    _conn_attempts = 0;

    async _setSession() {

        const auth = await fetch('/cgi-bin/luci/rpc/auth', {

            headers: { "Content-Type": "application/x-www-form-urlencoded" },

            method: "POST",

            body: JSON.stringify({
                "id": 1,
                "method": "login",
                "params": [
                    this._rpc_username,
                    this._rpc_password
                ]
            })

        }).then(d => d.json());

        console.log('Set sid and token to session storage', auth.result);

        sessionStorage.setItem('sid', auth.result.sid);

        sessionStorage.setItem('token', auth.result.token);
    }

    /**
     * Do JsonRpc request to into OpenWRT
     * 
     * @param {string} library [uci, sys]
     * @param {string} data 
     */
    async doRequest(library, data) {

        let responce = await fetch(`${this._rpc_url}/${library}?auth=${sessionStorage.getItem('sid')}`, {

            headers: { "Content-Type": "application/x-www-form-urlencoded" },

            method: "POST",

            body: data
        });

        if (responce.status == 403 && this._conn_attempts++ < 3) {
            
            await this._setSession();

            responce = await this.doRequest(library, data);
        }

        try {
            return responce.json(); 
        } catch {
            return responce;
        }
    }
}