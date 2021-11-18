///--Copyright (C) 2021 Perenio IoT spol. s r.o.*

import JsonRpc from "./JsonRpc/JsonRpc.js";

import ContainerProxy from "../ContainerProxy.js"

export default class ConnectionChecker {

    static async isOnline() {

        ContainerProxy.callHostPreloader('show');

        const ping = await JsonRpc.requestIntoSYS('exec', 'ping -W 3 -c 1 8.8.8.8');

        ContainerProxy.callHostPreloader('hide');

        if (ping.includes('1 packets transmitted, 1 packets received, 0% packet loss'))

            return true;
        
        ContainerProxy.callHostNotifier('check_inet_connection');

        return false;
    }
}