import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{ ServiService} from'../../../../services/servi.service';
import{ UserService } from'../../../../services/user.service';
import{ CategoryService } from'../../../../services/category.service';
import{ Service } from'../../../../models/service';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';



@Component({
  selector: 'admin-add-service',
  templateUrl: './add-service.component.html',
  providers:[ServiService,UserService, UploadService, CategoryService],
  animations: [fadeLateral]
 
})
export class AddServiceComponent implements OnInit {
 public  title : string;
 public service: Service;
 public listaCategory;
 public identity;
 public token;
 public url : string;
 public status: string;
 public error:string;

   public afuConfig ={
     multiple: false,
     formatsAllowed: ".jpg, .png, .gif, .jpeg",
     maxSize: "50",
     uploadAPI : {
       url: GLOBAL.url+'service/upload-avatar',
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
    private _serviceService : ServiService,
    private _userService: UserService,
    private _uploadService : UploadService,
    private _categoryService: CategoryService

  ){
    this.title='Crear servicio';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }
  ngOnInit(){
        
        this.service = new Service(1,this.identity._id,1,'','','',true,'','');
        this.getCategories();
    }
   getCategories(){
     this._categoryService.getCategories().subscribe(
            response =>{
                if(response.status == 'success')
                {
                    this.listaCategory = response.categories;
                }
            },
            error =>{
                console.log(error);
            }
       );
   }
  imageUpload(data){
      let image_data = JSON.parse(data.response);
      this.service.image = image_data.image;
    
  }

  onSubmit(form){
  	console.log(this.service);
    this._serviceService.register(this.token, this.service).subscribe(
    response => {
    	console.log(response);
        if (response.status == "success") {
          this.status = response.status;
          this._router.navigate(['/admin-panel/listado-servicios']);
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
