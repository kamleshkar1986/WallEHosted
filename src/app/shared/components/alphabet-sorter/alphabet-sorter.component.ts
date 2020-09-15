import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alphabet-sorter',
  templateUrl: './alphabet-sorter.component.html',
  styleUrls: ['./alphabet-sorter.component.css']
})
export class AlphabetSorterComponent implements OnInit {

  @Output() sortValueClick = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  sortByLetterClick(sortingBy: string) {
    this.sortValueClick.emit(sortingBy);
  }
}
