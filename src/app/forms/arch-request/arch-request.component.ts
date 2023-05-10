import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { IUserAccount } from '../../interfaces/iuser';
import { IResidentAccount } from '../../interfaces/iunit';
import { IBasicForm } from 'src/app/interfaces/iforms';

@Component({
  selector: 'app-arch-request',
  templateUrl: './arch-request.component.html',
  styleUrls: ['./arch-request.component.scss']
})
export class ArchRequestComponent {

  me = 'ArchRequestComponent';
  supaScription: Subscription;
  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  ownerAccount: IResidentAccount[]= [{ firstname:'', lastname:'', cell: '', email: '',uuid:'', id:0, alerts:''}];

  locations = ['Front','Garage/carport','Balcony','Roof','Patio','Back','Side','Other'];

  formData: IBasicForm = {userid:'', date:'',location:'',cell:'', name:'', email:'',category:'',photo:'',type:'',text:''}
 

  myForm = new FormGroup({
    unitNum: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  submitBtn() {
    let form = this.myForm.value;
    this.formData.type = 'crime'
    this.formData.userid = this.userAccount.uuid;
    this.formData.cell = this.userAccount.cell;
    this.formData.email =  this.userAccount.email;
    this.formData.name = this.userAccount.username;
    this.formData.text = form.description;
    this.formData.location = form.location;
    this.formData.category = form.category;
    
    this.supabase.insertBasicForm(this.formData,'Request Submitted');
  }

  unitSelectionHandler(){
    let x = this.myForm.value.unitNum;
  }

  catSelectionHandler(){
    let x = this.myForm.value.category;
  }


  ngOnInit(): void {
    this.myForm.reset(); 
    let storedData = this.ds.isUserAuthenticated();
    this.userAccount = storedData.account;
    this.ownerAccount = this.ds.getOwnerAccount();
  }

  public handleError = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };

  ngOnDestroy(): void {
    this.supaScription.unsubscribe();
  }

  constructor(private supabase: SupabaseService, private router: Router, 
    private ds: DataService ) {

    this.supaScription = this.supabase.getData().subscribe(x => {
      if(x != null){
        var dataPassed = x;
        if(dataPassed.to == this.me){
          if(dataPassed.event == 'fx' ){
           
          }else if(dataPassed.event == 'x' ){
            
          }else if(dataPassed.event == 'xx' ){
            //this.set
          }else if(dataPassed.event == 'xx' ){
            //this.set
          }
        }
      }
    })
  }

}
