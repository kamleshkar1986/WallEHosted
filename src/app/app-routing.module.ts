import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from '@core/guard/no-auth.guard';
import { ContentBodyComponent } from './layout/content-body/content-body.component';

const routes: Routes = [
  {
    path: '',
    component: ContentBodyComponent,
    canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'home',
        loadChildren: () =>
          import('@modules/home/home.module').then(m => m.HomeModule)
      }, 
      {
        path: 'collection',
        loadChildren: () =>
          import('@modules/collection/collection.module').then(m => m.CollectionModule)
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('@modules/categories/categories.module').then(m => m.CategoriesModule)
      }  
    ]
  },
  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}