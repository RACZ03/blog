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
  selector: 'admin-edit-service',
  templateUrl: '../add-service/add-service.component.html',
  providers:[ServiService,UserService, UploadService, CategoryService],
  animations: [fadeLateral]
 
})
export class EditServiceComponent implements OnInit {
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
    this.title='Editar servicio';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }
  ngOnInit(){
        
        this.getCategories();
        this.getService();
    }
    getService(){
    //sacar id de la noticia por la url
    this._route.params.subscribe(params => {
      var id = params['_id'];
        //Peticion ajax para sacar los datos de la noticia
        this._serviceService.getService(this.token, id).subscribe(
           response =>{
               if(response.status == 'success'){

                 this.service = response.service;
               }else{
                 this._router.navigate(['/admin-panel/listado-servicios']);
               }
           },
           error =>{
               console.log(error);
           }
        );
    });
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
    this._serviceService.updateService(this.token, this.service).subscribe(
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
