import { Component, DoCheck, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'../../../../services/global';
import{News} from '../../../../models/news';
import{ UserService} from'../../../../services/user.service';
import{ NewsService} from'../../../../services/news.service';

import{ UploadService} from'../../../../services/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import{ fadeLateral} from'../../../animations';

@Component({
  selector: 'list-news',
  templateUrl: './list-news.component.html',
  providers:[UserService, NewsService],
  animations: [fadeLateral]
 
})
export class ListNewsComponent implements OnInit {
   public title : string;
   public  news: News[];
   public token;
   public url;
   public identity;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : UserService,
    private _newsService: NewsService
    

  ){
      this.title='Noticias';
      this.token = this._userService.getToken();
      this.identity = this._userService.getIdentity();
      this.url = GLOBAL.url;
    }

    ngOnInit(){
      this.getNews();
    }
    
    getNews(){
      this._newsService.getNews().subscribe(
            response =>{
                if(response.status == 'success')
                {
                    this.news = response.news;
                }
            },
            error =>{
                console.log(error);
            }
       );
    }


  deleteNew(_id){
        this._newsService.deleteNews(this.token, this.identity._id, _id).subscribe(
            response =>{
                if(response.status == 'success')
                {
                        this.getNews();
                  
                  
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