import { LightningElement, track, api } from 'lwc';

export default class Postmanoptions extends LightningElement {
    
    @track showAuth;
    @track showHeaders;
    @track showBody;
    

    @track auth;
    @track headers;
    @track body;

    @api method;

    constructor(){
        super();

        // Get all elements with class="tabcontent" and hide them
        let tabcontent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        let tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    }

    connectedCallback(){
        this.body = '';
    }

    handleAuthTypeTypeChange(e){
        this.auth = e.target.value;
        console.log('handleAuthTypeTypeChange->' + this.auth);
    }

    handleDataTableUpdate(e){
        this.headers = e.detail.headers;
        console.log('Inside handleDataTableUpdate' + this.headers);

    }

    handleRequestBodyUpdate(e){
        this.body = e.target.value;
        console.log('Inside handleRequestBodyUpdate ->' + this.body);
        const event_RequestBodyUpdate = new CustomEvent('requestbody',{
                detail:{
                    requestbody : this.body
                }
            }
        );
        this.dispatchEvent(event_RequestBodyUpdate);
    }
    
    handleTabClick(e){
        this.showAuth = false;
        this.showHeaders = false;
        this.showBody = false;

        let tabName = e.target.getAttribute('name');
        console.log('Inside handleTabClick. Tab clicked - ' + tabName);
        switch(tabName){
            case 'Authorization':
                this.showAuth = true;
                break;
            case 'Headers':
                this.showHeaders = true;
                break;
            case 'Body':
                this.showBody = true;
                break;
        }
    }
}