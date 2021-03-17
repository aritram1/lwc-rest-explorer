import { LightningElement, track } from 'lwc';
//const DEFAULT_GRADIENT_CHANGE = 0.05;
const DEFAULT_STYLE = "background-color: rgba(5, 122, 218, ";
const DEFAULT_ERROR_STYLE = "background-color: rgba(255, 0, 0, ";
const DEFAULT_RESPONSE = 'Response will appear here';

export default class Postman extends LightningElement {

    endpoint = 'http://0.0.0.0:3002/';
    // Some test APIs
    //'https://dog.ceo/api/breeds/image/random';
    //''https://jsonplaceholder.typicode.com/posts/';
    itemstyle = "background-color: rgba(5, 122, 218, 0)";
    alpha;
    @track history;
    @track response;
    @track timetaken;
    @track method;
    @track body;
    @track headers;
    @track auth;
    @track showtooltip;
    
    constructor(){
        super();
        this.history = [];
        this.response = DEFAULT_RESPONSE;
        this.timetaken = '00';
        this.method = 'GET';
        this.alpha = 0;
    }

    handleHoverIn(e){
        //e.target.nextSibling.style.backgroundColor = e.target.style.backgroundColor;
        e.target.nextSibling.style.color = e.target.style.color;
        e.target.nextSibling.style.display = 'block';
    }

    handleHoverOut(e){
        e.target.nextSibling.style.display = 'none';
    }

    handleClick(event){
        // console.log('Auth received as : ' + JSON.stringify(this.auth));
        // console.log('Body received as : ' + JSON.stringify(this.body));
        // console.log('Headers received as : ' + JSON.stringify(this.headers));
        let options = {};

        if(this.auth){
            console.log('this.auth is received NOT NULL => ' + JSON.stringify(this.auth));
            if(this.auth.type === 'BASIC'){
                let {uname, pwd} = this.auth;
                options.uname = uname;
                options.pwd = pwd;
                options.type = 'Basic';
            }
            else if(this.auth.type === 'OAUTH2'){
                let {cId, cCode} = this.auth;
                options.cId = cId;
                options.cCode = cCode;
                options.type = 'OAuth 2.0';
            }
        }
        if(this.headers){
            console.log('this.headers is received NOT NULL => ' + JSON.stringify(this.headers));
            for(let p of this.headers){
                console.log(`Property -> ${p} AND Value -> ${this.headers[p]}`);
            }
            options.headers = Object.assign({}, this.headers);
        }
        if(this.body){
            console.log('this.body is received NOT NULL ' + JSON.stringify(this.body));
            options.body = Object.assign({}, this.body);
        }
        //console.log(`Button pressed`);
        console.log(`Endpoint is : ${this.endpoint}`);
        let start_time = Date.now();
        options.method = this.method;
        // console.log('++++++++++++++++++');
        // console.log(JSON.stringify(options));
        // console.log('++++++++++++++++++');
        let today = new Date();
        let amORpm = today.getHours() >=0 && today.getHours() <=11 ? 'AM' : 'PM';
        let currentItem = {
            id: Math.random(1),
            ep: this.endpoint,
            value: this.endpoint.length < 25 ? this.endpoint : this.endpoint.substr(0,25) + '..',
            timestamp: `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} ${amORpm}`
        };
        fetch(this.endpoint, {
            method: this.method,
            headers : Object.assign({}, options.headers),
            body : Object.assign({}, options.body)
        })
        .then(resp =>{
            currentItem.status = resp.status;
            console.log(resp.status);
            if(resp.status !== 200) throw new Error(resp.status);
            return resp.json();
        })
        .then(data=>{
            this.timetaken = Date.now() - start_time;
            console.log(data);
            this.response = this.process(data);
            currentItem.success = true;
            currentItem.responsetime = this.timetaken;
            this.history.unshift(currentItem);
            this.history = this.processAndstylise(this.history);
        })
        .catch(error=>{
            this.timetaken = Date.now() - start_time;
            currentItem.responsetime = this.timetaken;
            console.log(`Error happened inside resp block ${error}`);
            this.response = `Error occurred with status : ${error}`;
            currentItem.success = false;
            this.history.unshift(currentItem);
            this.history = this.processAndstylise(this.history);
        });
    }
    processAndstylise(hist){
        let expectedGradientChange = (this.history.length === 0 ? 0.1 : 1/this.history.length).toFixed(2);
        //console.log('--expectedGradientChange--' + expectedGradientChange);
        for(let i=0; i<this.history.length; i++){
            let h = this.history[i];
            let alpha = (1-i*expectedGradientChange).toFixed(2);
            if(alpha > 0.9) alpha = 0.9;
            if(alpha < 0.1) alpha = 0.1;
            //console.log('--.alpha--' + alpha);
            h.style = h.success ? DEFAULT_STYLE + alpha + ")" : DEFAULT_ERROR_STYLE + alpha + ")";
        }
        return hist;
    }
    // getStyle(currentstyle, success){
    //     console.log('as received : ' + this.itemstyle);
    //     let start = currentstyle.lastIndexOf(',') + 1;
    //     let end = currentstyle.indexOf(')') - 2;
    //     let alpha = parseFloat(currentstyle.substr(start, end));
    //     //console.log('alpha->'+alpha);
    //     if(this.history.length === 0){
    //         this.alpha = (alpha + DEFAULT_GRADIENT_CHANGE).toFixed(2);
    //     }
    //     else{
    //         let expectedGradientChange = (1 - this.alpha)/this.history.length;
    //         if(expectedGradientChange > DEFAULT_GRADIENT_CHANGE) expectedGradientChange = DEFAULT_GRADIENT_CHANGE;
    //         this.alpha = (alpha + expectedGradientChange).toFixed(2);
    //     }
    //     if(this.alpha > 1) this.alpha = 1;
    //     this.itemstyle = success ? DEFAULT_STYLE + this.alpha + ")" : DEFAULT_ERROR_STYLE + this.alpha + ")";
    //     console.log('as sent back : ' + this.itemstyle);
    //     return this.itemstyle;
    // }

    handleChange(event){
        console.log(`Value input as : ${event.target.value}`);
        this.endpoint = event.target.value;
    }

    handleRequestTypeChange(event){
        console.log(`Method selected as : ${event.target.value}`);
        this.method = event.target.value;
    }

    handleLineItemClick(event){
        this.endpoint = event.target.getAttributeNode("name").value;//event.target.textContent;
        console.log('inside handleLineItemClick:' + this.endpoint);
        this.handleClick(event);
    }

    process(data){
        //console.log(JSON.stringify(data, undefined, 4));
        return JSON.stringify(data, undefined, 4);
    }

    handleAuthChange(e){
        this.auth = Object.assign({}, e.detail.authchange);
        console.log('Inside handleAuthChange->' + JSON.stringify(this.auth));
    }

    handleHeadersChange(e){
        this.headers = e.detail.headerschange;
        console.log('Inside handleHeadersChange->' + JSON.stringify(this.headers));
    }

    handleBodyChange(e){
        this.body = e.detail.bodychange;
        console.log('Inside handleBodyChange->' + JSON.stringify(this.body));
    }
}
