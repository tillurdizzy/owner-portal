import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UnitService } from '../../services/unit.service';
import { Globals } from '../../interfaces/globals';
import {IVehicleUpdate,IVehicleTable, ISpaceUpdate} from '../../interfaces/ivehicle';


@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss']
})
export class EditVehicleComponent {
  aCar: IVehicleUpdate;
  formIsBlank: boolean = true;
  currentSpace: number;
  currentUnit: number;
  spaceID: number;

  vehicleForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tag: new FormControl('', [Validators.required]),
    make: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.us.doConsole('EditVehicleComponent => ngOnInit()');
    this.aCar = this.us.getSelectedVehicle();
    this.spaceID = this.aCar.id;
    this.currentUnit = this.aCar.unit;
    this.currentSpace = this.aCar.space;
    this.vehicleForm.reset();
    this.setFormValues();
  }

  setFormValues() {
    var aCar = {
      name: this.aCar.name,
      tag: this.aCar.tag,
      make: this.aCar.make,
      model: this.aCar.model,
      color: this.aCar.color,
    };
    this.vehicleForm.setValue(aCar);
  }

  private setFormBlank() {
    this.currentSpace = undefined;
    var aCar = {
      name: '',
      tag: '',
      make: '',
      model: '',
      color: '',
    };
    this.vehicleForm.setValue(aCar);
    this.vehicleForm.reset();
    this.formIsBlank = true;
  }

  submitBtnUpdate() {
    
    var f = this.vehicleForm.value;

    let aCar:ISpaceUpdate = {
      tag: f.tag,
      make: f.make,
      model: f.model,
      color: f.color,
      name: f.name
    };

    let idstring = this.spaceID.toString();
    this.us.updateVehicle(aCar,idstring)
    this.supabase.updateParkingSpace(aCar,idstring,'/home',this.currentUnit);
  };

  cancelBackBtn(){
    this.router.navigate(['/home']);
  }

 
  submitBtnRemove() {
    this.supabase.removeVehicle(this.spaceID, this.currentUnit);
  }

  ngOnDestroy() {
    this.us.clearData();
  }

  clearData() {
    this.us.clearData();
  }

  public handleError = (control: string, error: string) => {
    return this.vehicleForm.controls[control].hasError(error);
  };

  constructor(
    private router: Router,
    private g: Globals,
    private supabase: SupabaseService,
    private us: UnitService
  ) {}
}