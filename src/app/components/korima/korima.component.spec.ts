/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KorimaComponent } from './korima.component';

describe('KorimaComponent', () => {
  let component: KorimaComponent;
  let fixture: ComponentFixture<KorimaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KorimaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KorimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
