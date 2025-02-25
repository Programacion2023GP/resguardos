/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReportdepartamentkorimaComponent } from './reportdepartamentkorima.component';

describe('ReportdepartamentkorimaComponent', () => {
  let component: ReportdepartamentkorimaComponent;
  let fixture: ComponentFixture<ReportdepartamentkorimaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportdepartamentkorimaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportdepartamentkorimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
