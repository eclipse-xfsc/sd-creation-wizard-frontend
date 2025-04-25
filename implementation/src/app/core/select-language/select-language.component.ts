import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NgModule} from '@angular/core';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss']
  

})
 
export class SelectLanguageComponent {
  public saveUsername:boolean;
 
  constructor(public translate: TranslateService) { 
  }
  public onSaveUsernameChanged(value:boolean){
    if(value){
      this.translate.use('de');
    }
    else{{
      this.translate.use('en');
    }}
}
}
