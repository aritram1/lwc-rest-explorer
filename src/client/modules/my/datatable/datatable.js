import { LightningElement, track  } from 'lwc';

export default class DataTable extends LightningElement {
    
    @track allHeaders = [];
    //@track contentType = 'application/json';
    // @track processedHeaders = [];
    
    constructor(){
        super();
        this.allHeaders.push({
            'id' : this.generateId(),
            'k' : 'content-type',
            'v' : 'application/json'
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
            console.log('' + JSON.stringify(h));
            let key = h.k;
            let value = h.v;
            processedHeaders.push({
                [key]: value
            });
        }
        return processedHeaders;
    }

    updateHeaders(e){
        let n = e.target.getAttribute('name');
        let v = e.target.value;
        console.log('Generated from ' + n);
        //TBD
        // if(n === 'key'){
            
        // }
        // else if(n == 'value'){
        //     this.allHeaders[]
        // }

        const ev = new CustomEvent('headerchanged', {
            detail: {
                'headers' : this.process(this.allHeaders)
            }
        });
        console.log('headerchanged Emitted =>'  + JSON.stringify(ev.detail));
        this.dispatchEvent(ev);
    }

    // handleContentTypeChange(e){
    //     this.contentType = e.target.value;
    //     console.log('Content type received as ' + e.target.value + ' and got changed to : ' + this.contentType);  
    // }

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