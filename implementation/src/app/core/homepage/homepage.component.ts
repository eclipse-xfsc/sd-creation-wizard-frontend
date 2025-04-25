import {Component, OnInit} from '@angular/core';
import {FilesProvider} from '@shared/files-provider';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  cardDescription = '';
  imageUrl = '';
  getStartedUrl = '';
  files: string[];

  constructor(filesProvider: FilesProvider) {
    const hasStaticFiles = filesProvider.gethasStaticFiles();
    this.cardDescription = hasStaticFiles ? 'Select SHACL Shape' : 'Upload SHACL Shape';
    this.imageUrl = hasStaticFiles ? 'assets/images/select-file.png' : 'assets/images/file-upload.png';
    this.getStartedUrl = hasStaticFiles ? '/select-file' : '/upload';
  }

  ngOnInit(): void {
  }

}
