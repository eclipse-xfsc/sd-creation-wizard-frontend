import { Component, OnInit } from '@angular/core';
import { I18nModule } from '../../i18n/i18n.module';

@Component({
  selector: 'app-starting-page',
  templateUrl: './starting-page.component.html',
  styleUrls: ['./starting-page.component.scss']
})
export class StartingPageComponent implements OnInit {

  getStartedUrl = '';

  constructor() { 
    this.getStartedUrl = '/select-file';
  }

  ngOnInit(): void {
  }

}


