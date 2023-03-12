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
import { UnitListComponent } from './units/unit-list/unit-list.component';
import { FormsComponent } from './forms/forms/forms.component';
import { WorkOrderComponent } from './forms/work-order/work-order.component';
import { NavErrorComponent } from './misc/nav-error/nav-error.component';

@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    LoginFormComponent,
    DialogComponent,
    HomeComponent,
    UnitsComponent,
    DetailsComponent,
    UnitListComponent,
    FormsComponent,
    WorkOrderComponent,
    NavErrorComponent
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
