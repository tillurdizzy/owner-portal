import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { IUserAccount } from '../../interfaces/iuser';
import { IResidentAccount } from '../../interfaces/iunit';
import { IWorkOrder } from 'src/app/interfaces/iforms';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss']
})
export class WorkOrderComponent implements OnInit{

  me = 'WorkOrderComponent';
  supaScription: Subscription;
  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'',firstname:'',lastname:'',csz:'',street:'',alerts:''};
  ownerAccount: IResidentAccount[]= this.ds.initResidentAccount();
  unitNum = this.ds.currentUnit;
  workOrder: IWorkOrder = {unit:this.unitNum, cell:'', name:'', email:'',category:'',photo:'',description:''}
  categories = ['Building-General','Building-Roof','Lighting/Electrical','Landscape','Plumbing','Pests','Parking/Driveways','Walkways/Patio','Other'];
 

  ngOnInit(): void {
    this.myForm.reset(); 
    let storedData = this.ds.isUserAuthenticated();
    this.userAccount = storedData.account;
  }


  myForm = new FormGroup({
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  submitBtn() {
    let form = this.myForm.value;
    this.workOrder.cell = this.userAccount.cell;
    this.workOrder.email =  this.userAccount.email;
    this.workOrder.name = this.userAccount.firstname + " " + this.userAccount.lastname;
    this.workOrder.category = form.category;
    this.workOrder.description = form.description;
    
    this.supabase.insertWorkOrder(this.workOrder);
  }

/*   unitSelectionHandler(){
    let x = this.myForm.value.unitNum;
  } */

  catSelectionHandler(){
    let x = this.myForm.value.category;
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
