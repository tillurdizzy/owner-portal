import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DataService } from './data.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs'
import { IProfile, IProfileInsert } from '../interfaces/iprofile';
import { IVehicle } from '../interfaces/ivehicle';
import { IVehicleTable } from '../interfaces/ivehicle-table';
import { IUnit, IUnitTable } from '../interfaces/iunit';
import { IProfileUpdate } from '../interfaces/iprofileupdate';
import { IProfileLongUpdate } from '../interfaces/iprofile-long-update';
import { environment } from '../../environments/environment';
import { Globals } from '../interfaces/globals';
import { IData } from '../interfaces/idata';

@Injectable({
  providedIn: 'root',
})

export class SupabaseService {

  private supabase: SupabaseClient;
  private iProfile: IProfile;
  private iProfileLongUpdate: IProfileLongUpdate;
  private IProfileUpdate: IProfileUpdate;

 
  private vehicle: IVehicle;
  private myVehicles: IVehicle[] = [];
  private myProfiles: IProfile[] = [];
  private myUnitNumber: string | null;
  private myUnit: IUnit; // fetch interface...

  private dataObj: IData = {from: '', to:'', event: ''};

  

  //* >>>>>>>>>>>>>> MESSENGER <<<<<<<<<<<<<<<<

  private subject = new Subject<any>();

  public sendData(message: any) {
    console.log("SupabaseService > sendData > event = " + message.event);
    this.subject.next(message);
  };

  clearData() {
    this.subject.next(null);
  };

  getData(): Observable<any> {
    return this.subject.asObservable();
  };

  publishFetchedProfiles(){
    this.dataObj = {
      from:this.g.SUPABASE_SERVICE, 
      to: this.g.ADMIN_SERVICE + ','+ this.g.ADMIN_UNIT_COMPONENT, 
      event: 'publishFetchedProfiles', 
      profiles:this.myProfiles
    };
    this.sendData(this.dataObj);
  }

  doConsole(message: string) {
    console.log(message);
  };


  //* >>>>>>>>>>>>>>>>>>>  GET USERS  <<<<<<<<<<<<<<<<<<<<<<

  public getUserData(user: string) {
    //var type: string = this.ds.getUserType();
    console.log("SupabaseService > getUserData() user = " + user );
    this.getUserProfile(user);
  };

  async getUserProfile(userID) {
    console.log("SupabaseService > getUserProfile() ");

    let { data, error } = await this.supabase.from('profiles').select().eq('user', userID).single();
    if (!error) {
      let profile = data;
      this.iProfile = {
        unit: profile['unit'],
        id: data['id'],
        email: data['email'],
        cell: data['cell'],
        lastname: data['lastname'],
        type: data['type'],
        firstname: data['firstname'],
        lease:data['lease']
      };
      this.ds.setUserProfile(this.iProfile);
      this.getUserVehicles(data['unit'])
    } else {
      alert("Supabase getProfile " + error)
    }
  };


 //* >>>>>>>>>>>>>>>>>>> ADMIN <<<<<<<<<<<<<<<<<<<<<<<
  async fetchAdminProfiles_3(unit: string) {
    console.log("SupabaseService > fetchAdminProfiles_3 begin");

    let { data, error } = await this.supabase.from('profiles').select('*').eq('unit', unit);
    if (!error) {
      console.log("SupabaseService > fetchAdminProfiles_3 success!");
      //!this.myProfiles = data;
      this.publishFetchedProfiles();
      
      this.getUnit(unit);
    } else {
      alert("Supabase getProfile " + error)
    }
  };

  async getUnit(unit: string) {
    console.log("SupabaseService > getUnit()");
    let { data, error } = await this.supabase.from('units').select('unit,name,street,cell,email,csz').eq('unit', parseInt(unit)).single();
    if (!error) {
      this.myUnit = data;
      this.publishUnitOwnerData();
      
      this.getAdminVehicles(unit);
    }
  };

  publishUnitOwnerData(){
    this.dataObj = {
      from:this.g.SUPABASE_SERVICE, 
      to: this.g.ADMIN_SERVICE + ','+ this.g.ADMIN_UNIT_COMPONENT, 
      event: 'publishUnitOwnerData', 
      iUnit:this.myUnit
    };
    this.sendData(this.dataObj);
  }

  async getAdminVehicles(unit: string) {
    console.log("SupabaseService > getAdminVehicles()");
    let { data, error } = await this.supabase.from('parking').select('*').eq('unit', parseInt(unit));
    if (!error) {
      this.publishAdminVehicles(data);
    }
  };

  private publishAdminVehicles(data: any) {
    this.myVehicles.length = 0;
    for (var i = 0; i < data.length; i++) {
      this.vehicle = data[i];
      this.myVehicles.push(this.vehicle);
    }
   
    this.dataObj = {
      from:this.g.SUPABASE_SERVICE, 
      to: this.g.ADMIN_SERVICE + ','+ this.g.ADMIN_UNIT_COMPONENT, 
      event: 'publishAdminVehicles',
      vehicles:this.myVehicles};
    this.sendData(this.dataObj);
  };

