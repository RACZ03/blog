import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';

import{ CategoryService} from'../../../../services/category.service';
import{ UserService} from'../../../../services/user.service';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'admin-list-categories',
  templateUrl: './list-categories.component.html',
  providers:[CategoryService, UserService],
  animations: [fadeLateral]
 
})
export class ListCategoriesComponent implements OnInit {
   public title : string;
   public categories: Category[];
   public token;
 

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _categoryService : CategoryService,
    private _userService : UserService
    

  ){
    this.title='Categorias';
    this.token = this._userService.getToken();
    }

    ngOnInit(){
      this.getCategories();
    }
    
    getCategories(){
      this._categoryService.getCategories().subscribe(
            response =>{
                if(response.status == 'success')
                {
                    this.categories = response.categories;
                }
            },
            error =>{
                console.log(error);
            }
       );
    }


  deleteCategory(_id){
     //$('#myModal-'+_id).modal('hide');
        this._categoryService.deleteCategory(this.token, _id).subscribe(
            response =>{
                if(response.status == 'success')
                {
                        this.getCategories();
                  
                  
                }else{
                   alert('Error del Servidor')
                }
            },
            error =>{
               alert('Error del Servidor');
            }
       );
   }
   
     
}