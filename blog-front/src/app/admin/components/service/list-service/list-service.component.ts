import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{Service} from '../../../../models/service';
import{ UserService} from'../../../../services/user.service';
import{ ServiService } from'../../../../services/servi.service';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';

@Component({
  selector: 'list-service',
  templateUrl: './list-service.component.html',
  providers:[UserService, ServiService],
  animations: [fadeLateral]
 
})
export class ListServiceComponent implements OnInit {
   public title : string;
   public  services: Service[];
   public token;
   public url;
   public identity;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _serviceService: ServiService
    

  ){
    this.title='Servicios';
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.url = GLOBAL.url;
    }

    ngOnInit(){
      this.getServices();
    }
    
    getServices(){
      this._serviceService.getServices().subscribe(
            response =>{
                if(response.status == 'success')
                {
                    this.services = response.services;
                }
            },
            error =>{
                console.log(error);
            }
       );
    }


  deleteService(_id){
     //$('#myModal-'+_id).modal('hide');
        this._serviceService.deleteService(this.token, this.identity._id, _id).subscribe(
            response =>{
                if(response.status == 'success')
                {
                        this.getServices();
                  
                  
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