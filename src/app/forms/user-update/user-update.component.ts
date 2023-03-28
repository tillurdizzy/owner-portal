import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { DataService } from 'src/app/services/data.service';
import { IUserUpdate, IUserAccount } from 'src/app/interfaces/iuser';


@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent {

  userAccount: IUserUpdate = { email: '', username: '', cell: ''};
  userID:string;

  accountForm = new FormGroup({
    email: new FormControl('', Validators.required),
    cell: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.ds.doConsole("UserUpdateComponent => ngOnInit()");
    this.accountForm.reset();
    let user =  this.ds.getUserAccount();
    this.userID = user.userid;
    this.userAccount.cell = user.cell;
    this.userAccount.username = user.username;
    this.userAccount.email = user.email;
    this.setFormValues();
  };

  setFormValues() {
    this.accountForm.setValue(this.userAccount);
  };

  setFormBlank() {
    this.accountForm.reset();
    this.userAccount = { email: '', username: '', cell: ''};
  }

  submitBtn() {
    let f = this.accountForm.value;
    //let d = new Date();
    //et str = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
    let data: IUserUpdate = { cell: f.cell, username: f.username, email: f.email };
    this.ds.updateUserAccount(data);
    this.supabase.updateUserAccount(data, this.userID);
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
    return this.accountForm.controls[control].hasError(error);
  }

  constructor(private router: Router, private ds: DataService,
    private supabase: SupabaseService) {}
}
