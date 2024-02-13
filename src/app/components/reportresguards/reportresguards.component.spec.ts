import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportresguardsComponent } from './reportresguards.component';

describe('ReportresguardsComponent', () => {
  let component: ReportresguardsComponent;
  let fixture: ComponentFixture<ReportresguardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportresguardsComponent]
    });
    fixture = TestBed.createComponent(ReportresguardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
