import { LightningElement, track } from 'lwc';
//const DEFAULT_GRADIENT_CHANGE = 0.05;
const DEFAULT_STYLE = "background-color: rgba(5, 122, 218, ";
const DEFAULT_ERROR_STYLE = "background-color: rgba(255, 0, 0, ";
const DEFAULT_RESPONSE = 'Response will appear here';
const DEFAULT_ENDPOINT = 'https://login.salesforce.com/services/oauth2/token';

export default class Postman extends LightningElement {

    
    itemstyle = "background-color: rgba(5, 122, 218, 0)";
    alpha;
    copyofBody;
    showSettings;
    @track errors = {
        'body': '', // errors coming from constructing request body
        'header': ''  // error coming from constructing header
    };
    @track endpoint;
    @track allEndpoints = new Set();
    @track history;
    @track response;
    @track timetaken;
    @track method;
    @track body;
    @track headers;
    @track auth;
    @track showtooltip;
    @track endpointBeingEdited = false;
    @track showAboutMe;

    @track theme = 0; //0 = Blue, 1 = Green

    get pageContainsError(){
        return (this.errors.body !== '' || this.errors.header !== '');
    }

    showHeaderLinks(e){
        this.template.querySelector('div.headerlinks').style.display = 'block';
    }

    hideHeaderLinks(e){
        this.template.querySelector('div.headerlinks').style.display = 'none';
    }

    handleThemeChange(e){
        console.log('Theme selected : ' + e.target.value);
        this.theme = e.target.value;
        let container = this.template.querySelector('div.container');
        let postman = this.template.querySelector('div.postman');
        let history = this.template.querySelector('div.history');
        let historyItem = this.template.querySelector('div.history--item');
        let settings = this.template.querySelector('div.settings');
        let menu = this.template.querySelector('div.settings--menu');
        let menuitem = this.template.querySelector('div.settings--menuItem');
        if(this.theme === 'Green') {
            container.style.backgroundColor = 'rgba(0, 128, 128, 0.2)';
            postman.style.backgroundColor = 'rgba(0, 128, 128, 0.3)';
            history.style.backgroundColor = 'rgba(0, 128, 128, 0.9)';
            if(historyItem) historyItem.style.backgroundColor = 'rgba(0, 128, 128, 0.9)';
            settings.style.backgroundColor = 'rgba(0, 128, 128, 0.7)';
            menu.style.backgroundColor = 'rgba(0, 128, 128, 0.2)';
            menuitem.style.backgroundColor = 'rgba(0, 128, 128, 0.2)';
        }
        else if(this.theme === 'Blue'){
            container.style.backgroundColor = '#f0f8ff';
            postman.style.backgroundColor = 'rgba(0, 128, 128, 0.2)';
            history.style.backgroundColor = 'rgba(5,122,218,0.3)';
            if(historyItem) historyItem.style.backgroundColor = 'rgba(5, 122, 218, 0.3)';
            settings.style.backgroundColor = 'rgba(5,122,218,0.9)';
            menu.style.backgroundColor = 'rgba(5,122,218,0.7)';
            menuitem.style.backgroundColor = 'rgba(5,122,218,0.2)';
        }
        else if(this.theme === 'Wacky'){
            postman.style.backgroundColor = 'teal';
            //history.style.backgroundColor = 'rgba(0, 128, 128, 0.9)';
            //historyItem.style.backgroundColor = 'rgba(0, 128, 128, 0.9)';
            settings.style.backgroundColor = 'blue';
            menu.style.backgroundColor = 'yellow';
            menuitem.style.backgroundColor = 'purple';
            this.template.querySelector('div.appname').style.color = 'white';
        }
    }
    
    toggleAboutMeScreen(){
        this.showAboutMe = !this.showAboutMe;
        this.template.querySelector('div.headerlinks').style.display = 'none';
    }

    hideAboutMeScreen(){
        this.showAboutMe = false;
    }

