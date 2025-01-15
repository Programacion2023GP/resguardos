/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReportgroupsguardsComponent } from './reportgroupsguards.component';

describe('ReportgroupsguardsComponent', () => {
  let component: ReportgroupsguardsComponent;
  let fixture: ComponentFixture<ReportgroupsguardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportgroupsguardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportgroupsguardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
