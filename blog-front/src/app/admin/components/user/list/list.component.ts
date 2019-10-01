import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{User} from '../../../../models/user';
import{ UserService} from'../../../../services/user.service';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';

@Component({
  selector: 'admin-list',
  templateUrl: './list.component.html',
  providers:[UserService],
  animations: [fadeLateral]
 
})
export class ListComponent implements OnInit {
   public title : string;
   public users: User[];
   public token;
 

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService

    

  ){
    this.title='Usuarios';
    this.token = this._userService.getToken();
    }

    ngOnInit(){
      this.getUsers();
    }
    
    getUsers(){
      this._userService.getUsers().subscribe(
            response =>{
                if(response.status == 'success')
                {
                    this.users = response.users;
                }
            },
            error =>{
                console.log(error);
            }
       );
    }


  deleteUser(_id){
     //$('#myModal-'+_id).modal('hide');
        this._userService.deleteUser(this.token, _id).subscribe(
            response =>{
                if(response.status == 'success')
                {
                        this.getUsers();
                  
                  
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