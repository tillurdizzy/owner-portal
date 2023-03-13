import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { Subject } from 'rxjs';

import { IProfile } from '../interfaces/iprofile';
import { IVehicle } from '../interfaces/ivehicle';
import { Globals } from '../interfaces/globals';

@Injectable({
  providedIn: "root",
})

export class DataService {

  ////////////////////// Properties \\\\\\\\\\\\\\\\\\\\\\\

  private userid: string | null = null;
  private session: string | null = null;
  private userType: string | null = null;
  private userRole: string;

  private ownerAuthenticated: boolean = false;
  private tenantAuthenticated: boolean = false;

  private userProfile: IProfile = { firstname: '', lastname: '', cell: '', lease: '', email: '', type: '', unit: 0, id: 0 };
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

  //invoked from Auth CurrentUser subscription 
  authenticateUser() {
    var type = this.userProfile.type;
    console.log(this.g.DATA_SERVICE + " >  authenticateUser() " + type);
    if (type == "tenants") {
      this.tenantAuthenticated = true;
    } else if (type == "owners") {
      this.ownerAuthenticated = true;
    }
  };

  //! FIX THIS!!!   
  isUserAdmin(): boolean {
    var isAdmin = false;
    if (this.userProfile.email == "tillurdizzy@live.com") {
      isAdmin = true;
    }
    //return isAdmin;
    return true; // dev only
  };

  doConsole(message: string) {
    console.log(message);
  };

  //* >>>>>>>>>>>>>>>>>> SET <<<<<<<<<<<<<<<<<<<<<<<<<<<

  // Called from LoginComponent (Child of Owner/Tenant)
  setUserOwner(dataObj: any) {
    console.log(this.g.DATA_SERVICE + " > setUserOwner()")
    this.userid = dataObj.id.id;
    this.userRole = dataObj.id.role;
    this.session = dataObj.session;
    this.ownerAuthenticated = true;
    this.sendData({
      from: this.g.DATA_SERVICE, event: this.g.OWNER_AUTH,
      to: this.g.OWNERS_COMPONENT, other: this.userid
    });

  };

  setUserType(type: string) {
    this.userType = type;
  };

  setUserProfile(p: IProfile) {
    console.log(this.g.DATA_SERVICE + " > setUserProfile()");
    this.userProfile = this.removeNull(p);
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

  isOwnerAuthenticated() {
    return this.ownerAuthenticated;
  };



  getUserID(): string | null {
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
  };


//* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor(private g: Globals) {
    this.doConsole('DataService > constructor()')

    /* this.authService.authChanges((event, sess) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (sess) {
          this.userid = sess.user.id
        }

      } else {
        this.userid = null;
      };

      this.doConsole('DataService > onAuthStateChange > event = '
        + event + ' User: ' + this.userid);

    });
    // if next == true == 'pristine'... has not been set yet... after init will either be false or User
    this.authService.userProfile$.subscribe((next) => {

      if (typeof next != 'boolean') {
        this.doConsole('DataService > userProfile$ Subscription ' + JSON.stringify(next));
        this.userProfile = next;
        this.authenticateUser();
      } else {
        this.doConsole('DataService > userProfile$ Subscription ' + next);
      }
    });

    this.authService.myVehicles$.subscribe((next) => {
      this.doConsole('DataService > myVehicles$ Subscription # cars = ' + next.length);
      this.myVehicles = next;
    });
 */

  }
};