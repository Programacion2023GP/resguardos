/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AutorizeddownsComponent } from './autorizeddowns.component';

describe('AutorizeddownsComponent', () => {
  let component: AutorizeddownsComponent;
  let fixture: ComponentFixture<AutorizeddownsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorizeddownsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizeddownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
