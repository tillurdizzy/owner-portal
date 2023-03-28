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
import { IOwnerInsert, IUnit  } from '../interfaces/iunit';
import { IProfileUpdate } from '../interfaces/iprofile';
import { environment } from '../../environments/environment';
import { Globals } from '../interfaces/globals';
import { IData } from '../interfaces/idata';
import { ISpaceUpdate } from '../interfaces/ivehicle';
import { IUserAccount, IUserUpdate } from '../interfaces/iuser';
import { IWorkOrder, IBasicForm } from '../interfaces/iforms';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  //private loginMode = "UP" // Development only to sign up users: Production should be "IN"
  private loginMode = "IN"
  private iProfile: IProfile;

  private vehicle: IVehicle;
  private myVehicles: IVehicle[] = [];
  private myProfiles: IProfile[] = [];


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
      }, 2000);
  }

  //* >>>>>>>>>>>>>>>>>>> FETCH RESIDENT DATA <<<<<<<<<<<<<<<<<<<<<<<
  async fetchResidentProfiles(unit: number) {
    this.doConsole('SupabaseService > fetchResidentProfiles');
    try {
      let data = await this.supabase.from('profiles').select('*').eq('unit', unit);
      this.publishData('DetailsComponent','fetchResidentProfiles',data.data);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  async fetchResidentVehicles(unit: number) {
    this.doConsole('SupabaseService > getAdminVehicles()');
    try {
      let data = await this.supabase.from('parking').select('*').eq('unit', unit);
      this.publishData('DetailsComponent','fetchResidentVehicles',data.data);
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
   
  }

  async fetchUnit(unit: number) {
    this.doConsole('SupabaseService > fetchUnit()');
    try {
      let { data, error } = await this.supabase
      .from('units').select('unit,name,street,cell,email,csz,sqft,bdrms')
      .eq('unit', unit).single();

      this.publishUnitData(data); 
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }
  }

  publishUnitData(data) {

    this.dataObj = {
      to: 'DataServices',
      event: 'publishUnitData',
      iUnit: data,
    };
    this.sendData(this.dataObj);

    this.dataObj = {
      to: 'DetailsComponent',
      event: 'publishUnitData',
      iUnit: data,
    };
    this.sendData(this.dataObj);
  }



    //*>>>>>>>>>>>>>>>>>>>>  PROFILES / OWNER  <<<<<<<<<<<<<<<<<<<<
  async deleteProfile(id:number) {
    try {
      let { data, error } = await this.supabase.from('profiles').delete().eq('id', id);
      this.showResultDialog('Resident deleted.')
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['units/units-detail']);
    }
  }

  async insertNewProfile(profile: IProfileFetch) {
    this.doConsole('SupabaseService > insertNewProfile() profile >>' + JSON.stringify(profile));
    try {
      const { data, error } = await this.supabase.from('profiles').insert(profile);
      this.showResultDialog('New resident profile added.')
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/units/units-detail']);
    }
  }

  async updateProfile(p: IProfileUpdate, id: number) {
    this.doConsole('updateAdminResidentEdits_3 - begin id = ' + id);
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
      alert("Sign in error: getUserAccount "  + JSON.stringify(error))
    }
  }

  async updateUserAccount(updateObj: IUserUpdate,id:string){
    
    try {
      const { data, error } = await this.supabase.from('accounts')
      .update(updateObj)
      .eq('userid', id);
      if(error == null){this.showResultDialog('User account updated.')}
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/home']);
    }
  }

  async getOwnerAccount(unit:number){
    try {
      let { data, error } = await this.supabase.from('units').select('*').eq('unit', unit);
      let dataObj = {
        to: 'DataService',
        event: 'getOwnerAccount',
        result: data[0]
      };
      this.sendData(dataObj);
    } catch (error) {
      alert("Sign in error: getOwner "  + JSON.stringify(error))
    }
  }

  async updateOwnerAccount(a:IOwnerInsert,units){
    this.doConsole('SupabaseService > updateOwnerAccount() data >>' + JSON.stringify(a));
    try {
      const { data, error } = await this.supabase.from('units')
      .update(a)
      .in('unit', units);
      if(error == null){this.showResultDialog('Owner account updated.')}
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/home']);
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

  // Chain of Calls... signIn >> getUserAccount >> ds.getOwner
  async signIn(credentials: { email: string; password: string }) {
    this.doConsole('Supabase > signIn() ' + JSON.stringify(credentials));
    try {
      var result = await this.supabase.auth.signInWithPassword(credentials);
      if(result.data.user == null){
        alert(JSON.stringify(result.error.message))
        return;
      }
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
    this.doConsole('Supabase > signUp()' + JSON.stringify(credentials));
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

  

  //* >>>>>>>>>>>>  FORMS  <<<<<<<<<<<<\\
  async insertWorkOrder(wo:IWorkOrder){
    try {
      const { data, error } = await this.supabase.from('work-orders').insert(wo);
      this.showResultDialog('Work Order submitted.')
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/home']);
    }
  }

  async insertBasicForm(frm:IBasicForm,message:string){
    try {
      const { data, error } = await this.supabase.from('forms').insert(frm);
      this.showResultDialog(message)
    } catch (error) {
      this.showResultDialog('ERROR: ' + JSON.stringify(error))
    }finally{
      this.router.navigate(['/home']);
    }
  }

  //* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor(private router: Router,private g: Globals,private dialog: MatDialog ) {
    this.doConsole('SupabaseService > constructor() ');
    try {
      this.supabase = createClient(environment.supabaseUrl,environment.supabaseKey);
    } catch (error) {alert("Create Client error: "  + JSON.stringify(error))}

    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, sess: Session | null) => {
      this.doConsole('Begin: SupabaseService > onAuthStateChange = ' + event + ' > currentUser = ' + (this.currentUser.value as User).id);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          let s = sess;
          if (s != null) {
            var u: User = s.user;
            this.currentUser.next(u);
          }
        } else {
          this.currentUser.next(false);
        }
        this.doConsole(
          'End: SupabaseService > onAuthStateChange:event= ' + event + ' > currentUser = ' + (this.currentUser.value as User).id
        );
      }
    );

    // Trigger initial session load
    this.loadUser();
  }
}

