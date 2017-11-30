import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    objects = [];
    thing: any;
    foo = 0;
    total = 0;
    private todo : FormGroup;
	object = {
        id: 0,
		name: String,
        value: 0,
	}
    
    constructor(public navCtrl: NavController,  public storage: Storage, public navParams: NavParams,
                private formBuilder: FormBuilder, public toastCtrl: ToastController,) {
        this.thing = navParams.get('')
        this.pushObjects()
        this.todo = this.formBuilder.group({
			name: ['', Validators.required],
            value: [0, Validators.required],
		});
    }
    
    pushObjects(){ //push all objects
        this.foo = 0;
        this.total = 0;
		this.objects =[];
		this.storage.keys().then((key) => {
			for (let i of key){
				this.storage.get(i).then((val) => {
					let jsval = JSON.parse(val);
				    this.objects.push(jsval);
                    this.foo= +jsval.value;
                    this.total = this.total + this.foo;
					
				})
			}
		})

		console.log(this.objects);
	}

    limpia() { //clean storage
        this.storage.clear()
        this.pushObjects()
    }
    
    doRefresh(refresher) {
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            console.log('Async operation has ended');
        refresher.complete();
        }, 1000);
        
        this.pushObjects()
    }
    
    save() { //save a new product in storage
        this.object.name = this.todo.get('name').value;
        this.object.value = 0;
        
        
        this.storage.length().then((val) =>{
			let key = val + 1;
            this.object.id = key;
			let values = JSON.stringify(this.object, null);
			this.storage.set(key.toString(), values);
		  })
        
        let toast = this.toastCtrl.create({
            message: 'Success',
            duration: 2000,
            position: 'middle',
            dismissOnPageChange: false,
            cssClass: "toast",
        });        
        
        toast.present();  
        
    }
    
    saveCard(p){ //save a new price of a product 
        let valor = this.todo.get('value').value;
        console.log("p:", p.id)
        console.log("valor", valor)
        
        this.storage.get(p.id).then((complaintsDatas) => {
            console.log("data", complaintsDatas)
            if (complaintsDatas) {
                let complaints = JSON.parse(complaintsDatas);
                console.log("complaints", complaints.id)
                console.log("p id:", p.id)
                if(complaints.id == p.id){
                    console.log('append', valor);
                    complaints.value = valor;
                    let newData = JSON.stringify(complaints);
                    this.storage.set(p.id, newData);
                }
            }
        });
        this.pushObjects()
    }
}
