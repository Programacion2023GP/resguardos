import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoguardComponent } from './infoguard.component';

describe('InfoguardComponent', () => {
  let component: InfoguardComponent;
  let fixture: ComponentFixture<InfoguardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoguardComponent]
    });
    fixture = TestBed.createComponent(InfoguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
