import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{ NewsService} from'../../../../services/news.service';
import{ UserService } from'../../../../services/user.service';
import{ News } from'../../../../models/news';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';



@Component({
  selector: 'admin-add-news',
  templateUrl: './add-news.component.html',
  providers:[NewsService,UserService, UploadService],
  animations: [fadeLateral]
 
})
export class AddNewsComponent implements OnInit {
 public  title : string;
 public new: News;
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
       url: GLOBAL.url+'news/upload-avatar',
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
    private _newService : NewsService,
    private _userService: UserService,
    private _uploadService : UploadService

  ){
    this.title='Crear noticia';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }
  ngOnInit(){
        
        this.new = new News(1,this.identity._id,'','','',true,'','');
    }
  imageUpload(data){
      let image_data = JSON.parse(data.response);
      this.new.image = image_data.image;
    
  }

  onSubmit(form){
    this._newService.register(this.token, this.new).subscribe(
    response => {
      console.log(response);
        if (response.status == "success") {
          this.status = response.status;
          this._router.navigate(['/admin-panel/listado-noticia']);
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