    toggleSettingsScreen(){
        this.showSettings = !this.showSettings;
        this.template.querySelector('div.headerlinks').style.display = 'none';
    }

    hideSettingsScreen(e){
        this.showSettings = false;
    }

    showAllEndPoints(event){
        event.target.nextSibling.style.display = 'block';
        // let box = el.nextSibling;
        // console.log('And the class is->' + box.getAttributeNode('class').value);
        // let box = this.template.querySelector('#endpoints');
        // box.style.display = 'block';
        // classList.add('active')//;style.display = 'block';
        // console.log('Invoked!~');
        // this.endpointBeingEdited = true;
    }

    showInputBack(event){
        let selectedValue = event.target.textContent;
        let found = selectedValue.indexOf('-');
        let selectedEndpoint;
        let selectedMethod;
        if(found !== -1){
            this.method = selectedValue.substr(0,found).trim();
            this.endpoint = selectedValue.substr(found+1,selectedValue.length-1).trim();  
        }
        console.log('endpoint selected as : ---->' + this.endpoint);
        console.log('method selected as : ---->' + this.method);
        
        let parentDiv = this.template.querySelector('div .endpoints');
        parentDiv.style.display = 'none';
        this.endpointBeingEdited = false;
        this.template.querySelector('select.methodOptions').value = this.method;   
        
        // let el = event.target;
        // let box = el.nextSibling;
        // console.log('And the class is->' + box.getAttributeNode('class').value);
        // //let box = this.template.querySelector('#endpoints');
        // box.style.display = 'block';
        // // classList.add('active')//;style.display = 'block';
        // console.log('Invoked!~');
        // this.clicked = true;
    }

    highlightEndpoints(event){
        let el = event.target;
        el.style.backgroundColor = 'teal';
        el.style.color = 'white';
    }

    reverseHighlight(event){
        let el = event.target;
        el.style.backgroundColor = 'rgba(0, 128, 128, 0.1)';
        el.style.color = 'black';
    }

    constructor(){
        super();
        this.history = [];
        this.response = DEFAULT_RESPONSE;
        this.timetaken = '00';
        this.method = 'GET';
        this.alpha = 0;
        this.endpoint = DEFAULT_ENDPOINT;
        this.allEndpoints.add(this.generateEP('', ''));
        this.initData();
    }

    initData(){
        let allEPs = [];
        allEPs.push(this.generateEP('POST','https://login.salesforce.com/services/oauth2/token'));
        allEPs.push(this.generateEP('GET','http://0.0.0.0:3002/'));
        allEPs.push(this.generateEP('GET','https://dog.ceo/api/breeds/image/random'));
        allEPs.push(this.generateEP('GET','https://jsonplaceholder.typicode.com/posts'));
        allEPs.push(this.generateEP('GET','https://jsonplaceholder.typicode.com/posts/1'));
        allEPs.push(this.generateEP('GET','https://jsonplaceholder.typicode.com/posts/1/comments'));
        allEPs.push(this.generateEP('POST','https://jsonplaceholder.typicode.com/posts'));
        allEPs.push(this.generateEP('PUT','https://jsonplaceholder.typicode.com/posts/1'));
        allEPs.push(this.generateEP('PATCH','https://jsonplaceholder.typicode.com/posts/1'));
        allEPs.push(this.generateEP('DELETE','https://jsonplaceholder.typicode.com/posts/1'));
        this.allEndpoints = [...allEPs];
    }

    // This method generates endpoint adding a random number as label to show in dropdown
    generateEP(method = "GET", endpoint){
        return {
            'key' : this.generateId(),
            'method' : method,
            'ep' : endpoint
        }
    }

    generateId(){
        return Math.floor(Math.random(1)*100000);
    }

    handleHoverIn(e){
        //e.target.nextSibling.style.backgroundColor = e.target.style.backgroundColor;
        e.target.nextSibling.style.color = e.target.style.color;
        e.target.nextSibling.style.display = 'block';
    }

