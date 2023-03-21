import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IUserAccount} from '../interfaces/iuser';
import { IOwnerAccount } from '../interfaces/iunit';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit{

  subscription: Subscription;
  userAuthenticated:boolean = false;
  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], userid:'' };
  ownerAccount: IOwnerAccount = { name: '', cell: '', email: '', street:'',csz:'' };
  formList = [];

  unitSelectorForm = new FormGroup({
    unitNum: new FormControl(''),
  });

  formSelectorForm = new FormGroup({
    form: new FormControl(''),
  });

  ngOnInit(): void {
    let storedData = this.ds.isUserAuthenticated();
    
    this.userAuthenticated = storedData.auth;
    this.userAccount = storedData.account;

    this.ownerAccount = this.ds.getOwnerAccount();
    this.formList = this.ds.getFormList();
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

  onEditUserAccount(){

  }

  onEditOwnerAccount(){

  }

  

  constructor(private ds: DataService, private router: Router) {

    this.subscription = this.ds.getData().subscribe(x => {
      if(x != null){
        let dataPassed = x;
        if(dataPassed.to == 'HomeComponent'){
          if(dataPassed.event == 'userAuthenticated' ){
            this.userAuthenticated = true;
          }else if(dataPassed.event == 'userAccount' ){
            this.userAccount = dataPassed.account;
          }else if(dataPassed.event == 'ownerAccount' ){
            this.ownerAccount = dataPassed.account;
          }
        }
      }
    })

  }
}
