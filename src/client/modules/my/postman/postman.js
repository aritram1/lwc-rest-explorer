import { LightningElement, track, api } from 'lwc';
const DEFAULT_GRADIENT_CHANGE = 0.09;
const DEFAULT_STYLE = "background-color: rgba(5, 122, 218, ";
const DEFAULT_ERROR_STYLE = "background-color: rgba(255, 0, 0, ";
const DEFAULT_RESPONSE = 'Response will appear here';

export default class Postman extends LightningElement {

    endpoint = 'http://0.0.0.0:3002/post';//'https://dog.ceo/api/breeds/image/random';//''https://jsonplaceholder.typicode.com/posts/';
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
        this.method = 'POST';
        this.alpha = 0;
    }

    handleHoverIn(e){
        this.showtooltip = true;
    }
    handleHoverOut(e){
        this.showtooltip = false;
    }

    handleClick(event){
        console.log('Auth received as : ' + JSON.stringify(this.auth));
        console.log('Body received as : ' + JSON.stringify(this.body));
        console.log('Headers received as : ' + JSON.stringify(this.headers));
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
        console.log('++++++++++++++++++');
        console.log(JSON.stringify(options));
        console.log('++++++++++++++++++');
        fetch(this.endpoint, {
            method: this.method,
            headers : options.headers,
            body : JSON.stringify(options.body)
        })
        .then(resp =>{
            console.log(resp.status);
            if(resp.status !== 200) throw new Error(resp.status);
            return resp.json();
        })
        .then(data=>{
            console.log(data);
            //this.response = JSON.stringify(data);
            this.response = this.process(data);
            
            this.timetaken = Date.now() - start_time;
            
            this.history.unshift({
                id: Math.random(1),
                ep: this.endpoint,
                value: this.endpoint.length < 30 ? this.endpoint : this.endpoint.substr(0,30) + '....',
                success: true,
                responsetime: Date.now() - start_time,
                style : this.getStyle(this.itemstyle,true)
            });

        })
        .catch(error=>{
            console.log(`Error happened inside resp block ${error}`);
            this.response = `Error occurred with status : ${error}`;
            this.history.unshift({
                id: Math.random(1),
                ep: this.endpoint,
                value: this.endpoint.length < 30 ? this.endpoint : this.endpoint.substr(0,30) + '....',
                success: false,
                responsetime: Date.now() - start_time,
                style : this.getStyle(this.itemstyle, false)
            });
            this.timetaken = Date.now() - start_time;
        });
    }
    
    getStyle(currentstyle, success){
        //console.log('as received : ' + this.itemstyle);
        let start = currentstyle.lastIndexOf(',') + 1;
        let end = currentstyle.indexOf(')') - 2;
        let alpha = parseFloat(currentstyle.substr(start, end));
        //console.log('alpha->'+alpha);
        this.alpha = (alpha + DEFAULT_GRADIENT_CHANGE).toFixed(2);
        if(this.alpha > 1) this.alpha = 1;
        this.itemstyle = success ? DEFAULT_STYLE + this.alpha + ")" : DEFAULT_ERROR_STYLE + this.alpha + ")";
        //console.log('as sent back : ' + this.itemstyle);
        return this.itemstyle;
    }

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
        console.log(JSON.stringify(data, undefined, 4));
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
