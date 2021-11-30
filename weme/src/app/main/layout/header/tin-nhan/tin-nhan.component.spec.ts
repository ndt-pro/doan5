import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinNhanComponent } from './tin-nhan.component';

describe('TinNhanComponent', () => {
  let component: TinNhanComponent;
  let fixture: ComponentFixture<TinNhanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinNhanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinNhanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