    handleHoverOut(e){
        e.target.nextSibling.style.display = 'none';
    }

    handleSubmit(){
        let isExisting = false;
        for(let ep of this.allEndpoints){
            if(ep.method === this.method && ep.endpoint === this.endpoint){
                isExisting = true;
                break;
            }
        }
        if(isExisting) this.allEndpoints.add(this.generateEP(this.method, this.endpoint));
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
                let {uname, pwd} = this.auth;
                options.uname = uname;
                options.pwd = pwd;
                options.cId = cId;
                options.cCode = cCode;
                options.type = 'OAuth 2.0';
            }
        }
        if(this.headers){
            console.log('this.headers is received NOT NULL => ' + JSON.stringify(this.headers));
            for(let each of this.headers){
                for(let key in each){
                    if(Object.prototype.hasOwnProperty.call(each, key)){
                        console.log(`Property -> ${key} AND Value -> ${each[key]}`);
                    }
                }
                
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
            id: this.generateId(),
            ep: this.endpoint,
            value: this.endpoint.length < 25 ? this.endpoint : this.endpoint.substr(0,25) + '..',
            timestamp: `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} ${amORpm}`
        };
        let fetchOptions = {
            'method' : this.method
        };
        if(this.method !== 'GET'){
            fetchOptions.headers  = Object.assign({}, options.headers);
            fetchOptions.body = Object.assign({}, options.body);
        }
        console.log('fetchoptions-> ' + JSON.stringify(fetchOptions));
        fetch(this.endpoint, fetchOptions)
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

            // Bound the alpha to reaslitic values
            if(alpha > 0.9) alpha = 0.9;
            if(alpha < 0.1) alpha = 0.1;

            h.style = h.success ? DEFAULT_STYLE + alpha + ")" : DEFAULT_ERROR_STYLE + alpha + ")";
            //console.log('--.h.style--' + h.style);
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
        if(this.method === 'GET'){
            this.copyofBody = Object.assign({}, this.body);
            this.body = undefined;
        }
        else{
            this.body = this.copyofBody;
        }
        this.template.querySelector('select.methodOptions').value = this.method;
    }

    handleLineItemClick(event){
        this.endpoint = event.target.getAttributeNode("name").value;//event.target.textContent;
        this.handleSubmit(Object.assign({}, event));
        // console.log('inside handleLineItemClick:' + this.endpoint);
        // let successfulRequest = event.target.getAttributeNode("success").value;
        // console.log('%cinside handleLineItemClick successfulRequest :' + successfulRequest, '{color: red}');
        // if(successfulRequest === 'true'){
        //     this.handleClick(event);
        // }
    }

    process(data){
        // Formats the json key-value separated by 4 spaces as indent. 
        // @params 
        // json data, replacer, blankspaceCount
        
        return JSON.stringify(data, undefined, 4);
    }

    handleAuthChange(e){
        this.auth = Object.assign({}, e.detail.authchange);
        console.log('Inside handleAuthChange->' + JSON.stringify(this.auth));
        // Also update the body with the auth parameters
        if(this.auth.type === 'OAUTH2' || this.auth.type === 'BASIC'){
            let body = {};
            body.username = this.auth.uname;
            body.password = this.auth.pwd;
            if(this.auth.type === 'OAUTH2'){
                body.grant_type = this.auth.grantType;
                body.consumerId = this.auth.cId;
                body.consumerKey = this.auth.cCode;
            }
            this.body = body;
        }
    }

    handleHeadersChange(e){
        this.headers = e.detail.headerschange;
        console.log('Inside handleHeadersChange->' + JSON.stringify(this.headers));
    }

    handleBodyChange(e){
        if(e.detail.error){
            this.errors.body += e.detail.error;
        }
        else{
            this.errors.body = '';
            this.body = e.detail.bodychange;
        }
        console.log('Inside handleBodyChange->' + JSON.stringify(this.body));
    }
}