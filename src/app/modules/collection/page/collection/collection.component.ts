import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HtmlProviderService } from '@core/services/html-provider/html-provider.service';
import { ImageThumbAttr } from '@core/services/html-provider/html-provider.type';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit, OnDestroy {

  htmlProvideSubs: Subscription;  
  thumbImgArr: ImageThumbAttr[] = [];
  fileUrl: any;

  constructor(private htmlProvider: HtmlProviderService, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }
  
  ngOnInit(): void {    
    this.route.paramMap.subscribe(params => {        
      this.htmlProvider.getWebPageHTML(params.get("coll-path").split('#').join('/') + '?high=5').subscribe();     
    });

    this.htmlProvideSubs = this.htmlProvider.siteHtmlSubject.subscribe(resp => {
      if(resp == true) {  
        this.htmlProvider.getCollectionFirstImgURL()
        const firstImgIdx: number = this.getFirstIngSeqNo(this.htmlProvider.firstCollectionImgURL);       

        const collectionName: string = this.getCollectionNameFromURL(this.htmlProvider.firstCollectionImgURL);      
        for(var imgSeq = firstImgIdx; imgSeq >= 0; imgSeq--) { 
          const imgThumbURL: string = this.htmlProvider.firstCollectionImgURL
                                        .split('-' + firstImgIdx.toString())
                                        .join('-' + imgSeq.toString())
                                        .replace('full5','medium1')
                                        .replace('media1','media');          
                  
          const thumbImg: ImageThumbAttr = { } as ImageThumbAttr;
          thumbImg.img_url = imgThumbURL;
          thumbImg.img_title = (imgSeq + 1) + ' ' + collectionName;
          thumbImg.download_url = thumbImg.img_url.replace('medium1','full5').replace('media','media1');  
          this.thumbImgArr.push(thumbImg);                                      
        }        
      }
    });     
  }

  getCollectionNameFromURL(imgURL: string): string {
    return decodeURI(imgURL.split('/')[5]);
  }

  getFirstIngSeqNo (imgURL: string): number {
    var leafname= imgURL.split('\\').pop().split('/').pop();   
    var matches = leafname.match(/(\d+)/);               
    return parseInt(matches[0]);    
  }

  downloadWallPapers() {    
    for(var i = 0; i < this.thumbImgArr.length; i++) {
      if(i % 11 === 0 && i > 0) {
        this.wait(3000);       
      }
      this.downloadImg(this.thumbImgArr[i]);
    } 
  }

  downloadImg(imgThumbItem: ImageThumbAttr) {   
    let file = imgThumbItem.download_url.replace('https://media1.santabanta.com','/media.santabanta');  
    let qualityIdx = 5; 
    while(qualityIdx >= 1) {      
      if(this.imageExists(file)) {        
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');   
        a.href = file;
        a.download = file.split('\\').pop().split('/').pop();         
        a.click();
        URL.revokeObjectURL(file.toString());
        a.remove(); 
        break; 
      }
      else {
        file = file.replace('/full' + qualityIdx + '/','/full' + (qualityIdx - 1) + '/');
        qualityIdx--;        
      }      
    }     
  }

  imageExists(image_url){   
    image_url = image_url.replace('https://media.santabanta.com','/thumb.santabanta');   
    var http = new XMLHttpRequest();  
    http.open('HEAD', image_url, false); 
    http.send();  
    return http.status != 404;  
  } 

  private wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

  ngOnDestroy(): void {
    this.htmlProvideSubs.unsubscribe();
  }
}
