import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DynamicFormComponent} from './core/dynamic-form/dynamic-form.component';
import {
  DynamicFormInputComponent
} from './core/dynamic-form/components/dynamic-form-input/dynamic-form-input.component';
import {ShowErrorsComponent} from './core/dynamic-form/components/show-errors/show-errors.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {
  DynamicFormArrayComponent
} from './core/dynamic-form/components/dynamic-form-array/dynamic-form-array.component';
import {NumericDirective} from '@directives/numeric.directive';
import {DynamicFormOrComponent} from './core/dynamic-form/components/dynamic-form-or/dynamic-form-or.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormfieldControlService} from '@services/form-field.service';
import {ValidationControlService} from '@services/validation.service';
import {ApiService} from '@services/api.service';
import {FileUploadComponent} from './core/file-upload/component/file-upload.component';
import {HomepageComponent} from './core/homepage/homepage.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SelectShapeComponent} from './core/select-shape/select-shape.component';
import {ExpandedFieldsComponent} from './core/dynamic-form/components/expanded-fields/expanded-fields.component';
import {DatePipe} from '@angular/common';
import {DynamicFormOrArrayComponent} from '@components/dynamic-form-or-array/dynamic-form-or-array.component';
import {
  DynamicSelfLoopsComponent
} from './core/dynamic-form/components/dynamic-self-loops/dynamic-self-loops.component';
import {DynamicFormInComponent} from './core/dynamic-form/components/dynamic-form-in/dynamic-form-in.component';
import {SelectFileComponent} from './core/select-file/select-file.component';
import {FilesProvider} from '@shared/files-provider';

import { StartingPageComponent } from './core/starting-page/starting-page.component';

import { ModalModule } from './core/_modal';
import { I18nModule } from './i18n/i18n.module';
import { SelectLanguageComponent } from './core/select-language/select-language.component';
import { NgxRerenderModule } from 'ngx-rerender';

import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './shared/custom-route-reuse-strategy'

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpErrorInterceptor } from './http-error.interceptor';

export function filesProviderFactory(provider: FilesProvider) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    DynamicFormInputComponent,
    ShowErrorsComponent,
    DynamicFormArrayComponent,
    NumericDirective,
    DynamicFormOrComponent,
    FileUploadComponent,
    HomepageComponent,
    SelectShapeComponent,
    ExpandedFieldsComponent,
    DynamicFormOrArrayComponent,
    DynamicSelfLoopsComponent,
    DynamicFormInComponent,
    SelectFileComponent,
    StartingPageComponent,
    SelectLanguageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    ModalModule,
    I18nModule,
    NgxRerenderModule
   
  ],
  providers: [FormfieldControlService, ValidationControlService, ApiService, DatePipe, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true,
  },
    FilesProvider, {provide: APP_INITIALIZER, useFactory: filesProviderFactory, deps: [FilesProvider], multi: true},
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

