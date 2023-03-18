import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs'
import { IUnit, IUnitsState  } from '../interfaces/iunit';
import { Globals } from '../interfaces/globals';
import { IProfile  } from '../interfaces/iprofile';
import { IVehicle } from '../interfaces/ivehicle';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private supaSubscription: Subscription

  private allUnits = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
    121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 200, 201, 202,
    203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225,
    226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311,
    312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334,
    335, 336, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420,
    421, 422, 423, 424, 425, 426, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516,
    517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539,
    540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553]

  
  private unitVehicles: IVehicle[] = [];
  private unitProfiles: IProfile[] = [];
  private ownerInfo: IUnit = { name: '', unit: 0, street: '', csz: '', cell: '', email: '' };


  // * Selected for any reason... most likely for editing
  private selectedProfile: IProfile;
  private selectedVehicle: IVehicle;

  private currentUnit: number;

  //* >>>>>>>>>>> OBSERVABLES  <<<<<<<<<<<<
  private adminEditMode: BehaviorSubject<IUnitsState> = new BehaviorSubject({isEditMode:false,isMenuActive:false});
  public adminEditMode$ = this.adminEditMode.asObservable();
  getEditModeObs(): Observable<IUnitsState> {
    return this.adminEditMode$
  }

  setEditMode(editMode: IUnitsState) {
    this.adminEditMode.next(editMode);
    console.log('UnitService > setEditMode ' + JSON.stringify(editMode))
  }

  // * >>>>>>>>>>>>>>>> Data Service <<<<<<<<<<<<<<<<<<

  private subject = new Subject<any>();

  public sendData(message: any) {
    console.log("UnitService  > sendData > message = " + JSON.stringify(message));
    this.subject.next(message);
  };

  clearData() {
    this.subject.next(null);
    this.currentUnit = undefined;
  };

  getData(): Observable<any> {
    return this.subject.asObservable();
  };

  //* >>>>>>>>>>>>>>>  UTILITIES <<<<<<<<<<<<<<<<<<<<<<<>

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

  isUnitValid(u: number): boolean {
   
    if (Number.isNaN(u)) { return false; }

    let ndx = this.allUnits.indexOf(u);
    if (ndx < 0) { return false; }

    return true;
  };

  //* SUPABASE CALLS

 

  // * SETTERS
  setUnitProfiles(data: IProfile[]) {
    this.unitProfiles = data;
  }

  setUnitVehicles(data: IVehicle[]) {
    this.unitVehicles = data;
  };

  setOwnerUnit(data: IUnit) {
    this.ownerInfo = data;
  };

  setSelectedProfile(p: IProfile) {
    this.selectedProfile = p;
  };

  setSelectedVehicle(car: IVehicle) {
    this.selectedVehicle = car;
  };

  // Gets Set from UnitHomeComponent in unitSelectionHandler
  setCurrentUnit(u: number) {
    this.currentUnit = u;
  };

  // Called ngDestroy in  AdminComponent
  resetUnitData() {
    this.unitVehicles = [];
    this.unitProfiles = [];
    this.currentUnit = 0;
    this.ownerInfo = { name: '', unit: 0, street: '', csz: '', cell: '', email: '' };
  }


  //* GETTERS

  getAdminProfiles(): IProfile[] {
    return this.unitProfiles;
  };

  getSelectedUnitOwner(): IUnit{
    return this.ownerInfo
  }

  getUserVehicles(): IVehicle[] {
    return this.unitVehicles;
  };

  getSelectedProfile(): IProfile {
    return this.selectedProfile;
  };

  getUpdateProfileID():number{
    var x = 0;
    if(this.selectedProfile != undefined){
      x = this.selectedProfile.id;
    }
    return x;
  }

  getSelectedVehicle(): IVehicle {
    return this.selectedVehicle;
  };

  getAdminUpdateUnit(): IUnit {
    return this.ownerInfo;
  };

  getCurrentUnit() {
    return this.ownerInfo.unit;
  };

  getResidentID(): number {
    var id: number = this.selectedProfile.id;
    return id;
  };

  isSpaceValid(space: string) {
    return true;
  };

  isSpaceAvailable(space: string) {
    return true;
  };

  //* >>>>>>>>>>>>>>> CONSTRUCTOR / SUBSCRIPTIONS <<<<<<<<<<<<<<<<<<<<

  constructor(private g: Globals, private supabase: SupabaseService) {
    this.doConsole('UnitService > constructor()')

    this.supaSubscription = this.supabase.getData().subscribe(x =>{
      if(x == null){return};
      let dataPassed = x;
      let f = dataPassed.to;
      let ar = f.split(',');
      this.doConsole('UnitService > supaSubscription = ' + dataPassed.event);
      if(ar.indexOf("UnitService") > -1){
        //* Unit/Owner
        if((dataPassed.from == 'SupabaseService') && (dataPassed.event == 'publishUnitOwnerData')){
          this.setOwnerUnit(dataPassed.iUnit);
        //* Vehicles
        }else if((dataPassed.from == 'SupabaseService') && (dataPassed.event == 'publishAdminVehicles')){
          this.setUnitVehicles(dataPassed.vehicles);
         //* Residents / Profiles  
        }else if(dataPassed.from == 'SupabaseService' && dataPassed.event == 'publishFetchedProfiles'){
          this.unitProfiles = dataPassed.profiles;
        //* Residents / Delete Profile
        }else if ((dataPassed.from == 'SupabaseService') && (dataPassed.event == 'updateResidentProfile success!')) {
         this.selectedProfile = undefined;
          
        }else if ((dataPassed.from == 'SupabaseService') && (dataPassed.event == 'removeVehicleSuccess!')) {
          this.selectedVehicle = undefined;
         
        }

      }
    }); //! End Of supaSubscription
  }
};
