import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesguardsComponent } from './typesguards.component';

describe('TypesguardsComponent', () => {
  let component: TypesguardsComponent;
  let fixture: ComponentFixture<TypesguardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypesguardsComponent]
    });
    fixture = TestBed.createComponent(TypesguardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
