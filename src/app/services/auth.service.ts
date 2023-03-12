/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { createClient, SupabaseClient, User , Session, AuthChangeEvent} from '@supabase/supabase-js'
import { BehaviorSubject, Observable } from 'rxjs'
import { IProfile } from '../interfaces/iprofile';
import { IVehicle } from '../interfaces/ivehicle';
import { environment } from '../../environments/environment';
//import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private supabase: SupabaseClient
  //*private vehicle:IVehicle;
  private vehicles = [];
  
  
  private currentUser: BehaviorSubject < User | boolean > = new BehaviorSubject(false);
  public currentUser$ = this.currentUser.asObservable();

  //Starts out true... if a profile exists it becomes User... if no profile yet... becomes false
  private userProfile: BehaviorSubject < IProfile | boolean> = new BehaviorSubject(true);
  public userProfile$ = this.userProfile.asObservable();

  private myVehicles: BehaviorSubject < IVehicle[] > = new BehaviorSubject([]);
  public myVehicles$ = this.myVehicles.asObservable();



  private uNum:number = 0;
  private userType:string = '';
  

  async loadUser() {
    if (this.currentUser.value) {
      // User is already set, no need to do anything else
      return
    }
    const user = await this.supabase.auth.getUser()

    if (user.data.user) { // returns null 
      this.currentUser.next(user.data.user)
    } else {
      this.currentUser.next(false)
    }
  };

  public authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void): any {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getUserProfile(userID){
    console.log("AuthService > getUserProfile() ");
    let { data, error }  =  await this.supabase.from('profiles').select().eq('user', userID).single();
    if(!error){
      this.uNum = data['unit'];
      var aProfile:IProfile = { 
      id:data['id'],
      unit:data['unit'],
      email:data['email'],
      cell:data['cell'],
      lastname:data['lastname'],
      type:data['type'],
      firstname:data['firstname'],
      lease:data['lease']};

      this.userProfile.next(aProfile);

      this.userType = data['type'];

      this.getUserVehicles();

    }else{
      this.userProfile.next(false)
      //alert("AuthService getProfile ERROR " + JSON.stringify(error));
      //406 just means no profile found... THIS SHOULD NEVER HAPPEN
      this.signOut();
    }
   
  };

  //***** Vehicles ******\\


  async getUserVehicles(){
    console.log("AuthService > getUserVehicles()");
    this.myVehicles.next([]);
    this.vehicles = [];
    var u = this.uNum;
    let { data, error } = await this.supabase.from('parking').select('*').eq('unit', u);
      if(!error){
        for(var i = 0; i < data.length; i++){
          this.vehicles.push(data[i]);
        }
        this.myVehicles.next(this.vehicles);
      }
  };

  async updateVehicle(obj:IVehicle, s:number){
     const { error } = await this.supabase
      .from('parking')
      .update(obj)
      .match({ space: s })
      if(error){
        alert(error.message)
      }else{
        //this.getUserVehicles(this.userProfile.user.);
      }
  };

  /*async fetchOwnerData(userID){
    console.log("SupabaseService > fetchOwnerData() ");
    let { data, error }  =  await this.supabase.from('owners').select().eq('userid', userID).single();
    if(!error){
      var address:IAddress = {
        street:data.street,
        city:data.city,
        state:data.state,
        zip:data.zip};
      this.ownerAddress.next(address);
    }else{
      /// if user has not submitted adress yet it will error with no rows selected
      this.ownerAddress.next({street:'',city:'',state:'',zip:''});
    }
  }*/

  signUp(credentials: { email:string, password:string }) {
    console.log("AuthService > Supabase > signUp()" + JSON.stringify(credentials));
    return this.supabase.auth.signUp(credentials)
  };

  signIn(credentials: { email:string, password:string }) {
    console.log("AuthService > Supabase > signIn() " + JSON.stringify(credentials));
    return this.supabase.auth.signInWithPassword(credentials)
  };

  sendPwReset(email:string) {
    return this.supabase.auth.resetPasswordForEmail(email)
  };

  async signOut() {
    await this.supabase.auth.signOut()
    this.router.navigateByUrl('/', { replaceUrl: true })
  };

  getCurrentUser(): Observable<User | boolean> {
    return this.currentUser.asObservable()
  };

  getCurrentUserId(): string{
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id
    } else {
      return "";
    }
  };

  signInWithEmail(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  constructor(private router: Router) {

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    //Error 401
    // this console error just means we do not have a currentUser so set to false
    console.log("AuthService > constructor() ");
    this.supabase.auth.onAuthStateChange((event:AuthChangeEvent, sess:Session | null) => {
      console.log('Begin: AuthService > onAuthStateChange = ' + event + " > currentUser = " + (this.currentUser.value as User).id);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        let s = sess;
        if(s != null){
          var u:User = s.user;
          this.currentUser.next(u);
          this.getUserProfile(this.getCurrentUserId());
         
        } 
      } else {
        this.currentUser.next(false);
      }
      console.log('End: AuthService > onAuthStateChange = ' + event + " > currentUser = " + (this.currentUser.value as User).id)
    })

    // Trigger initial session load
    this.loadUser()
  };
};