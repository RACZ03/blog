import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{ PortafolioService} from'../../../../services/portafolio.service';
import{ UserService } from'../../../../services/user.service';
import{ Portafolio } from'../../../../models/portafolio';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';



@Component({
  selector: 'admin-edit-portafolio',
  templateUrl: '../add-portafolio/add-portafolio.component.html',
  providers:[PortafolioService,UserService, UploadService],
  animations: [fadeLateral]
 
})
export class EditPortafolioComponent implements OnInit {
 public  title : string;
 public portafolio: Portafolio;
 public identity;
 public token;
 public url : string;
 public status: string;
 public error:string;
 public is_Edit: boolean;

   public afuConfig ={
     multiple: false,
     formatsAllowed: ".jpg, .png, .gif, .jpeg",
     maxSize: "50",
     uploadAPI : {
       url: GLOBAL.url+'portafolio/upload-avatar',
       headers: {
           "Authorization" : this._userService.getToken()
       }
     },
     theme: "attachPin",
     hideProgressBar: false,
     hideResetBtn: true,
     hideSelectBtn: false,
     attachPinText: 'sube tu avatar de usuario'
   };
  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _portafolioService : PortafolioService,
    private _userService: UserService,
    private _uploadService : UploadService

  ){
    this.title='Editar portafolio';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }
  ngOnInit(){
        this.is_Edit = true;
        this.getPortafolio();
    }
    getPortafolio(){
    //sacar id de la noticia por la url
    this._route.params.subscribe(params => {
      var id = params['_id'];
        //Peticion ajax para sacar los datos de la noticia
        this._portafolioService.getPortafolio(this.token, id).subscribe(
           response =>{
               if(response.status == 'success'){

                 this.portafolio = response.portafolio;
               }else{
                 this._router.navigate(['/admin-panel/listado-portafolios']);
               }
           },
           error =>{
               console.log(error);
           }
        );
    });
  }
   
  imageUpload(data){
      let image_data = JSON.parse(data.response);
      this.portafolio.image = image_data.image;
    
  }

  onSubmit(form){
    this._portafolioService.updatePortafolio(this.token, this.portafolio).subscribe(
    response => {
    	console.log(response);
        if (response.status == "success") {
          this.status = response.status;
          this._router.navigate(['/admin-panel/listado-portafolios']);
          form.reset();
        }
        else{
          this.status = 'error';
        }
     },
     error =>
     {
       this.status = 'error'; 
     });
  
  }

}