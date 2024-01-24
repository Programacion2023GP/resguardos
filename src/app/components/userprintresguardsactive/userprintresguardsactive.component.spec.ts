import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprintresguardsactiveComponent } from './userprintresguardsactive.component';

describe('UserprintresguardsactiveComponent', () => {
  let component: UserprintresguardsactiveComponent;
  let fixture: ComponentFixture<UserprintresguardsactiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserprintresguardsactiveComponent]
    });
    fixture = TestBed.createComponent(UserprintresguardsactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
