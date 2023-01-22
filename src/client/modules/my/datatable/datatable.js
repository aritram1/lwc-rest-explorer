import { LightningElement, track  } from 'lwc';

export default class DataTable extends LightningElement {
    
    @track allHeaders = [];
    
    constructor(){
        super();
        this.allHeaders.push({
            'id' : this.generateId(),
            'k' : 'content-type',
            'v' : 'application/json | application/x-www-form-urlencoded'
        });
    }

    connectedCallback(){
        const ev = new CustomEvent('headerchanged', {
            detail: {
                'headers' : this.process(this.allHeaders)
            }
        });
        console.log('headerchanged Emitted =>'  + JSON.stringify(ev.detail));
        this.dispatchEvent(ev);
    }

    process(allHeaders){
        let processedHeaders = [];
        for(let h of allHeaders){
            //console.log('' + JSON.stringify(h));
            if(h.id && h.k){
                let key = h.k;
                let value = h.v;
                processedHeaders.push({
                    [key]: value
                });
            }
        }
        return processedHeaders;
    }

    updateHeaders(e){
        let n = e.target.getAttribute('name');
        let v = e.target.value;
        let headerId = parseInt(e.target.getAttribute('headerid'));
        let currentHeaderItem;

        console.log(`Inside Update header. element name = ${n}, value received = ${v} and header Id is ${headerId}`);
        
        for(let i=0; i<this.allHeaders.length; i++){
            if(this.allHeaders[i].id === headerId){
                console.log('Matched for : ' + this.allHeaders[i].id);
                currentHeaderItem = this.allHeaders[i];
                break;
            }
        }

        if(n === 'key'){
            console.log('Coming from key block');
            currentHeaderItem.k = v;
            console.log('current header item : ' + JSON.stringify(currentHeaderItem));
        }
        else if(n === 'value'){
            console.log('Coming from value block');
            currentHeaderItem.v = v;
            console.log('current header item : ' + JSON.stringify(currentHeaderItem));
        }

        // Emit in a headerchanged Event so parent component can get the header data
        const ev = new CustomEvent('headerchange', {
            detail: this.process(this.allHeaders)
        });
        console.log('headerchanged Emitted =>'  + JSON.stringify(ev.detail));
        this.dispatchEvent(ev);
    }

    addHeaderPair(e){
        if(this.allHeaders){
            this.allHeaders.push({
                'id' : this.generateId(),
                'k' : '',
                'v' : ''
            });
        }
    }

    generateId(){
        return Math.floor(Math.random(1)*100000);
    }
}