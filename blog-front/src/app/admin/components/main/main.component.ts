import { Component, DoCheck, OnInit } from '@angular/core';
import { UserService} from '../../../services/user.service';

@Component({
  selector: 'admin-main',
  templateUrl: './main.component.html'
 
})
export class MainComponent {
  title = 'Panel';
  public identity;
  isAdmin:boolean;
  


  constructor(
    
    private _userService: UserService

    ){}

    ngOnInit(){
      this.identity = this._userService.getIdentity();
      this.isAdmin = this._userService.isAdmin;
      
     
        
      }
     


}