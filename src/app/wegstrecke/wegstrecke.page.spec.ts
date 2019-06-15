import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WegstreckePage } from './wegstrecke.page';

describe('WegstreckePage', () => {
  let component: WegstreckePage;
  let fixture: ComponentFixture<WegstreckePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WegstreckePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WegstreckePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
