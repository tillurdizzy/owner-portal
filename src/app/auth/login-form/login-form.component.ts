import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { IData } from '../../interfaces/idata';
import { Globals } from '../../interfaces/globals';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  dataObj = {} as IData;

  myForm = new FormGroup({
    ownerEmail: new FormControl<string>('tillurdizzy@live.com', [Validators.required,Validators.email,]),
    ownerPassword: new FormControl<string>('wstadmin', Validators.required),
  });

  

  ngOnInit() {}

  submitBtn() {
    this.ds.doConsole('Home/LoginFormComponent: submitBtn()');
    var e = this.myForm.value.ownerEmail.trim();
    var p = this.myForm.value.ownerPassword.trim();
    //let obj = {email: e,password: p};
    let obj = {email: 'tillurdizzy@live.com',password: 'wstadmin'};
    try {
      this.supabase.logIn(obj);
    } catch (error) {
      alert(error.message)
    }finally{
      this.myForm.reset();
    }
  };

  public handleError = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };

  constructor(
    private router: Router,
    private ds: DataService,
    private supabase: SupabaseService,
    private g: Globals
  ) {}
}
