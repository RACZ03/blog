import{NgModule} from '@angular/core';
import{CommonModule} from '@angular/common';
import{FormsModule} from '@angular/forms';
import{HttpClientModule} from '@angular/common/http';
import{AdminRoutingModule} from './admin-routing.module';





//Componentes
import {MainComponent} from './components/main/main.component';
import {ListComponent} from './components/list/list.component';
import {AddComponent} from './components/add/add.component';



//servicios
import { AdminGuard } from '../services/admin.guard';
import { UserService } from '../services/user.service';


@NgModule({
    declarations:[
        MainComponent,
        ListComponent,
        AddComponent,
       
        
    ],
    imports:[
        CommonModule,
        FormsModule,
        HttpClientModule,
        AdminRoutingModule,
       
      
        
    ],
    providers:[
        AdminGuard,
        UserService
    ]
   
})

export class AdminModule {}