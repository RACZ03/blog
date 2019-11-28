import { Component } from '@angular/core';
import { UserService} from './services/user.service';
import { Router,ActivatedRoute,Params } from '@angular/router';
import{GLOBAL} from'./services/global';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService]
})

export class AppComponent {


  
}

