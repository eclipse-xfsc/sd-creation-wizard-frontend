import {Component} from '@angular/core';
import {FilesProvider} from '@shared/files-provider';
import { I18nModule } from './i18n/i18n.module';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Validate Instance Creator';
  hasStaticFiles = false;

  constructor(filesProvider: FilesProvider,public translate: TranslateService) {
    
    this.hasStaticFiles = filesProvider.gethasStaticFiles();

  }

}

