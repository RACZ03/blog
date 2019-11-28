import{  NgModule} from '@angular/core';
import{Routes, RouterModule} from '@angular/router';

//Componentes
import {MainComponent} from './components/main/main.component';
import { ErrorComponent } from './components/error/error.component';
import {ListComponent} from './components/user/list/list.component';
import {AddComponent} from './components/user/add/add.component';
import {UserEditComponent} from './components/user/user-edit/user-edit.component';
import {AddCategoryComponent} from './components/category/add-category/add-category.component';
import {ListCategoriesComponent} from './components/category/list-categories/list-categories.component';
import {EditCategoryComponent} from './components/category/edit-category/edit-category.component';

import { ListServiceComponent } from './components/service/list-service/list-service.component';
import { AddServiceComponent } from './components/service/add-service/add-service.component';
import{ EditServiceComponent } from './components/service/edit-service/edit-service.component';

import {ListNewsComponent} from './components/news/list-news/list-news.component';
import { AddNewsComponent } from './components/news/add-news/add-news.component';
import { EditNewsComponent } from './components/news/edit-news/edit-news.component';

import {ListPortafolioComponent} from './components/portafolio/list-portafolio/list-portafolio.component';
import { AddPortafolioComponent } from './components/portafolio/add-portafolio/add-portafolio.component';
import { EditPortafolioComponent } from './components/portafolio/edit-portafolio/edit-portafolio.component';
import { AdminGuard } from '../services/admin.guard';

//Congiguración de rutas

const adminRoutes: Routes = [
    { path: 'admin-panel', 
    component: MainComponent,
    canActivate: [AdminGuard],
    children : [
      { path: 'listado', component: ListComponent },
      { path: 'crear', component: AddComponent },
      { path: 'mydata', component: UserEditComponent },
      { path: 'listado-categorias', component: ListCategoriesComponent },
      { path: 'crear-categoria', component: AddCategoryComponent },
      { path: 'edit-categoria/:_id', component: EditCategoryComponent },
      { path: 'listado-noticias', component: ListNewsComponent },
      { path: 'crear-noticia', component: AddNewsComponent },
      { path: 'edit-news/:_id', component: EditNewsComponent},
      { path: 'listado-servicios', component: ListServiceComponent },
      { path: 'crear-service', component: AddServiceComponent },
      { path: 'edit-service/:_id', component: EditServiceComponent },
      { path: 'listado-portafolios', component: ListPortafolioComponent },
      { path: 'crear-portafolio', component: AddPortafolioComponent },
      { path: 'edit-portafolio/:_id', component: EditPortafolioComponent },
      { path: '**', component: ErrorComponent }
    ]
   }
    
  ];

  @NgModule({
      imports:[
      RouterModule.forChild(adminRoutes)
      ],
      exports:[
          RouterModule
      ]

  })
  export class AdminRoutingModule{}