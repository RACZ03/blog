import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{ CategoryService} from'../../../../services/category.service';
import{UserService} from'../../../../services/user.service';
import{ Category} from'../../../../models/category';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';



@Component({
  selector: 'admin-edit-category',
  templateUrl: '../add-category/add-category.component.html',
  providers:[CategoryService, UploadService],
  animations: [fadeLateral]
 
})
export class EditCategoryComponent implements OnInit {
 public  title : string;
 public category: Category;
 public identity;
 public token;
 public url : string;
 public status: string;
 public error:string;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _categoryService : CategoryService,
    private _uploadService : UploadService,
    private _userService : UserService

  ){
    this.title='Editar categoria';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }
  ngOnInit(){
  	this.getCategory();
    }
   getCategory(){
    //sacar id de la noticia por la url
    this._route.params.subscribe(params => {
      var id = params['_id'];
        //Peticion ajax para sacar los datos de la noticia
        this._categoryService.getCategory(id).subscribe(
           response =>{
               if(response.status == 'success'){

                 this.category = response.category;
               }else{
                 this._router.navigate(['/admin-panel/listado-categorias']);
               }
           },
           error =>{
               console.log(error);
           }
        );
    });
  }
  onSubmit(form){
    this._categoryService.updateCategory(this.token,this.category).subscribe(
    response => {
        if (response.status == "success") {
          this.status = response.status;
          this._router.navigate(['/admin-panel/listado-categorias']);
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
  

    public filesToUpload: Array<File>;

  fileChangeEvent(fileInput: any ){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    

  }

}
