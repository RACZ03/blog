import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{Portafolio} from '../../../../models/portafolio';
import{ UserService} from'../../../../services/user.service';
import{ PortafolioService } from'../../../../services/portafolio.service';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';

@Component({
  selector: 'list-portafolio',
  templateUrl: './list-portafolio.component.html',
  providers:[UserService, PortafolioService],
  animations: [fadeLateral]
 
})
export class ListPortafolioComponent implements OnInit {
   public title : string;
   public portafolios: Portafolio[];
   public token;
   public url;
   public identity;
   isAdmin:boolean;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _portafolioService: PortafolioService
    

  ){
    this.title='Portafolios';
    this.token = this._userService.getToken();
    this.identity = this._userService.getIdentity();
    this.url = GLOBAL.url;
    }

    ngOnInit(){
      this.getPortafolios();
      this.isAdmin = this._userService.isAdmin;
    }
    
    getPortafolios(){
      this._portafolioService.getPortafolios().subscribe(
            response =>{
                if(response.status == 'success')
                {
                    this.portafolios = response.portafolios;
                }
            },
            error =>{
                console.log(error);
            }
       );
    }


  deletePortafolio(_id){
     //$('#myModal-'+_id).modal('hide');
        this._portafolioService.deletePortafolio(this.token, this.identity._id, _id).subscribe(
            response =>{
                if(response.status == 'success')
                {
                        this.getPortafolios();
                  
                  
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