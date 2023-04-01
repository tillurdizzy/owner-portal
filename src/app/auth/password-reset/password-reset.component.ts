import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})

export class PasswordResetComponent {
  myForm = new FormGroup({
    newPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  submitBtn() {
    var p = this.myForm.value.newPassword.trim();
    this.supabase.updatePassword(p)
  };

  public handleError = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };

  constructor(
    private router: Router,
    private supabase: SupabaseService,
  ) {}

}
