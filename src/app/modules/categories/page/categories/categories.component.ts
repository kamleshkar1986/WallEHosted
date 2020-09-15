import { Component, OnInit, OnDestroy } from '@angular/core';
import { HtmlProviderService } from '@app/core/services/html-provider/html-provider.service';
import { Subscription } from 'rxjs';
import { ImageThumbAttr } from '@app/core/services/html-provider/html-provider.type';
import { Router } from '@angular/router';


enum CollectionType {
  Undefined = 0,
  Category = 1,
  Sorted = 2,
  Colection = 3
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  
  categoryTitle: string = 'Category';
  private htmlProvideSubs: Subscription; 
  private defaultSubSiteURL: string = '/wallpapers/categories/';
  private sortedSubSiteURL: string = '/wallpapers/list/xyz/pos/?q=';
  public isSortingApplied: boolean = false;
  private sortedPageNo: number = 1;
  private sortedLetter: string;

  private findSelector: string = '.wallpapers-box-300x180-2';
  private imgURLSelector: string = 'a:nth-child(1) > img';
  private collURLSelector: string = 'a:nth-child(1)';
  private imgTitleSelector: string = '.wallpapers-box-300x180-2-title';

  private categoryName: string;
  private categoryIndex: string;
  private collType: CollectionType = CollectionType.Undefined; 

  constructor(public htmlProvider: HtmlProviderService, private router: Router) { }  

  ngOnInit(): void {
    this.defaultSort();
  }

  defaultSort() {
    this.findSelector = '.wallpapers-box-300x180-2';
    this.imgURLSelector = 'a:nth-child(1) > img';
    this.collURLSelector = 'a:nth-child(1)';
    this.imgTitleSelector = '.wallpapers-box-300x180-2-title';
    this.isSortingApplied = false;
    this.loadCollection(this.defaultSubSiteURL);
  }

  applySort(sortValue: string) {      
    if(sortValue.toLowerCase() == 'new') {      
      this.defaultSort();
    }
    else {
      this.isSortingApplied = true;     
      if(sortValue == 'next') {
        sortValue = this.sortedLetter;
        this.sortedPageNo++;
      }
      else if(sortValue == 'prev') {
        sortValue = this.sortedLetter;
        if(this.sortedPageNo > 1) {
          this.sortedPageNo--;
        }        
      }
      else {
        this.sortedLetter = sortValue;
      }
      this.findSelector = '.wallpapers-category-div-3';
      this.imgURLSelector = 'a:nth-child(1) > img';
      this.collURLSelector = 'a:nth-child(1)';
      this.imgTitleSelector = '.cat-list-3';     
      this.loadCollection((this.sortedSubSiteURL + sortValue.toLowerCase()).replace('xyz', this.categoryName).replace('pos', this.categoryIndex)+'&page='+this.sortedPageNo);
    }
  }

  loadCollection(siteSubURL: string) {    
    this.htmlProvider.getWebPageHTML(siteSubURL).subscribe();    
    this.htmlProvideSubs = this.htmlProvider.siteHtmlSubject.subscribe(resp => {      
      if(resp == true) {          
        this.htmlProvider.getHighlightImageThumbs(this.findSelector, this.imgURLSelector, this.collURLSelector, this.imgTitleSelector); 
        if(!this.htmlProvider.thumbImgArr[0].img_url) {
          this.sortedPageNo = 0;
          this.applySort('next');
        }
        if(this.collType == CollectionType.Sorted) {
          this.openCollection(this.htmlProvider.thumbImgArr[0]);
        }        
      }
    });  
  }

  openCollection(imgAttr: ImageThumbAttr) { 
    this.categoryTitle = imgAttr.img_title;        
    this.collType = this.evaluateCollectionType(imgAttr.collection_url);    
    if(this.collType == CollectionType.Colection) {
      const collURL=imgAttr.collection_url.split('/').join('#');     
      this.router.navigate(['/collection/' + collURL]);  
    }
    else if(this.collType == CollectionType.Category) {   
      this.categoryName = imgAttr.collection_url.split('/')[2];
      this.categoryIndex = imgAttr.collection_url.split('/')[3];        
      this.loadCollection(imgAttr.collection_url); 
    } 
    else if(this.collType == CollectionType.Sorted) {   
      this.findSelector = '.wallpapers-box-300x180-2';
      this.imgURLSelector = 'a:nth-child(1) > img';
      this.collURLSelector = 'a:nth-child(1)';
      this.imgTitleSelector = '.wallpapers-box-300x180-2-title';
      this.loadCollection(imgAttr.collection_url);       
    }
  }

  evaluateCollectionType(collURL): CollectionType {
    if(collURL.includes('.htm')) {
      return CollectionType.Colection;
    }
    else if (collURL.split('/').length==4 && !collURL.includes('.htm')) {
      return CollectionType.Sorted;
    }  
    else {
      return CollectionType.Category;
    } 
  }

  ngOnDestroy(): void {
    this.htmlProvideSubs.unsubscribe();
  } 
}
