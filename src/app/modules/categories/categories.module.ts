import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './page/categories/categories.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,  
    SharedModule,         
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
