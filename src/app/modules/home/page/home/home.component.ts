import { Component, OnInit, OnDestroy } from '@angular/core';
import { HtmlProviderService } from '@app/core/services/html-provider/html-provider.service'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ImageThumbAttr } from '@app/core/services/html-provider/html-provider.type';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  htmlProvideSubs: Subscription; 
  thumbImgArr: ImageThumbAttr[] = [] as ImageThumbAttr[];  
  private siteSubURL: string = ''; 

  constructor(public htmlProvider: HtmlProviderService, private router: Router) { } 

  ngOnInit(): void {      
    this.htmlProvider.getWebPageHTML(this.siteSubURL).subscribe();
    this.htmlProvideSubs = this.htmlProvider.siteHtmlSubject.subscribe(resp => {
      if(resp == true) { 
        const findSelector: string = '.wall_div_300:nth-child(1) ul > li';
        const imgURLSelector: string = 'a:nth-child(1) > img';
        const collURLSelector: string = 'a:nth-child(1)';
        const imgTitleSelector: string = 'span';
        this.htmlProvider.getHighlightImageThumbs(findSelector, imgURLSelector, collURLSelector, imgTitleSelector);  
        //this.htmlProvider.getHighlightImageThumbs(); 
      }
    })      
  }

  ngOnDestroy(): void {
    
  }

  openCollection(imgAttr: ImageThumbAttr) {   
    const collURL=imgAttr.collection_url.split('/').join('#'); 
    console.log(collURL);
    this.router.navigate(['/collection/' + collURL]);  
  }
}
