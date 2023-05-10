import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { IResidentAccount, IResidentInsert } from '../../interfaces/iunit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-owner-update',
  templateUrl: './owner-update.component.html',
  styleUrls: ['./owner-update.component.scss']
})

export class OwnerUpdateComponent {
  residentAccount: IResidentAccount[]= this.ds.initResidentAccount();

  profileForm = new FormGroup({
    email: new FormControl('', Validators.required),
    cell: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.ds.doConsole("OwnerUpdateComponent => ngOnInit()");
    this.profileForm.reset();
    let owner =  this.ds.getOwnerAccount();
    /* this.residentAccount[0].firstname = owner.firstname;
    this.residentAccount[0].lastname = owner.lastname;
    this.residentAccount[0].email = owner.email; */
    this.setFormValues();
  };

  setFormValues() {
    this.profileForm.setValue(this.residentAccount[0]);
  };

  setFormBlank() {
    this.profileForm.reset();
    this.residentAccount =  [{ firstname:'', lastname:'', cell: '', email: '',uuid:'', id:0, alerts:''}];
  }

  submitBtn() {
    let f = this.profileForm.value;
    let d = new Date();
    let str = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
    let data: IResidentInsert = { cell: f.cell, firstname: f.firstname, lastname: f.lastname, email: f.email };
    //this.ds.updateOwnerAccount(data);

  
    let units = this.ds.ownerUnitsList;
    this.supabase.updateOwnerAccount(data, units);
  };

  // <<<<<<<<<<   HELPERS  <<<<<<<<<<

  removeNull(obj) {
    Object.keys(obj).forEach(k => {
      if (obj[k] === null || obj[k] === undefined) {
        obj[k] = '';
      }
    });
    return obj;
  };

  ngOnDestroy() {
    
  }

 
  public handleError = (control: string, error: string) => {
    return this.profileForm.controls[control].hasError(error);
  }

  constructor(private router: Router, private ds: DataService,
    private supabase: SupabaseService) {}

}
