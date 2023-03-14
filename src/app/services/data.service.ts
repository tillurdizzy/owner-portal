import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { Subject } from 'rxjs';

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

  private userAuthenticated: boolean = false;

  private userAccount: IUserAccount = { username: '', role: '', cell: '', email: '', dba: '', units: [], street:'',csz:'', userid:'' };
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

  //Set when user logs successfully in from Supa
  authenticateUser(data: any) {
    this.userAuthenticated = true;
    this.currentUser = data.user;
    this.session = data.session;
    let dataObj = {
      to: 'HomeComponent',
      event: 'userAuthenticated',
    };
    this.sendData(dataObj);
  };

  // Called from LoginComponent (Child of Owner/Tenant)
  /* setUserOwner(dataObj: any) {
    console.log(this.g.DATA_SERVICE + " > setUserOwner()")
    this.userid = dataObj.id.id;
    this.userRole = dataObj.id.role;
    this.session = dataObj.session;
    this.userAuthenticated = true;
    this.sendData({
      from: this.g.DATA_SERVICE, event: this.g.OWNER_AUTH,
      to: this.g.OWNERS_COMPONENT, other: this.userid
    });

  }; */

  setUserAccount(data:any) {
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

  setUserVehicles(data: IVehicle[]) {
    console.log(this.g.DATA_SERVICE + " > setUserVehicles()");
    var cars = data;
    this.myVehicles = this.removeNull(data);
    let dataObj = {
      from: this.g.DATA_SERVICE, to: this.g.ADMIN_UNIT_COMPONENT,
      event: this.g.EVENT_VEHICLES, vehicles: this.myVehicles
    };
    this.sendData(dataObj);
  };


  //* >>>>>>>>>>>>>>>>>>>  GET  <<<<<<<<<<<<<<<<<<<<<<

  isUserAuthenticated() {
    return this.userAuthenticated;
  };

  /* getUserID(): string | null {
    return this.userid;
  };

  getUserProfile(): IProfile {
    return this.userProfile;
  };

  getUserUnitNumber(): string | number {
    return this.userProfile.unit;
  };

  getUserVehicles(): IVehicle[] {
    return this.myVehicles;
  }; */


//* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor(private g: Globals, ) {
    this.doConsole('DataService > constructor()')


  }
};