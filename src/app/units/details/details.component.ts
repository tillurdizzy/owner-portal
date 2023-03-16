import { Component, OnInit} from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { DataService } from '../../services/data.service';
import { UnitService } from '../../services/unit.service';
import { Globals } from '../../interfaces/globals';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { IProfile } from '../../interfaces/iprofile';
import { IVehicle } from '../../interfaces/ivehicle';
import { IData } from '../../interfaces/idata';
import { IUnit } from '../../interfaces/iunit';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{
  me: string = "DetailsComponent"
  supaScription: Subscription;
  showSpinner:boolean = false;
  selectedUnit: number = 0;
  unitSelected:boolean = false;

  isResidentOne = false;
  isResidentTwo = false;
  isResidentThree = false;
  isVehicleOne = false;
  isVehicleTwo = false;
  isVehicleThree = false;

  dialog: any;
  canEdit = { owner: false, resident: false, vehicles: false };
 
  //* Raw data: includes ALL columns from supabase... 
  myProfiles: IProfile[] = [{ firstname: '', lastname: '', email: '', cell: '', type: '', lease: '', unit: 0, id: 0 }];
  myVehicles: IVehicle[] = [{ name: '', tag: '', space: '', make: '', model: '', color: '', unit: 0, link: '', url: '', id: 0, sort: '' }];
  myUnit: IUnit = { name: '', unit: 0, street: '', csz: '', cell: '', email: '' };

  //* Single objects chosen from table to edit
  editProfile: IProfile = { firstname: 'x', lastname: 'x', email: '', cell: 'x', type: '', lease: '', unit: 0, id: 0 };
  editVehicle: IVehicle = { name: '', tag: '', space: '', make: '', model: '', color: '', unit: 0, link: '', url: '', id: 0, sort: '' };


  ngOnInit(): void {
    console.log(this.me + "ngOnInit()")
    //this.showSpinner = true;
    this.selectedUnit = this.ds.currentUnit;
    this.supabase.fetchResidentProfiles(this.selectedUnit);
    this.supabase.fetchResidentVehicles(this.selectedUnit);
    
  }

  ngOnDestroy() {
    this.us.clearData();
    this.supaScription.unsubscribe();
  };

  // >>>>>>>>>>>  TABLE EDIT HANDLERS <<<<<<<<<<<<<

  onVehicleClick(n: number) {
    //this.ds.setEditMode({isEditMode:true,isMenuActive:true});
    this.editVehicle = this.myVehicles[n];
    //this.ds.setAdminUpdateVehicle(this.editVehicle);
    this.router.navigate(['/units/edit-vehicle']);
    //this.clearUnitForm();
  };

  onResidentClick(n: number) {
    //this.ds.setEditMode({isEditMode:true,isMenuActive:true});
    this.editProfile = this.myProfiles[n];
    //this.ds.setUnitUpdateProfile(this.editProfile);
    this.router.navigate(['/units/edit-resident']);
    //this.clearUnitForm();
  };

  resetTableData() {
    this.canEdit.resident = false;
    this.canEdit.vehicles = false;

    this.isResidentOne = false;
    this.isResidentTwo = false;
    this.isResidentThree = false;

    this.isVehicleOne = false;
    this.isVehicleTwo = false;
    this.isVehicleThree = false;
  };

  //* >>>>>>>>>>>>  SUBSCRIPTION HANDLERS  >>>>>>>>>>>>\\

  private processProfiles(data:any){
    this.myProfiles = data;
    this.us.setUnitProfiles(this.myProfiles);
    let x = this.myProfiles.length;
    if (x == 3) {
      this.isResidentOne = true;
      this.isResidentTwo = true;
      this.isResidentThree = true;
    } else if (x == 2) {
      this.isResidentOne = true;
      this.isResidentTwo = true;
      this.isVehicleThree = false;
    } else if (x == 1) {
      this.isResidentOne = true;
      this.isResidentTwo = false;
      this.isResidentThree = false;
    } else if (x == 0) {
      this.isResidentOne = false;
      this.isResidentTwo = false;
      this.isResidentThree = false;
    }
    if (x > 0) {
      this.canEdit.resident = true;
    }

  }

  private processVehicles(data:any){
    this.myVehicles = data;
    this.us.setUnitVehicles(this.myVehicles);
    let x = this.myVehicles.length;
    if (x == 3) {
      this.isVehicleOne = true;
      this.isVehicleTwo = true;
      this.isVehicleThree = true;
    } else if (x == 2) {
      this.isVehicleOne = true;
      this.isVehicleTwo = true;
      this.isVehicleThree = false;
    } else if (x == 1) {
      this.isVehicleOne = true;
      this.isVehicleTwo = false;
      this.isVehicleThree = false;
    } else if (x == 0) {
      this.isVehicleOne = false;
      this.isVehicleTwo = false;
      this.isVehicleThree = false;
    }
    if (x > 0) {
      this.canEdit.vehicles = true;
    }

    this.showSpinner = false;
  }

  constructor(private supabase: SupabaseService, private router: Router, 
    private ds: DataService, private g: Globals, private us: UnitService) {

    this.supaScription = this.supabase.getData().subscribe(x => {
      if(x != null){
        var dataPassed = x;
        if(dataPassed.to == this.me){
          if(dataPassed.event == 'fetchResidentProfiles' ){
            this.processProfiles(dataPassed.data);
          }else if(dataPassed.event == 'fetchResidentVehicles' ){
            this.processVehicles(dataPassed.data)
          }else if(dataPassed.event == 'xx' ){
            //this.set
          }else if(dataPassed.event == 'xx' ){
            //this.set
          }
        }
      }
    })
  }
};