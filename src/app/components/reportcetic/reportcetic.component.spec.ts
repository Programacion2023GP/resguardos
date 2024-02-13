import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportceticComponent } from './reportcetic.component';

describe('ReportceticComponent', () => {
  let component: ReportceticComponent;
  let fixture: ComponentFixture<ReportceticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportceticComponent]
    });
    fixture = TestBed.createComponent(ReportceticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
