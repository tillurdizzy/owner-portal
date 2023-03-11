import { Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  dialogTitle:string;
  dialogMessage: string;
  showInput: Boolean = false;
  btnLabel: string = 'Submit';
  forgot: string = 'test.com';

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) injectedData) {

      this.dialogTitle = injectedData.title;
      this.dialogMessage = injectedData.message;
      if(injectedData.input != null){
        this.showInput = injectedData.input;
      }
      if(injectedData.button != null){
        this.btnLabel = injectedData.button;
      }
      
    }

    save() {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}


