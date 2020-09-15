import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageThumbAttr } from '@app/core/services/html-provider/html-provider.type';

@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css']
})
export class ImageGridComponent implements OnInit {

  @Input() title: string;
  @Input() thumbImgArr: ImageThumbAttr[] = [] as ImageThumbAttr[];
  @Input() gridActionName: string;
  @Input() showPrevNextBtn: boolean = false;

  @Output() thumbImgClick = new EventEmitter<ImageThumbAttr>();
  @Output() gridActionClick = new EventEmitter<string>();
  @Output() prevNextClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  openCollection(imgThumbAttr: ImageThumbAttr) {
    this.thumbImgClick.emit(imgThumbAttr);
  }

  gridWideAction() {
    this.gridActionClick.emit();
  }

  nextClick() {
    this.prevNextClick.emit('next');
  }

  prevClick() {
    this.prevNextClick.emit('prev');
  }

  imageExists(image_url): boolean{ 
    //console.log(image_url);
    image_url = image_url.replace('https://media.santabanta.com','/thumb.santabanta');   
     var http = new XMLHttpRequest(); 
 
     http.open('HEAD', image_url, false); 
     http.send(); 
    //console.log(http.status != 404);
    return http.status != 404;  
  } 

}
