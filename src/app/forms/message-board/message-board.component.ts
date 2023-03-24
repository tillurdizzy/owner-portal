import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router'
import { IUserAccount } from '../../interfaces/iuser';
import { IOwnerAccount } from '../../interfaces/iunit';
import { IWorkOrder } from 'src/app/interfaces/iforms';

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.scss']
})
export class MessageBoardComponent {
  me = 'MessageBoardComponent';

  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], userid:'' };
  ownerAccount: IOwnerAccount = { name: '', cell: '', email: '', street:'',csz:'' };
  workOrder: IWorkOrder = {unit:0, cell:'', name:'', email:'',category:'',photo:'',description:''}
  categories = ['Building-General','Building-Roof','Lighting/Electrical','Landscape','Plumbing','Pests','Parking/Driveways','Walkways/Patio','Other'];

  myForm = new FormGroup({
    unitNum: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  submitBtn() {
    let form = this.myForm.value;
    this.workOrder.unit = parseInt(form.unitNum);
    this.workOrder.cell = this.userAccount.cell;
    this.workOrder.email =  this.userAccount.email;
    this.workOrder.name = this.userAccount.username;
    this.workOrder.category = form.category;
    this.workOrder.description = form.description;
    
    this.supabase.insertWorkOrder(this.workOrder);
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


  constructor(private supabase: SupabaseService, private router: Router, 
    private ds: DataService ) {}

}
