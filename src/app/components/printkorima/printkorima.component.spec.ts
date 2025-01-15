/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PrintkorimaComponent } from './printkorima.component';

describe('PrintkorimaComponent', () => {
  let component: PrintkorimaComponent;
  let fixture: ComponentFixture<PrintkorimaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintkorimaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintkorimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
