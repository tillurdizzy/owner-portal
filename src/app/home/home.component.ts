import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  subscription: Subscription;
  userAuthenticated:boolean = false;
  userDBA:string;
  userName:string;
  userUnitList:[] = [];

  unitClickHandler(n){

  }

  constructor(private ds: DataService) {

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
