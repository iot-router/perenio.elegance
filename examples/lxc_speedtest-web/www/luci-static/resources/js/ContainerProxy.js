///--Copyright (C) 2021 Perenio IoT spol. s r.o.*

export default class ContainerProxy {

    static instance;

    static listen(instance) {

        console.log('ContainerProxy start.\nInjected instance', instance.constructor.name);

        this.instance = instance;
        
        this.instance.run(this);

        window.addEventListener('message', e => this.run(e));

    }

    static run(e) {

        if (!e.data.msg || e.data.msg == "") 
            return;
        
        switch(e.data.msg.entity) {
            
            case "instance":
                
                this.instance[e.data.msg.method]();
                
                break;
            
            case "dom": 
                
                this[e.data.msg.method](e.data.msg.args.selector, e.data.msg.args.className);
                
                break;
        } 
    }

    static addClassToDom(selector, className) {
        document.querySelector(selector).classList.add(className);
    }
    
    static applyHostStyles(rule = { "height": `${document.querySelector('#maincontent').offsetHeight + 150}px` }) {
        window.parent.postMessage({"style": rule }, '*');
    }

    static callHostPreloader(state) {
        window.parent.postMessage({"loader": state}, '*');
    }

    static callHostNotifier(message) {
        window.parent.postMessage({"notifier": message}, '*');
    }
}