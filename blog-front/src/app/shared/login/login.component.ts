import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{UserService} from'../../services/user.service';
import{User} from '../../models/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers:[UserService]

})


export class LoginComponent implements OnInit {
    public title: String;
    public user:User;

    public identity;
    public error:string;
    public token;
    public status:string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService
    ){
      this.title = 'Identificate';
      this.user = new User(1,'','','','','','',true,'','');
    }

    ngOnInit(){
     //console.log('Login Cargado');
    //console.log(this._userService.getIdentity());
    //console.log(this._userService.getToken());
    }

    onSubmit(loginForm){
         //loguear al usaurio y obtener el objeto
        this._userService.singup(this.user).subscribe( 
          res => {
              this.identity = res.user;
              //this.user = new User('','','','','','ROLE_USER','');
              
              if (!this.identity || !this.identity._id) {
               
                alert('El usuario no se ha logueado');
               
              } else {
                 //mostrar el identity
                 //vaciar contraseña
                 //se podría hacer desde el back
                 this.identity.password = '';
                 
                 localStorage.setItem('identity', JSON.stringify(this.identity));
                  
                 //conseguir el token
                this._userService.singup(this.user, 'true').subscribe( 
                    res => {
                        this.token = res.token;
                       // this.user = new User('','','','','','ROLE_USER','');
                       
                        if (this.token.length<=0) {
                          alert("El token no se ha generado");
                        
                        } else {
                            localStorage.setItem('token',this.token);
                            this.status='success';

                            this._router.navigate(['/']);
                           
                         }
                    },
          error =>{
              console.log(<any>error);
          }
       );
    }
  },
         error =>{
         var errorMessage =<any>error;
         if(errorMessage != null){
             var body = JSON.stringify(error._body);
             this.status='error';

         }
       }
    );
 }



}
