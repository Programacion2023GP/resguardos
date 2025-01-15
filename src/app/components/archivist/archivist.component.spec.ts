/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ArchivistComponent } from './archivist.component';

describe('ArchivistComponent', () => {
  let component: ArchivistComponent;
  let fixture: ComponentFixture<ArchivistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
