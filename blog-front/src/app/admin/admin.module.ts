import{NgModule} from '@angular/core';
import{CommonModule} from '@angular/common';
import{FormsModule} from '@angular/forms';
import{HttpClientModule} from '@angular/common/http';
import{AdminRoutingModule} from './admin-routing.module';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import { AngularFileUploaderModule } from "angular-file-uploader";

//Componentes
import {MainComponent} from './components/main/main.component';
//Componentes de user
import {ListComponent} from './components/user/list/list.component';
import {AddComponent} from './components/user/add/add.component';
import {UserEditComponent} from './components/user/user-edit/user-edit.component';

//componentes de category
import {ListCategoriesComponent} from './components/category/list-categories/list-categories.component';
import {AddCategoryComponent} from './components/category/add-category/add-category.component';
import {EditCategoryComponent} from './components/category/edit-category/edit-category.component';
//Componentes de services
import { ListServiceComponent } from './components/service/list-service/list-service.component';
import { AddServiceComponent } from './components/service/add-service/add-service.component';
import { EditServiceComponent } from './components/service/edit-service/edit-service.component';

//Componente de noticias
import { ListNewsComponent } from './components/news/list-news/list-news.component';

//servicios
import { AdminGuard } from '../services/admin.guard';
import { UserService } from '../services/user.service';
import { AddNewsComponent } from './components/news/add-news/add-news.component';
import { EditNewsComponent } from './components/news/edit-news/edit-news.component';
import { ErrorComponent } from './components/error/error.component';


@NgModule({
    declarations:[
        MainComponent,
        ListComponent,
        AddComponent,
        UserEditComponent,
        ListCategoriesComponent,
        AddCategoryComponent,
        EditCategoryComponent,
        ListNewsComponent,
        ListServiceComponent,
        AddServiceComponent,
        EditServiceComponent,
        AddNewsComponent,
        EditNewsComponent,
        ErrorComponent,
    ],
    imports:[
        CommonModule,
        FormsModule,
        HttpClientModule,
        AdminRoutingModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        AngularFileUploaderModule
    ],
    providers:[
        AdminGuard,
        UserService
    ]
   
})

export class AdminModule {}