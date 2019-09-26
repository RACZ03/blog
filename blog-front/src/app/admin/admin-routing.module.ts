import{  NgModule} from '@angular/core';
import{Routes, RouterModule} from '@angular/router';

//Componentes
import {MainComponent} from './components/main/main.component';
import {ListComponent} from './components/list/list.component';
import {AddComponent} from './components/add/add.component';

import { AdminGuard } from '../services/admin.guard';

//Congiguración de rutas

const adminRoutes: Routes = [
    { path: 'admin-panel', 
    component: MainComponent,
    canActivate: [AdminGuard],
    children : [
     
    { path: 'listado', component: ListComponent },
    { path: 'crear', component: AddComponent }
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