import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router'
import { IUserAccount } from '../../interfaces/iuser';
import { IResidentAccount } from '../../interfaces/iunit';
import { IBasicForm } from 'src/app/interfaces/iforms';

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.scss']
})
export class MessageBoardComponent {
  me = 'MessageBoardComponent';

  userAccount:IUserAccount = { id:0, username: '', role: '', cell: '', email: '', units: [], uuid:'' ,firstname:'',lastname:'',csz:'',street:'',alerts:''};
  ownerAccount: IResidentAccount[]= this.ds.initResidentAccount();
  formData: IBasicForm = {userid:'', date:'1/1/2030',location:'',cell:'', name:'', email:'',category:'',photo:'',type:'',text:''}

  myForm = new FormGroup({
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  submitBtn() {
    let form = this.myForm.value;
    this.formData.type = 'board'
    this.formData.userid = this.userAccount.uuid;
    this.formData.cell = this.userAccount.cell;
    this.formData.email =  this.userAccount.email;
    this.formData.name = this.userAccount.username;
    this.formData.category = form.category;
    this.formData.text = form.description;
    
    this.supabase.insertBasicForm(this.formData,'Message sent!');
  }

 
  ngOnInit(): void {
    this.myForm.reset(); 
    let storedData = this.ds.isUserAuthenticated();
    this.userAccount = storedData.account;
    this.ownerAccount = this.ds.getOwnerAccount();
  }

  public handleError = (control: string, error: string) => {
    return this.myForm.controls[control].hasError(error);
  };


  constructor(private supabase: SupabaseService, private router: Router, 
    private ds: DataService ) {}

}
