import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { Subject , Subscription} from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';
import { IUserAccount} from '../interfaces/iuser';
import { IProfile } from '../interfaces/iprofile';
import { IVehicle } from '../interfaces/ivehicle';
import { Globals } from '../interfaces/globals';
import { IOwnerAccount } from '../interfaces/iunit';

@Injectable({
  providedIn: "root",
})

export class DataService {

  private userid: string | null = null;
  private session:{} = {};
  private currentUser:{} = {};
  supaScription: Subscription;

  private userAuthenticated: boolean = false;

  private userAccount: IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], userid:'' };
  private ownerAccount: IOwnerAccount = { name: '', cell: '', email: '', street:'',csz:'' };
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
  setSelectedUnit(u:string){
    this.myCurrentUnit = parseInt(u)
  }
  //* >>>>>>>>>>>> GETTERS / SETTERS <<<<<<<<<<<<

  isUserAuthenticated() {
    let obj = {
      'auth': this.userAuthenticated, 
      'account':this.userAccount,
    }
    return obj;
  };

  getOwnerAccount(){
    return this.ownerAccount;
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

private processUserAccount(data:any) {
  let x = data[0]
  this.userAccount.cell = x.cell;
  this.userAccount.email = x.email;
  this.userAccount.id = x.id;
  this.userAccount.userid = x.userid;
  this.userAccount.username = x.username;
  this.userAccount.role = x.role;
  this.userAccount.units = x.units.units;

  let dataObj = {
    to: 'HomeComponent',
    event: 'userAccount',
    account: this.userAccount
  };
  this.sendData(dataObj);
  let allUnits:number[] = this.userAccount.units;
  let oneUnit = allUnits[0]
  this.supabase.getOwnerAccount(oneUnit);
  console.log(this.g.DATA_SERVICE + " > processUserAccount()" + JSON.stringify(this.userAccount));
};

processOwnerAccount(data:any){
  this.ownerAccount.cell = data.cell;
  this.ownerAccount.csz = data.csz;
  this.ownerAccount.email = data.email;
  this.ownerAccount.name = data.name;
  this.ownerAccount.street = data.street;

  let dataObj = {
    to: 'HomeComponent',
    event: 'ownerAccount',
    account: this.ownerAccount
  };
  this.sendData(dataObj);
}



ngOnDestroy(): void {
  this.supaScription.unsubscribe();
}


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
           this.processUserAccount(dataPassed.result)
          }else if(dataPassed.event == 'getOwnerAccount' ){
            this.processOwnerAccount(dataPassed.result)
          }
        }
      }
    })
  }
};