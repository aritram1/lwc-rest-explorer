import { LightningElement, track  } from 'lwc';

export default class DataTable extends LightningElement {
    @track contentType = '';
    @track headers = [];
    
    constructor(){
        super();
        this.contentType = 'application/json';
    }

    handleContentTypeChange(e){
        console.log('Content type got changed to : ' + e.target.value);
        // this.dispatchEvent(
        //     new CustomEvent('headerChanged', {
        //         detail: {
        //             'headers' : this.headers
        //         }
        //     })
        // );
    }
}