import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetSorterComponent } from './alphabet-sorter.component';

describe('AlphabetSorterComponent', () => {
  let component: AlphabetSorterComponent;
  let fixture: ComponentFixture<AlphabetSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlphabetSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphabetSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
