import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { Subject , Subscription} from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';
import { IUserAccount} from '../interfaces/iuser';
import { IProfile } from '../interfaces/iprofile';
import { IVehicle } from '../interfaces/ivehicle';
import { Globals } from '../interfaces/globals';

@Injectable({
  providedIn: "root",
})

export class DataService {

  private userid: string | null = null;
  private session:{} = {};
  private currentUser:{} = {};
  supaScription: Subscription;

  private userAuthenticated: boolean = false;

  private userAccount: IUserAccount = { username: '', role: '', cell: '', email: '', dba: '', units: [], street:'',csz:'', userid:'' };
  private myCurrentUnit: number;
  private myVehicles: IVehicle[];

   //* >>>>>>>>>>>>>> MESSENGER <<<<<<<<<<<<<<<<

  private subject = new Subject<any>();

  public sendData(message: any) {
    console.log(this.g.DATA_SERVICE + " > sendData > message = " + JSON.stringify(message));
    this.subject.next(message);
  };

  clearData() {
    this.subject.next(null);
  };

  getData(): Observable<any> {
    return this.subject.asObservable();
  };

  //* >>>>>>>>>>>>>>> UTILITIES <<<<<<<<<<<<<<<<<<<<

  removeNull(obj) {
    Object.keys(obj).forEach(k => {
      if (obj[k] === null || obj[k] === undefined) {
        obj[k] = '';
      }
    });
    return obj;
  };


  doConsole(message: string) {
    console.log(message);
  };

  //* >>>>>>>>>>>>>>>>>> SET <<<<<<<<<<<<<<<<<<<<<<<<<<<

 
  

 
  
 

  

  //* >>>>>>>>>>>> GETTERS / SETTERS <<<<<<<<<<<<

  isUserAuthenticated() {
    let obj = {
      'auth': this.userAuthenticated, 
      'unitList':this.userAccount.units,
      'dba':this.userAccount.dba,
      'name':this.userAccount.username}
    return obj;
  };

  setSelectedUnit(u:string){
    this.myCurrentUnit = parseInt(u)
  }

 get currentUnit(){
  return this.myCurrentUnit;
 }

 //* >>>>>>>>>> SUPASCRIPTION HANDLERS >>>>>>>>>> \\

 private authenticateUser(data: any) {
  this.userAuthenticated = true;
  this.currentUser = data.user;
  this.session = data.session;

  let dataObj = {to: 'HomeComponent',event: 'userAuthenticated'};
  this.sendData(dataObj);
};

private setUserAccount(data:any) {
  let x = data[0]
  this.userAccount.cell = x.cell;
  this.userAccount.csz = x.csz;
  this.userAccount.dba = x.dba;
  this.userAccount.email = x.email;
  this.userAccount.street = x.street;
  this.userAccount.userid = x.userid;
  this.userAccount.username = x.username;
  this.userAccount.role = x.role;
  this.userAccount.units = x.units.units;

  let dataObj = {
    to: 'HomeComponent',
    event: 'userUnitList',
    unitList:[] = this.userAccount.units,
    dba:this.userAccount.dba,
    name:this.userAccount.username
  };
  this.sendData(dataObj);
  console.log(this.g.DATA_SERVICE + " > setUserAccount()" + JSON.stringify(this.userAccount));
};


//* >>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<

  constructor(private g: Globals, private supabase:SupabaseService) {
    this.doConsole('DataService > constructor()')
    this.supaScription = this.supabase.getData().subscribe(x => {
      if(x != null){
        var dataPassed = x;
        if(dataPassed.to == 'DataService'){
          if(dataPassed.event == 'userAuthenticated' ){
            this.authenticateUser(dataPassed.result)
          }else if(dataPassed.event == 'getUserAccount' ){
           this.setUserAccount(dataPassed.result)
          }
        }
      }
    })
  }
};