  async updateAdminVehicle(obj: IVehicleTable, s: number) {
    let  { data, error } = await this.supabase
      .from('parking')
      .update(obj)
      .eq('space', s );

    if (error) {
      return error;
    } else {
      return data;
    }
    return data;
  };

  async updateAdminUnitOwner(obj:IUnitTable, uNum:number){
    //! Change eq from unit to id??
    try {
      let  { data, error } = await this.supabase.from('units').update(obj).eq('unit', uNum );
      this.dataObj = {
        from:this.g.SUPABASE_SERVICE, 
        to: "UpdateOwnerProfile", 
        event: 'updateAdminUnitOwner'};
      this.sendData(this.dataObj);
    } catch (error) {
      alert(error.message)
    }

  };

  async add_AdminNewResident_2(p: IProfileInsert){
    try {
      let  { data, error } = await this.supabase.from('profiles').insert(p);
      this.dataObj = {
        from:this.g.SUPABASE_SERVICE, 
        to: this.g.ADMIN_UNIT_COMPONENT, 
        event: 'add_AdminNewResident_!'};
      this.sendData(this.dataObj);
    } catch (error) {
      alert(error.message)
    }
  }

  async delete_adminResident(email:string){
    try {
      let  { data, error } = await this.supabase.from('profiles').delete().eq('email',email);
      this.dataObj = {
        from:this.g.SUPABASE_SERVICE, 
        to: 'UpdateTenantProfile,'+ this.g.ADMIN_SERVICE,
        event: 'delete_adminResident',email:email};
      this.sendData(this.dataObj);
    } catch (error) {
      alert(error.message)
    }
  }

  // TRUE shows CANCEL button... FALSE hides CANCEL and shows Add Buttons
  setAdminEditMode(b: boolean) {
    this.doConsole('AdminService > setAdminEditMode() setTo: = ' + b)
    let dataObj = {
      from: this.g.SUPABASE_SERVICE, to: this.g.ADMIN_COMPONENT+','+ this.g.ADMIN_SERVICE,
      event: this.g.ADMIN_EDIT_MODE, bool: b
    };
    this.sendData(dataObj);
  };
 //* >>>>>>>>>>>>>>>>>>> USERS <<<<<<<<<<<<<<<<<<<<<<<


  


  //*>>>>>>>>>>>>>>>>>>>>  PROFILES  <<<<<<<<<<<<<<<<<<<<

  async insertNewProfile(profile: IProfile) {
    console.log("SupabaseService > insertNewProfile() profile >>" + JSON.stringify(profile));
    const { data, error } = await this.supabase.from('profiles').insert(profile);
    if (error) {
      console.log("SupabaseService > insertNewProfile() error >>" + JSON.stringify(error));
    } else {
      console.log("SupabaseService > insertNewProfile() data >>" + data);
    }
  };


  async updateProfile(p: IProfileUpdate, user: string) {
    console.log("SupabaseService > updateProfile() " + JSON.stringify(p));
    const { error } = await this.supabase
      .from('profiles')
      .update(p)
      .match({ user: user });

    if (error) {
      alert(error.message)
    } else {
      alert('Your profile was successfully updated!');
      this.getUserProfile(user);
    }
  };

  async updateAdminResidentEdits_3(p:IProfileLongUpdate, id:number){
    
    console.log("updateAdminResidentEdits_3 - begin id = " + id);
    try {
      await this.supabase.from('profiles').update(p).match({ id: id });
      this.dataObj = {
        from:this.g.SUPABASE_SERVICE, 
        to: this.g.ADMIN_TENANT_COMPONENT, 
        event: 'updateAdminResidentEdits_3'};
      this.sendData(this.dataObj);
    } catch (error) {
      alert(error.message)
    }
  };


  //*>>>>>>>>>>>>>>>>>> Vehicles <<<<<<<<<<<<<<<<<<<<

  async getUserVehicles(unit_number) {
    console.log("SupabaseService > getUserVehicles()");
    let { data, error } = await this.supabase.from('parking').select('*').eq('unit', parseInt(unit_number));
    if (!error) {
      this.setMyVehicle(data);
    }
  };

  private setMyVehicle(data: any) {
    this.myVehicles.length = 0;
    for (var i = 0; i < data.length; i++) {
      this.vehicle = data[i];
      this.myVehicles.push(this.vehicle);
    }
    this.ds.setUserVehicles(this.myVehicles);
  };

  async updateVehicle(obj: IVehicleTable, s: number) {
    const { error } = await this.supabase
      .from('parking')
      .update(obj)
      .match({ space: s });

    if (error) {
      alert(error.message)
    } else {
      this.getUserVehicles(this.ds.getUserUnitNumber());
    }
  };

//* >>>>>>>>>>>>>>> UTILITIES <<<<<<<<<<<<<<<<<<<<
  // Called from LoginComponent just before signUp new account
  // supabase does not throw error when same user signs up twice--- but does not send Confirm email as stated
  async isDuplicateEmail(email: string) {
    console.log("SupabaseService > isDuplicateEmail() " + email);
    let { data, error } = await this.supabase.from('profiles').select('*').eq('email', email).single();
    return { data, error };
  }

//* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor(private router: Router, private ds: DataService,
    private g: Globals) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    console.log('SupabaseService > constructor() ');
  };

};