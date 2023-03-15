import { Component, OnInit} from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { DataService } from '../../services/data.service';
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
    this.supaScription.unsubscribe();
  };

  // >>>>>>>>>>>  TABLE EDIT HANDLERS <<<<<<<<<<<<<

  onVehicleClick(n: number) {
    //this.ds.setEditMode({isEditMode:true,isMenuActive:true});
    this.editVehicle = this.myVehicles[n];
    //this.ds.setAdminUpdateVehicle(this.editVehicle);
    this.router.navigate(['/watch/watch-units/update-vehicle']);
    //this.clearUnitForm();
  };

  onResidentClick(n: number) {
    //this.ds.setEditMode({isEditMode:true,isMenuActive:true});
    this.editProfile = this.myProfiles[n];
    //this.ds.setUnitUpdateProfile(this.editProfile);
    this.router.navigate(['/watch/watch-units/update-resident']);
    //this.clearUnitForm();
  };

  resetTableData() {
    this.isResidentOne = false;
    this.isResidentTwo = false;
    this.isResidentThree = false;

    this.isVehicleOne = false;
    this.isVehicleTwo = false;
    this.isVehicleThree = false;
  };

  //* >>>>>>>>>>>>  SUBSCRIPTION HANDLERS  >>>>>>>>>>>>\\

  private processProfiles(data:any){

  }

  private processVehicles(data:any){
    this.showSpinner = false;
  }

  constructor(private supabase: SupabaseService, private router: Router, private ds: DataService, private g: Globals) {

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