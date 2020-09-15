import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { ImageThumbAttr } from './html-provider.type';
import * as $ from 'jquery' 

@Injectable({
  providedIn: 'root'
})
export class HtmlProviderService {

  private siteHTML: string; 
  thumbImgArr: ImageThumbAttr[] = [] as ImageThumbAttr[];
  firstCollectionImgURL: string;
  collectionURL: string;

  public siteHtmlSubject = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  getWebPageHTML(resPath: string) {  
    const thisUrl: string = '/santabanta' + resPath;    
    return this.http
    .get(thisUrl ,{responseType: 'text'})
    .pipe(
        map(responseData => {  
          this.siteHTML = responseData;                
          this.siteHtmlSubject.next(true);  
          //console.log(this.siteHTML);        
        }
      ),
      catchError(errorResp => {
          //We can audit or log error or other error handling tasks 
          //before sending to UI level
          //and then throw error as an observablke
          //console.log(errorResp.error);
          if(errorResp.status == 429) {
              
          }
          return throwError(errorResp);
        })  
      )         
    }

    getHighlightImageThumbs(findSelector: string, imgURLSelector: string, collURLSelector: string, imgTitleSelector: string) { 
      this.thumbImgArr = [];    
      let parsedHtml = $.parseHTML(this.siteHTML);     
      $(parsedHtml).find(findSelector).each((index, element) => {         
        let thumbImage: ImageThumbAttr = {} as ImageThumbAttr; 
        thumbImage.img_url = $(element).find(imgURLSelector).attr('src')?.replace('/small/','/medium1/'); 
        if(!thumbImage.img_url || thumbImage.img_url.includes('/test/')) {     
          thumbImage.img_url = $(element).find(imgURLSelector).attr('data-src');
        }  
        thumbImage.collection_url = $(element).find(collURLSelector).attr('href'); 
        thumbImage.img_title = $(element).find(imgTitleSelector).text();  
        this.thumbImgArr.push(thumbImage);           
      });       
    }

    getCollectionFirstImgURL() {         
      this.thumbImgArr = [];
      let parsedHtml = $.parseHTML(this.siteHTML); 
      this.firstCollectionImgURL = $(parsedHtml).find('.wallpaper-big-1-img > a').attr('href');
    }
}
