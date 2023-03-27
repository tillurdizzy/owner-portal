import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { IOwnerAccount, IOwnerInsert } from '../../interfaces/iunit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-owner-update',
  templateUrl: './owner-update.component.html',
  styleUrls: ['./owner-update.component.scss']
})

export class OwnerUpdateComponent {
  ownerAccount: IOwnerAccount = { email: '', name: '', cell: '', street: '', csz: ''};

  profileForm = new FormGroup({
    email: new FormControl('', Validators.required),
    cell: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    csz: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.ds.doConsole("OwnerUpdateComponent => ngOnInit()");
    this.profileForm.reset();
    let owner =  this.ds.getOwnerAccount();
    this.ownerAccount.cell = owner.cell;
    this.ownerAccount.name = owner.name;
    this.ownerAccount.email = owner.email;
    this.ownerAccount.street = owner.street;
    this.ownerAccount.csz = owner.csz;
    this.setFormValues();
  };

  setFormValues() {
    this.profileForm.setValue(this.ownerAccount);
  };

  setFormBlank() {
    this.profileForm.reset();
    this.ownerAccount = { email: '', name: '', cell: '', street: '', csz: ''};
  }

  submitBtn() {
    let f = this.profileForm.value;
    let d = new Date();
    let str = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
    let data: IOwnerInsert = { cell: f.cell, name: f.name, street: f.street, csz: f.csz, email: f.email, updated:str };
    this.ds.updateOwnerAccount(data);

  
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
