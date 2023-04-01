import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularMaterialModule } from '../material.module';
import { LoginFormComponent } from './auth/login-form/login-form.component';

import { SupabaseService } from './services/supabase.service';
import { DataService } from './services/data.service';

import { DialogComponent } from './dialog/alert/dialog.component';
import { HomeComponent } from './home/home.component';
import { UnitsComponent } from './units/units/units.component';
import { DetailsComponent } from './units/details/details.component';
import { FormsComponent } from './forms/forms/forms.component';
import { WorkOrderComponent } from './forms/work-order/work-order.component';
import { NavErrorComponent } from './misc/nav-error/nav-error.component';
import { EditResidentComponent } from './units/edit-resident/edit-resident.component';
import { EditVehicleComponent } from './units/edit-vehicle/edit-vehicle.component';
import { AddVehicleComponent } from './units/add-vehicle/add-vehicle.component';
import { AddResidentComponent } from './units/add-resident/add-resident.component';
import { ArchRequestComponent } from './forms/arch-request/arch-request.component';
import { CrimeReportComponent } from './forms/crime-report/crime-report.component';
import { ViolationReportComponent } from './forms/violation-report/violation-report.component';
import { MessageBoardComponent } from './forms/message-board/message-board.component';
import { OwnerUpdateComponent } from './forms/owner-update/owner-update.component';
import { UserUpdateComponent } from './forms/user-update/user-update.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';

@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    LoginFormComponent,
    DialogComponent,
    HomeComponent,
    UnitsComponent,
    DetailsComponent,
    FormsComponent,
    WorkOrderComponent,
    NavErrorComponent,
    EditResidentComponent,
    EditVehicleComponent,
    AddVehicleComponent,
    AddResidentComponent,
    ArchRequestComponent,
    CrimeReportComponent,
    ViolationReportComponent,
    MessageBoardComponent,
    OwnerUpdateComponent,
    UserUpdateComponent,
    PasswordResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    LayoutModule,
    AngularMaterialModule,
    MatDialogModule
  ],
  providers: [DataService,SupabaseService,
    {provide: MatDialogRef,useValue:{}}],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [DialogComponent]
})
export class AppModule { }
