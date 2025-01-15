/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReportkorimaComponent } from './reportkorima.component';

describe('ReportkorimaComponent', () => {
  let component: ReportkorimaComponent;
  let fixture: ComponentFixture<ReportkorimaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportkorimaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportkorimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
