import { LightningElement, track, api } from 'lwc';


export default class Postman extends LightningElement {
    endpoint = 'https://dog.ceo/api/breeds/image/random';//'http://0.0.0.0:3002'; //''https://jsonplaceholder.typicode.com/posts/';
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
        fetch(this.endpoint, {
            method : this.method, 
            // headers: {'Content-Type': 'application/json'},
            // mode: 'no-cors'
        })
        .then(resp =>{
            console.log(resp.status);
            if(resp.status != 200) throw new Error(resp.status);
            return resp.json();
        })
        .then(data=>{
            console.log(data);
            this.response = JSON.stringify(data);
            this.history.unshift({
                id: Math.random(1),
                ep: this.endpoint,
                value: this.endpoint.length < 30 ? this.endpoint : this.endpoint.substr(0,30) + '....',
                success: true
            });
            this.timetaken = Date.now() - start_time;
        })
        .catch(error=>{
            console.log(`Error happened inside resp block ${error}`);
            this.response = `Error occurred with status : ${error}`;
            this.history.unshift({
                id: Math.random(1),
                ep: this.endpoint,
                value: this.endpoint.length < 30 ? this.endpoint : this.endpoint.substr(0,30) + '....',
                success: false
            });
            this.timetaken = Date.now() - start_time;
        });
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
        this.endpoint = event.target.textContent;
        console.log('inside handleLineItemClick:' + this.endpoint);
        this.handleClick(event);
    }
}
