///--Copyright (C) 2021 Perenio IoT spol. s r.o.*

export default class Translator {

    static source;

    static async run() {

        this.source = await this._getTranslations();

        await this.setCurrentLang();

        this.doTranslate();
    }

    /**
     * Translate elements with data attribute data-translate
     */
    static doTranslate() {

        const fields = document.querySelectorAll(`[data-translate]`);

        for (let field of fields)
            if (!!this.source[this.currentLang][field.dataset.translate])
                field.innerHTML = this.source[this.currentLang][field.dataset.translate];

    }

    static async setCurrentLang () {

        const translator = await fetch(`http://192.168.1.1/cgi-bin/luci/api/translator`, {

            method: "POST",

            body: JSON.stringify({ method: 'getCurLanguage' })

        }).then(d => d.json());

        window.localStorage.setItem('lang', translator);
    }

    static get currentLang() {
        return window.localStorage.getItem('lang') ;
    }

    static getPhrase(key) {

        return !!this.source[this.currentLang][key] ?
            this.source[this.currentLang][key]
            :
            `${key}`;
    }

    static _getTranslations() {
        return window.fetch('/luci-static/resources/json/translations.json', { cache: "no-store" }).then(d => d.json());
    }
}