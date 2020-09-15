import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppErrorHandlerService } from './services/apperror-handler.service';
import { ServerHttpInterceptor } from './interceptor/http-interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: ServerHttpInterceptor, multi: true }
  ]
})
export class CoreModule { }
