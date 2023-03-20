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


  unitSelectorForm = new FormGroup({
    unitNum: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    let dataPassed = this.ds.isUserAuthenticated();
    this.userAuthenticated = dataPassed.auth;
    this.userAccount = dataPassed.account;
    this.ownerAccount = this.ds.getOwnerAccount();
  }

  unitSelectorHandler(){
    let x = this.unitSelectorForm.value.unitNum;
    this.ds.setSelectedUnit(x);
    this.router.navigate(['/units']);
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
