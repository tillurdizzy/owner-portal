import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {

  cancelBackBtn(){
    this.router.navigate(['/home']);
  }

  constructor(private router: Router) {}
}
