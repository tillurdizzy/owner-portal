import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit{

  subscription: Subscription;
  userAuthenticated:boolean = false;
  userDBA:string;
  userName:string;
  userUnitList:[] = [];

  unitSelectorForm = new FormGroup({
    unitNum: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    let dataPassed = this.ds.isUserAuthenticated();
    this.userAuthenticated = dataPassed.auth;
    this.userUnitList = dataPassed.unitList;
    this.userDBA = dataPassed.dba;
    this.userName = dataPassed.name;
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
          }else if(dataPassed.event == 'userUnitList' ){
            this.userUnitList = dataPassed.unitList;
            this.userDBA = dataPassed.dba;
            this.userName = dataPassed.name;
          }
        }
      }
    })

  }
}
