import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { UnitsComponent } from './units/units/units.component';
import { DetailsComponent } from './units/details/details.component';
import { EditResidentComponent } from './units/edit-resident/edit-resident.component';
import { EditVehicleComponent } from './units/edit-vehicle/edit-vehicle.component';
import { AddVehicleComponent } from './units/add-vehicle/add-vehicle.component';
import { AddResidentComponent } from './units/add-resident/add-resident.component';

import { FormsComponent } from './forms/forms/forms.component';
import { WorkOrderComponent } from './forms/work-order/work-order.component';
import { ArchRequestComponent } from './forms/arch-request/arch-request.component';
import { CrimeReportComponent } from './forms/crime-report/crime-report.component';
import { ViolationReportComponent } from './forms/violation-report/violation-report.component';
import { MessageBoardComponent } from './forms/message-board/message-board.component';
import { OwnerUpdateComponent } from './forms/owner-update/owner-update.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { UserUpdateComponent } from './forms/user-update/user-update.component';
import { NavErrorComponent } from './misc/nav-error/nav-error.component';


const routes: Routes = [
  {
    path: '', 
    title: 'WST Owners Portal',
    children: [
      {path:'', redirectTo:'home', pathMatch:'full'},
      {path:'home', component: HomeComponent},
      {path:'password-reset', component: PasswordResetComponent},
      {path:'units', component: UnitsComponent,
        children:
          [
            {path:'', redirectTo:'units-detail', pathMatch:'full'},
            {path:'units-detail', component: DetailsComponent},
            {path:'edit-resident', component: EditResidentComponent},
            {path:'edit-vehicle', component: EditVehicleComponent},
            {path:'add-resident', component: AddResidentComponent},
            {path:'add-vehicle', component: AddVehicleComponent},
          ]},
      {path:'forms', component: FormsComponent,
      children:[
          {path:'', redirectTo:'work-order', pathMatch: 'full'},
          {path:'work-order', component: WorkOrderComponent,title:'Work Order'},
          {path:'arch-request', component: ArchRequestComponent,title:'Architectural Request'},
          {path:'crime-report', component: CrimeReportComponent,title:'Crime Report'},
          {path:'violation-report', component: ViolationReportComponent,title:'Violation Report'},
          {path:'message-board', component: MessageBoardComponent,title:'Message Board'},
          {path:'owner-update', component: OwnerUpdateComponent,title:'Owner Update'},
          {path:'user-update', component: UserUpdateComponent,title:'User Update'},
          ]},
      {path:'404', component: NavErrorComponent },
      {path:'**', redirectTo: '404',outlet:"app"},
    ]


  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
