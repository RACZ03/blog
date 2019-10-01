import { Component, OnInit } from '@angular/core';
import{ User} from'../../../../models/user';
import  {UserService} from '../../../../services/user.service';
import { GLOBAL} from '../../../../services/global';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

	public page_title: string;
	public user: User;
	public identity;
	public token;
	public status;
  public url;
  public headers;

 
 public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png, .gif, .jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:GLOBAL.url+'user/upload-avatar',
      headers: {
         "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText:'Sube tu avatar de usuario' 
};


  constructor(
  	private _userService: UserService
  	){ 
  this.page_title = 'Ajuste de usuario'; 
  this.user = new User(1, '', '', '', '', '', '', true,'','');
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getToken();
  this.url = GLOBAL.url;
  // Rellenar objeto usuario
  this.user = new User(
  this.identity._id,
  this.identity.name,
  this.identity.surname,
  this.identity.email,'',
  this.identity.image,
  this.identity.role,true,'','');
  }

  ngOnInit() {
  }

  onSubmit(form){
  this._userService.update(this.user).subscribe(
  response => {
    if(response && response.status){
    	this.status = 'success';
         // Actualizar usuario en sesion 
         if(response.user.name){
         	this.user.name = response.user.name;
         }
         if(response.user.surname){
         	this.user.surname = response.user.surname;
         }
         if(response.user.email){
         	this.user.email = response.user.email;
         }
         if(response.user.role){
         	this.user.role = response.user.role;
         }
         if(response.user.image){
         	this.user.image = response.user.image;
         }
    	this.identity = this.user;
    	localStorage.setItem('identity', JSON.stringify(this.identity));
    }
    else{
    	this.status = 'error';
    }
  },
  error => {
  	this.status = 'error'
  	console.log(<any>error);
  }

  	);
  }

  avatarUpload(datos){
  let data = JSON.parse(datos.response);
  this.user.image = data.image;
  	
  }

}
