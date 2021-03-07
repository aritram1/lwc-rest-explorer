import { LightningElement, track, api } from 'lwc';


export default class Postman extends LightningElement {
    endpoint = 'http://0.0.0.0:3002'; //''https://jsonplaceholder.typicode.com/posts/'; //'http://localhost:3002/'; //'
    @track history=[];
    @track response = 'Default response';
    @track timetaken = '00';
    @track method = 'GET';

    handleClick(event){
        console.log(`Button pressed`);
        //console.log(`Node retrieved : ${document.querySelector('.top--ibar')}`);
        //this.endpoint = document.querySelector('.top--ibar').value;
        console.log(`Endpoint is : ${this.endpoint}`);
        let start_time = Date.now();
        fetch(this.endpoint, {method : this.method, headers: { 'Content-Type': 'application/json'}, mode: 'no-cors'})
        .then(resp =>{
            console.log(resp.status);
            if(resp.status != 200) throw new Error(resp.status);
            return resp.json();
        })
        .then(data=>{
            console.log(data);
            this.response = JSON.stringify(data, undefined, 4);
            this.history.unshift({
                id: Math.random(1),
                value: this.endpoint,
                success: true
            });
            this.timetaken = Date.now() - start_time;
        })
        .catch(error=>{
            console.log(`Error happened inside resp block ${error}`);
            this.response = `Error occurred with status : ${error}`;
            this.history.unshift({
                id: Math.random(1),
                value: this.endpoint,
                success: false
            });
            this.timetaken = Date.now() - start_time;
        });
    }
    
    handleChange(event){
        console.log(`Value input as : ${event.target.value}`);
        this.endpoint = event.target.value; //TBD
    }

    handleRequestTypeChange(event){
        console.log(`Method selected as : ${event.target.value}`);
        this.method = event.target.value;
    }

    //TBD
    handleLineItemClick(event){
        this.endpoint = event.target.value;
        console.log('inside handleLineItemClick:' + this.endpoint);
        this.handleClick(event);
    }
}
