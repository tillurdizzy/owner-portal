import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { DataService } from '../../services/data.service';
import { IData } from '../../interfaces/idata';
import { Globals } from '../../interfaces/globals';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

export class LoginFormComponent implements OnInit{

  dataObj = {} as IData;
  userType:string | null = null;

  myForm = new FormGroup({
    ownerEmail: new FormControl<string>('',[Validators.required,Validators.email]),
    ownerPassword: new FormControl<string>('',Validators.required)
  });

  ngOnInit(){
   
    this.userType = 'owner';
    this.ds.setUserType(this.userType)
    this.ds.doConsole("Auth/LoginFormComponent: ngOnInit() userType= " + this.userType)
  };

  submitBtn(){
    this.ds.doConsole("Auth/LoginFormComponent: submitBtn()")
    var e = this.myForm.value.ownerEmail
    var p = this.myForm.value.ownerPassword;
    var u = this.userType;
    this.dataObj = {email: e, password: p, event:'submit', from:this.g.AUTH_COMPONENT, other:u as string, to:this.g.LOGIN_COMPONENT, unit:null}
    this.ds.sendData(this.dataObj);
  };

  public handleError = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };


  constructor(private router: Router, private ds: DataService,private g:Globals) {}
}

