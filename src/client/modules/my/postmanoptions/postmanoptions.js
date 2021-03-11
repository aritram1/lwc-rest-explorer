import { LightningElement, track, api } from 'lwc';
const DEFAULT_REQUEST_BODY = '{\n \'param\' : \'value\' \n}';
const DEFAULT_REQUEST_RAW = 'some specific raw';
export default class Postmanoptions extends LightningElement {
    
    @track showAuth;
    @track showHeaders;
    @track showBody;
    @track showRaw;
    
    @track auth;
    @track showBasicAuth;
    @track showOAuth2;
    get showAuthDetails(){
        return this.showBasicAuth || this.showOAuth2;
    }


    @track uname;
    @track pwd;

    @track headers;
    @track body;
    @track request;
    get raw(){
        console.log('I am first getter');
        if (this.request){
            return JSON.stringify(Object.assign({'method' : this.method}, this.request));
        }
        else{
            return DEFAULT_REQUEST_RAW;
        }
    }

    @api method;

    constructor(){
        super();
        console.log('I am first constructor');
        this.body = DEFAULT_REQUEST_BODY;
        this.request = {};
        this.uname='';
        this.pwd='';
    }

    handleAuthTypeChange(e){
        console.log('handleAuthTypeChange->' + e.target.value)
        this.auth = e.target.value;

        switch(this.auth){
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
        }
    }

    updateAuth(e){
        //let inputs = this.template.querySelectorAll(".authdetails input[type='text']");
        this.uname = this.template.querySelector(".authdetails input[name='uname']").value;
        this.pwd = this.template.querySelector(".authdetails input[name='pwd']").value;
        console.log(`the username is ${this.uname} and password is ${this.pwd}`);
        this.auth = {
            'username' : this.uname,
            'password' : this.pwd
        }
        this.emit('authchange', this.auth);
    }

    handleDataTableUpdate(e){
        console.log('Inside handleDataTableUpdate' + e.detail.headers);
        this.headers = e.detail.headers;
        this.emit('headerschange', this.headers);
    }

    handleRequestBodyUpdate(e){
        console.log('Inside handleRequestBodyUpdate' + e.target.value);
        this.body = e.target.value;
        this.emit('bodychange', this.body);
    }

    emit(eventtype, value){
        const custom_event = new CustomEvent(eventtype,{
            detail:{
                eventtype : value
            }
        });
        this.dispatchEvent(custom_event);
    }
    
    handleTabClick(e){
        this.showAuth = false;
        this.showHeaders = false;
        this.showBody = false;
        this.showRaw = false;

        let tabName = e.target.getAttribute('name');
        console.log('Inside handleTabClick. Tab clicked - ' + tabName);

        const tabs = this.template.querySelectorAll('.tab > .tablinks');
        //console.log('tabs->' + tabs.length);
        for(let tab of tabs){
            //console.log('ALL TABS');
            //console.log('HERE->' + tab.getAttribute('name'));
            if(tab.getAttribute('name') == tabName){
                tab.classList.add('active');
            }
            else{
                tab.classList.remove('active');
            }
        }

        switch(tabName){
            case 'Authorization':
                this.showAuth = true;
                e.target.classl
                break;
            case 'Headers':
                this.showHeaders = true;
                break;
            case 'Body':
                if(this.method != 'GET') this.showBody = true;
                break;
            case 'Raw':
                this.showRaw = true;
                break;
        }
    }
}


// tabClick(e){
    //     const allTabs = document.querySelectorAll('ul>li');
    //     allTabs.forEach( (elm, idx) =>{
    //         console.log(elm);
    //         elm.classList.remove("slds-is-active")
    //     })
    //     e.currentTarget.classList.add('slds-is-active')
    // }