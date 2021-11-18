///--Copyright (C) 2021 Perenio IoT spol. s r.o.*

import JsonRpc from "../../helpers/JsonRpc/JsonRpc.js"

import ConnectionChecker from "./../../helpers/ConnectionChecker.js";

export default class Speedtest {

    constructor() {

        this.start_button = document.querySelector('#start-test');

        this.modal = new mdc.dialog.MDCDialog(document.querySelector('.mdc-dialog'));

        console.log('Initialyze the ', this.constructor.name);
    }

    set output_view(val) {
        document.querySelector('#output').innerHTML = val;
    }

    get output_view() {
        return document.querySelector('#output').innerHTML;
    }

    async run(proxy) {

        try {

            this.proxy = proxy;
            
            mdc.autoInit();

            await ConnectionChecker.isOnline();

            this.proxy.applyHostStyles();

            this.addStartTestEvent();

            this.addShowResultEvents();

            console.log(location.href, 'Speedtest.run');
        
        } catch(err) {
            console.warn('Caught an error in Speedtest.run', err);
        }
    }

    addStartTestEvent() {
        this.start_button.addEventListener('click', async () => await ConnectionChecker.isOnline() && this.runTest());
    }

    addShowResultEvents() {
        
        document.querySelector("#modal-cancel").addEventListener('click', () => this.modal.close());

        document.querySelector("#modal-ok").addEventListener('click', async () => await ConnectionChecker.isOnline() && this.runTest());

    }

    runTest() {

        try {

            this.modal.close();

            console.log('Speedtest.runTest');

            this.proxy.callHostPreloader('show');

            JsonRpc.requestIntoSYS('exec', `/root/speedtest/speedtest --share &> /tmp/output`);

            this._showTestProcess();

        } catch (err) {
            
            console.warn('Caught an error in Speedtest.runTest', err);

            throw err;
        }
    }

    async _showTestProcess() {

        try {

            const cat_output = await JsonRpc.requestIntoSYS('exec', `cat /tmp/output`);

            const is_done = cat_output.toLowerCase().includes('results image');

            const is_has_errors = cat_output.toLowerCase().includes('error') || cat_output.toLowerCase().includes('not found');

            this.output_view = cat_output;

            if (is_done || is_has_errors)
                return await this.stopTest();

            this._showing_id = window.setTimeout(async () => await this._showTestProcess(), 1000);

        } catch (err) {

            console.warn("Caught error in the _showTestProcess", err);

            throw err;
        }
    }

    async stopTest() {

        try {
            const bg = this.output_view.match(/Results image:\s(.*)/);

            bg && bg[1] && setTimeout(() => this._showResult(bg[1]), 1500);

            window.clearTimeout(this._showing_id);

            await JsonRpc.requestIntoSYS('exec', 'rm -f /tmp/output');

            this.proxy.callHostPreloader('hide');

            console.log('Speedtest.stopTest');

        } catch (err) {
            console.warn('Caught an error in Speedtest.stopTest', err);
        }
    }

    _showResult(val) {

        document.querySelector('test-result').style.backgroundImage = `url('${val}')`;

        this.modal.open();
        
    }
}