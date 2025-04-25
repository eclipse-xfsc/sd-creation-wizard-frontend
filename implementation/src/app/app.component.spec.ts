import {HttpClientModule} from '@angular/common/http';
import {async, TestBed} from '@angular/core/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DynamicFormArrayComponent} from '@components/dynamic-form-array/dynamic-form-array.component';
import {DynamicFormInputComponent} from '@components/dynamic-form-input/dynamic-form-input.component';
import {DynamicFormOrComponent} from '@components/dynamic-form-or/dynamic-form-or.component';
import {ShowErrorsComponent} from '@components/show-errors/show-errors.component';
import {NumericDirective} from '@directives/numeric.directive';
import {DynamicFormComponent} from './core/dynamic-form/dynamic-form.component';
import {FileUploadComponent} from './core/file-upload/component/file-upload.component';
import {HomepageComponent} from './core/homepage/homepage.component';
import {MaterialModule} from './material.module';
import {FilesProvider} from '@shared/files-provider';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        FlexLayoutModule
      ],
      declarations: [
        AppComponent,
        DynamicFormComponent,
        DynamicFormInputComponent,
        ShowErrorsComponent,
        DynamicFormArrayComponent,
        NumericDirective,
        DynamicFormOrComponent,
        FileUploadComponent,
        HomepageComponent
      ],
      providers: [FilesProvider]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Validate Instance Creator'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Validate Instance Creator');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('SD CREATION WIZARD');
  });
});

