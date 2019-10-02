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
   public indentity;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService

    

  ){
    this.title='Usuarios';
    this.token = this._userService.getToken();
    this.indentity = this._userService.getIdentity();
    }

    ngOnInit(){
      this.getUsers();
    }
    
    getUsers(){
      this._userService.getUsers(this.indentity._id).subscribe(
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
        this._userService.deleteUser(this.token, this.indentity._id, _id).subscribe(
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