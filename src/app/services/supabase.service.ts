import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/alert/dialog.component';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthChangeEvent, AuthSession } from '@supabase/supabase-js';
import { Session, User } from '@supabase/supabase-js';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IProfile, IProfileFetch } from '../interfaces/iprofile';
import { IVehicle } from '../interfaces/ivehicle';
import { IVehicleTable } from '../interfaces/ivehicle';
import { IUnit  } from '../interfaces/iunit';
import { IProfileUpdate } from '../interfaces/iprofile';
import { environment } from '../../environments/environment';
import { Globals } from '../interfaces/globals';
import { IData } from '../interfaces/idata';
import { ISpaceUpdate } from '../interfaces/ivehicle';
import { IUserAccount } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private loginMode = "IN" // Development only: Production should be "IN"
  private iProfile: IProfile;

  private vehicle: IVehicle;
  private myVehicles: IVehicle[] = [];
  private myProfiles: IProfile[] = [];

  private myUnit: IUnit; // fetch interface...

  private dataObj: IData = { to: '', event: '' };

  //* Observables
  _session: AuthSession | null = null;
  private currentUser: BehaviorSubject < User | boolean > = new BehaviorSubject(false);
  public currentUser$ = this.currentUser.asObservable();

  //Starts out true... if a profile exists it becomes User... if no profile yet... becomes false
  private userProfile: BehaviorSubject<IProfile | boolean> = new BehaviorSubject(true);
  public userProfile$ = this.userProfile.asObservable();

  dialogRef: any;

  //* >>>>>>>>>>>>>> MESSENGER <<<<<<<<<<<<<<<<

  private subject = new Subject<any>();

  public sendData(message: any) {
    console.log('SupabaseService > sendData > event = ' + message.event);
    this.subject.next(message);
  }

  clearData() {
    this.subject.next(null);
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

  publishData(to:string,event:string,data:any) {
    let dataObj = {
      to:to,
      event: event,
      data: data
    };
    this.sendData(dataObj);
  }

  doConsole(message: string) {
    console.log(message);
  }

  showResultDialog(message:string){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.data = {
        title: 'Result',
        message: message,
      };
      this.dialogRef = this.dialog.open(DialogComponent, dialogConfig);
  
      setTimeout(() => {
        this.dialogRef.close();
      }, 3000);
  }

  //* >>>>>>>>>>>>>>>>>>> FETCH RESIDENT DATA <<<<<<<<<<<<<<<<<<<<<<<
  async fetchResidentProfiles(unit: number) {
    console.log('SupabaseService > fetchResidentProfiles');
    try {
      let data = await this.supabase.from('profiles').select('*').eq('unit', unit);
      this.publishData('DetailsComponent','fetchResidentProfiles',data.data);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  async fetchResidentVehicles(unit: number) {
    console.log('SupabaseService > getAdminVehicles()');
    try {
      let data = await this.supabase.from('parking').select('*').eq('unit', unit);
      this.publishData('DetailsComponent','fetchResidentVehicles',data.data);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
   
  }

  async getUnit(unit: string) {
    console.log('SupabaseService > getUnit()');
    let { data, error } = await this.supabase
      .from('units')
      .select('unit,name,street,cell,email,csz')
      .eq('unit', parseInt(unit))
      .single();
    if (!error) {
      this.myUnit = data;
      this.publishUnitOwnerData();
    }
  }

  publishUnitOwnerData() {
    this.dataObj = {
      to: this.g.ADMIN_SERVICE + ',' + this.g.ADMIN_UNIT_COMPONENT,
      event: 'publishUnitOwnerData',
      iUnit: this.myUnit,
    };
    this.sendData(this.dataObj);
  }

  

  /* private publishAdminVehicles(data: any) {
    this.myVehicles.length = 0;
    for (var i = 0; i < data.length; i++) {
      this.vehicle = data[i];
      this.myVehicles.push(this.vehicle);
    }

    this.dataObj = {
      to: this.g.ADMIN_SERVICE + ',' + this.g.ADMIN_UNIT_COMPONENT,
      event: 'publishAdminVehicles',
      vehicles: this.myVehicles,
    };
    this.sendData(this.dataObj);
  } */

/*   async updateAdminVehicle(obj: IVehicleTable, s: number) {
    let { data, error } = await this.supabase
      .from('parking')
      .update(obj)
      .eq('space', s);

    if (error) {
      return error;
    } else {
      return data;
    }
    return data;
  } */

/*   async updateAdminUnitOwner(obj: IUnitTable, uNum: number) {
    //! Change eq from unit to id??
    try {
      let { data, error } = await this.supabase
        .from('units')
        .update(obj)
        .eq('unit', uNum);
      this.dataObj = {
        to: 'UpdateOwnerProfile',
        event: 'updateAdminUnitOwner',
      };
      this.sendData(this.dataObj);
    } catch (error) {
      alert(JSON.stringify(error))
    }
  } */

/*   async add_AdminNewResident_2(p: IProfileFetch) {
    try {
      let { data, error } = await this.supabase.from('profiles').insert(p);
      this.dataObj = {
        to: this.g.ADMIN_UNIT_COMPONENT,
        event: 'add_AdminNewResident_!',
      };
      this.sendData(this.dataObj);
    } catch (error) {
      alert(JSON.stringify(error))
    }
  } */

  async deleteResident(id:number) {
    try {
      let { data, error } = await this.supabase.from('profiles').delete().eq('id', id);
      let dataObj = {
        to: 'UpdateTenantProfile,' + this.g.ADMIN_SERVICE,
        event: 'deleteResident',
        id: id,
      };
      this.sendData(dataObj);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  //*>>>>>>>>>>>>>>>>>>>>  PROFILES  <<<<<<<<<<<<<<<<<<<<
  

  async insertNewProfile(profile: IProfileFetch) {
    console.log(
      'SupabaseService > insertNewProfile() profile >>' + JSON.stringify(profile)
    );

    try {
      const { data, error } = await this.supabase.from('profiles').insert(profile);
      this.showResultDialog('New resident profile added.')
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
    
  }

  async updateProfile(p: IProfileUpdate, id: number) {
    console.log('updateAdminResidentEdits_3 - begin id = ' + id);
    try {
      await this.supabase.from('profiles').update(p).match({ id: id });
      this.dataObj = {
        to: this.g.ADMIN_TENANT_COMPONENT,
        event: 'updateProfile',
      };
      this.sendData(this.dataObj);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  //*>>>>>>>>>>>>>>>>>> Vehicles <<<<<<<<<<<<<<<<<<<<

  async removeVehicle(id: number, unit: number) {
    let noCar = {
      name: '-',
      tag: '-',
      make: '-',
      model: '-',
      color: '-',
      link: '',
      url: '',
    };
    try {
      await this.supabase.from('parking').update(noCar).eq('id', id);
      this.dataObj = {
        to: "UnitService",
        event: 'removeVehicleSuccess!',
      };
      this.sendData(this.dataObj);
      //this.getAdminVehicles(unit);
      //this.router.navigate([this.unitsHomePath]);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  };

  async updateParkingSpace(
    space: ISpaceUpdate,
    id: string,
    nav: string,
    unit: number
  ) {
    try {
      let { data, error } = await this.supabase
        .from('parking')
        .update(space)
        .eq('id', id);
      // await
      //this.getAdminVehicles(unit);
      this.router.navigate([nav]);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  };
  private setMyVehicle(data: any) {
    this.myVehicles.length = 0;
    for (var i = 0; i < data.length; i++) {
      this.vehicle = data[i];
      this.myVehicles.push(this.vehicle);
    }
    
  }

  async updateVehicle(obj: IVehicleTable, s: number) {
    const { error } = await this.supabase
      .from('parking')
      .update(obj)
      .match({ space: s });

    if (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    } else {
      //this.getUserVehicles(this.ds.getUserUnitNumber());
    }
  }

  //* >>>>>>>>>>>>>>> UTILITIES <<<<<<<<<<<<<<<<<<<<
  // Called from LoginComponent just before signUp new account
  // supabase does not throw error when same user signs up twice--- but does not send Confirm email as stated
  async isDuplicateEmail(email: string) {
    console.log('SupabaseService > isDuplicateEmail() ' + email);
    let { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  }

  //* >>>>>>>>>>>>>>>>>>> USER / AUTH / SESSION / ACCOUNT <<<<<<<<<<<<<<<<<<<<<<<

  async loadUser() {
    if (this.currentUser.value) {// User is already set, no need to do anything else
      return;
    }
    // this will create a 401 error when no user is logged it yet-- ignore it
    const user = await this.supabase.auth.getUser();
    if (user.data.user) {
      this.currentUser.next(user.data.user);
    } else {
      this.currentUser.next(false);
    }
  }

  getCurrentUser(): Observable <User | boolean> {
    return this.currentUser.asObservable();
  }

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id;
    } else {
      return '';
    }
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  logIn(obj) {
    if (this.loginMode == 'IN') {
      this.signIn(obj);
    } else if(this.loginMode == 'UP'){
      this.signUp(obj);
    }
  }

  async signIn(credentials: { email: string; password: string }) {
    console.log('Supabase > signIn() ' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signInWithPassword(credentials);
  
      let dataObj = {
        to: 'DataService',
        event: 'userAuthenticated',
        result: result
      };
      this.sendData(dataObj);

      let uid = result.data.user.id;
      this.getUserAccount(uid);
    } catch (error) {
      alert("Sign in error: "  + JSON.stringify(error))
    }
  }

  async signUp(credentials: { email: string; password: string }) {
    console.log('Supabase > signUp()' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signUp(credentials);
    } catch (error) {}
    return result;
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async getUserAccount(user: string) {
    try {
      let { data, error } = await this.supabase.from('accounts').select('*').eq('userid', user);
     
      let dataObj = {
        to: 'DataService',
        event: 'getUserAccount',
        result: data
      };
      this.sendData(dataObj);
    } catch (error) {
      alert("Sign in error: "  + JSON.stringify(error))
    }
  }

  //* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor(private router: Router,private g: Globals,private dialog: MatDialog ) {
    console.log('SupabaseService > constructor() ');
    try {
      this.supabase = createClient(environment.supabaseUrl,environment.supabaseKey);
    } catch (error) {}

    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, sess: Session | null) => {
        console.log('Begin: SupabaseService > onAuthStateChange = ' + event + ' > currentUser = ' + (this.currentUser.value as User).id);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          let s = sess;
          if (s != null) {
            var u: User = s.user;
            this.currentUser.next(u);
          }
        } else {
          this.currentUser.next(false);
        }
        console.log(
          'End: SupabaseService > onAuthStateChange:event= ' + event + ' > currentUser = ' + (this.currentUser.value as User).id
        );
      }
    );

    // Trigger initial session load
    this.loadUser();
  }
}

