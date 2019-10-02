import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{ UserService} from'../../../../services/user.service';
import{ User} from'../../../../models/user';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';



@Component({
  selector: 'admin-add',
  templateUrl: './add.component.html',
  providers:[UserService, UploadService],
  animations: [fadeLateral]
 
})
export class AddComponent implements OnInit {
 public  title : string;
 public user: User;
 public identity;
 public token;
 public url : string;
 public status: string;
 public error:string;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _uploadService : UploadService

  ){
    this.title='Crear usuario';
    this.user = new User(1, '', '', '', '', '', '', true,'','');
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }
  ngOnInit(){
    }

  onSubmit(form){
    this._userService.register(this.identity._id,this.user).subscribe(
    response => {
        if (response.status == "success") {
          this.status = response.status;
          this._router.navigate(['/admin-panel/listado']);
          form.reset();
        }
        else{
          this.status = 'error';
          alert('Error del Servidor')
        }
     },
     error =>
     {
       this.status = 'error'; 
     });
  
  }
  

    public filesToUpload: Array<File>;

  fileChangeEvent(fileInput: any ){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    

  }

}