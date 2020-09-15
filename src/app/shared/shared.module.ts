import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ImageGridComponent } from './components/image-grid/image-grid.component';
import { AlphabetSorterComponent } from './components/alphabet-sorter/alphabet-sorter.component';


@NgModule({
  declarations: [ImageGridComponent, AlphabetSorterComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    CommonModule,
    ImageGridComponent,
    AlphabetSorterComponent
  ]
})
export class SharedModule { }
