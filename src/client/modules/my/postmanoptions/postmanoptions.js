import { LightningElement, track, api } from 'lwc';
const DEFAULT_REQUEST_BODY = '{\n    "Id" : "10112"\n}'; //'{\n    "Key" : "Value"\n}'; //TESTING
const DEFAULT_REQUEST_RAW = 'some specific raw';
const ERROR_INVALID_JSON_BODY = 'The json is not well formed. Please check. Key-Value pairs must be enclosed with double quotes only.';
export default class Postmanoptions extends LightningElement {
    
    @track showAuth;
    @track showHeaders;
    @track showBody;
    @track showRaw;
    
    @track auth;
    @track authType;
    @track showBasicAuth;
    @track showOAuth2;
    @track error;


    @track uname;
    @track pwd;

    @track cId='';
    @track cCode='';
    @track cbUrl='';

    @track headers;
    @track body;

    @api method;
    @api endpoint;

    get raw(){
        console.log('I am first getter');
        let raw_text = this.method + ' ' + this.endpoint + '\n HTTP 1.1';
        let raw_request = Object.assign({}, this.auth, this.headers, JSON.parse(this.body));
        if (raw_request){
            for(let prop in raw_request){
                if (Object.prototype.hasOwnProperty.call(raw_request, prop)) {
                    raw_text = raw_text + '\n' + prop + ' - ' + raw_request[prop];
                }
            }
        }
        else{
            raw_text = DEFAULT_REQUEST_RAW;
        }
        return raw_text;
    }

    constructor(){
        super();
        console.log('I am first constructor');
        this.body = DEFAULT_REQUEST_BODY;
        this.request = {};
        this.uname='';
        this.pwd='';
    }

    handleTabMovement(e){
        if (e.key === 'Tab') {
            e.preventDefault();
            let tArea = this.template.querySelector('textarea');
            let start = tArea.selectionStart;
            let end = tArea.selectionEnd;
            console.log('start->' + start, + '  ' + 'end-> ' + end);

            // set textarea value to: text before caret + tab (i.e. 4 spaces, see below) + text after caret
            tArea.value = tArea.value.substring(0, start) + "    " + tArea.value.substring(end);
        
            // put caret at right position again
            tArea.selectionEnd = start + 4;
        }
    }

    handleAuthTypeChange(e){
        console.log('handleAuthTypeChange->' + e.target.value)
        this.authType = e.target.value;
        switch(this.authType){
            case 'NOAUTH':
                this.showBasicAuth = false;
                this.showOAuth2 = false;
                break;
            case 'BASIC':
                this.showBasicAuth = true;
                this.showOAuth2 = false;
                break;
            case 'OAUTH2':
                this.showBasicAuth = false;
                this.showOAuth2 = true;
                break;
            default:
                this.error = 'Auth must be one of the 3 available options';
                break;
        }
    }

    updateAuth(e){
        switch(this.authType){
            case 'BASIC':
                this.uname = this.template.querySelector(".authdetails input[name='uname']").value;
                this.pwd = this.template.querySelector(".authdetails input[name='pwd']").value;
                console.log(`the username is ${this.uname} and password is ${this.pwd}`);
                this.auth = Object.assign({},{
                    'uname' : this.uname,
                    'pwd' : this.pwd,
                    'type' : this.authType
                });
                break;
            case 'OAUTH2':
                this.cId = this.template.querySelector(".authdetails input[name='cId']").value;
                this.cCode = this.template.querySelector(".authdetails input[name='cCode']").value;
                console.log(`the client ID is ${this.cId} and client Code is ${this.cCode}`);
                this.auth = Object.assign({},{
                    'cId' : this.cId,
                    'cCode' : this.cCode,
                    'type' : this.authType
                });
                break;
            default:
                this.error = 'INSIDE updateAuth() : Auth must be one of the 3 available options';;
                break;
        }
        
        
        this.dispatchEvent(new CustomEvent('authchange',{
            detail:{
                'authchange' : this.auth
            }
        }));
        //this.emit('authchange', this.auth); //Can be included when LWC can support dynamic event names
    }

    handleDataTableUpdate(e){
        console.log('Inside handleDataTableUpdate' + e.detail.headers);
        this.headers = e.detail.headers;
        this.dispatchEvent(new CustomEvent('headerschange',{
            detail:{
                'headerschange' : this.headers
            }
        }));
        //this.emit('headerschange', this.headers); //Can be included when LWC can support dynamic event names
    }

    handleRequestBodyUpdate(e){
        this.body = e.target.value;
        console.log('Inside handleRequestBodyUpdate' + e.target.value);
        let body = e.target.value.replace('\n', '').replace('\t', '');
        try{
            let ev_body = JSON.parse(body);
            console.log('After serialization: ' + JSON.stringify(ev_body));
            this.dispatchEvent(new CustomEvent('bodychange',{
                detail:{
                    'bodychange' : ev_body
                }
            }));
            this.error = '';
        }
        catch(error){
            console.log('error->' + error);
            this.error = ERROR_INVALID_JSON_BODY;
        }
        //this.emit('bodychange', this.body); //Can be included when LWC can support dynamic event names
    }

    // NOT being used for now since LWC can not use event name dynamically
    // emit(eventtype, value){
    //     const custom_event = new CustomEvent(eventtype,{
    //         detail:{
    //             eventtype : value
    //         }
    //     });
    //     console.log('Event detail ->' +JSON.stringify(e.detail));
    //     this.dispatchEvent(custom_event);
    // }
    
    handleTabClick(e){
        // this.showAuth = false;
        // this.showHeaders = false;
        // this.showBody = false;
        // this.showRaw = false;

        let tabName = e.target.getAttribute('name');
        console.log('Inside handleTabClick. Tab clicked - ' + tabName);

        const tabs = this.template.querySelectorAll('.tab > .tablinks');
        //console.log('tabs->' + tabs.length);
        for(let tab of tabs){
            if(tab.getAttribute('name') === tabName){
                if(this.method === 'GET' && tabName === 'Body'){
                    alert('Body is not applicable for GET requests');
                }
                else if(tabName === 'Headers'){
                    alert('Send data as params instead of headers for now!');
                }
                else{
                    tab.classList.add('active');
                }
            }
            else{
                tab.classList.remove('active');
            }
        }
        
        switch(tabName){
            case 'Authorization':
                this.showAuth = true;
                break;
            case 'Headers':
                //this.showHeaders = true;
                break;
            case 'Body':
                if(this.method !== 'GET'){
                    this.showBody = true;
                }
                //this.body = JSON.parse(JSON.stringify(this.body));
                break;
            case 'Raw':
                this.showRaw = true;
                break;
            default:
                this.error = 'Tab must be one of the 4 available options';
                break;
        }
    }
}