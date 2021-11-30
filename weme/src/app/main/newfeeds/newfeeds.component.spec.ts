import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewfeedsComponent } from './newfeeds.component';

describe('NewfeedsComponent', () => {
  let component: NewfeedsComponent;
  let fixture: ComponentFixture<NewfeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewfeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewfeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
