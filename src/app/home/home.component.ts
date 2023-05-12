import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IUserAccount} from '../interfaces/iuser';
import { IResidentAccount } from '../interfaces/iunit';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit{

  subscription: Subscription;
  userAuthenticated:boolean = false;
  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  //residentAccounts: IResidentAccount[]=this.ds.initResidentAccount();
  unitCount:number = 0;

  formList = [];

  unitSelectorForm = new FormGroup({
    unitNum: new FormControl(''),
  });

  formSelectorForm = new FormGroup({
    form: new FormControl(''),
  });

  ngOnInit(): void {
    let storedData = this.ds.isUserAuthenticated();
    // Before LogIn these will be filled with empty "init" data
    // Auth will be false and unitCount 0
    this.userAuthenticated = storedData.auth;
    this.userAccount = storedData.account;
    this.unitCount = this.userAccount.units.length;
    this.formList = this.ds.getFormList();
  }

  getStoredData(){
    
  }

  onAccountReceived(dataPassed){
    this.userAccount = dataPassed;
    this.unitCount = this.userAccount.units.length;
  }

  resetlogIn(){
    this.userAuthenticated = false;
  }

  unitSelectorHandler(){
    let x = this.unitSelectorForm.value.unitNum;
    this.ds.setSelectedUnit(x);
    this.router.navigate(['/units']);
  }

  formSelectorHandler(){
    let x = this.formSelectorForm.value.form;
    this.ds.setSelectedForm(x);
    let navRoute = '';
    switch (x) {
      case 'Work Order': navRoute = '/forms/work-order';break;
      case 'Architectural Request': navRoute = '/forms/arch-request';break;
      case 'Crime Report': navRoute = '/forms/crime-report';break;
      case 'Violation Report': navRoute = '/forms/violation-report';break;
      case 'Message the Board': navRoute = '/forms/message-board';break;
    }
    this.router.navigate([navRoute]);
  }

  updateOwnerAccount(){
    this.router.navigate(['/forms/owner-update']);
  }

  updateUserAccount(){
    this.router.navigate(['/forms/user-update']);
  }

  

  constructor(private ds: DataService, private router: Router) {

    this.subscription = this.ds.getData().subscribe(x => {
      if(x != null){
        let dataPassed = x;
        if(dataPassed.to == 'HomeComponent'){
          console.log('Home >> receiveData >> ' + dataPassed.event);
          if(dataPassed.event == 'userAuthenticated' ){
            this.userAuthenticated = true;
          }else if(dataPassed.event == 'userAccount' ){
            this.userAccount = dataPassed.account;
            this.onAccountReceived(dataPassed.account);
          }else if(dataPassed.event == 'ownerAccount' ){
            //this.residentAccounts = dataPassed.account;
          }
        }
      }
    })

  }
}
