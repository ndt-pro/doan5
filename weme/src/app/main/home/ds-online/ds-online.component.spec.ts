import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsOnlineComponent } from './ds-online.component';

describe('DsOnlineComponent', () => {
  let component: DsOnlineComponent;
  let fixture: ComponentFixture<DsOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
