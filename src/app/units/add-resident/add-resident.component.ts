import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { DataService } from '../../services/data.service';
import { UnitService } from '../../services/unit.service';
import { Globals } from '../../interfaces/globals';
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { IProfileFetch } from '../../interfaces/iprofile';

@Component({
  selector: 'app-add-resident',
  templateUrl: './add-resident.component.html',
  styleUrls: ['./add-resident.component.scss']
})
export class AddResidentComponent implements OnInit{

  me: string = "AddResidentComponent"
  selectedUnit: number = 0;
  supaScription: Subscription;
  myProfile: IProfileFetch;


  ngOnInit(): void {
    console.log(this.me + "ngOnInit()")
    //this.showSpinner = true;
    this.selectedUnit = this.ds.currentUnit;
    this.myForm.reset(); 
  }

  myForm = new FormGroup({
    email: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    cell: new FormControl('', Validators.required),

  });

  submitBtn() {
    let myID = this.getIDNumber();
    var f = this.myForm.value;
    let p: IProfileFetch = {
      id: myID,
      unit: this.selectedUnit,
      email: f.email,
      cell: f.cell,
      firstname: f.firstname,
      lastname: f.lastname,
      lease: '',
      type: 'Tenant',
    };
    this.supabase.insertNewProfile(p);
  }

  private getIDNumber() {
    let a = Math.random() * (999999 - 10000) + 10000;
    let b = Math.round(a);
    return b;
  }

  public handleError = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };

  ngOnDestroy(): void {
    this.supaScription.unsubscribe();
  }

  cancelBackBtn(){
    this.router.navigate(['/home']);
  }

  constructor(private supabase: SupabaseService, private router: Router, 
    private ds: DataService, private g: Globals, private us: UnitService) {

    this.supaScription = this.supabase.getData().subscribe(x => {
      if(x != null){
        var dataPassed = x;
        if(dataPassed.to == this.me){
          if(dataPassed.event == 'fx' ){
           
          }else if(dataPassed.event == 'x' ){
            
          }else if(dataPassed.event == 'xx' ){
            //this.set
          }else if(dataPassed.event == 'xx' ){
            //this.set
          }
        }
      }
    })
  }
}
