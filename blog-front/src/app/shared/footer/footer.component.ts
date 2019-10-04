import { Component, DoCheck, OnInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../services/global';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public title:string;
  
  public identity;
  public url:string;
  


 
   constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService

    ){
     
      this.url=GLOBAL.url;
     }

     ngOnInit(){
     this.identity = this._userService.getIdentity();
     
       
     }
     ngDoCheck(){
      this.identity = this._userService.getIdentity();
     }

     
 //Cerrar la sesion

     logout(){
      localStorage.clear();
      this.identity=null;
      this._router.navigate(['/']);
     }

}
