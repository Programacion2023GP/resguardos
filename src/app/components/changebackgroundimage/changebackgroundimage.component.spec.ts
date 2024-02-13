import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangebackgroundimageComponent } from './changebackgroundimage.component';

describe('ChangebackgroundimageComponent', () => {
  let component: ChangebackgroundimageComponent;
  let fixture: ComponentFixture<ChangebackgroundimageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangebackgroundimageComponent]
    });
    fixture = TestBed.createComponent(ChangebackgroundimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
