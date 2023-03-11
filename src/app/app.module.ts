import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularMaterialModule } from './material.module';
import { LoginFormComponent } from './auth/login-form/login-form.component';

import { SupabaseService } from './services/supabase.service';
import { DataService } from './services/data.service';

import { DialogComponent } from './dialog/alert/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
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
