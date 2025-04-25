import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ShaclFile} from '@models/shacl-file';
import {Shape} from '@models/shape';
import {ApiService} from '@services/api.service';
import {FormfieldControlService} from '@services/form-field.service';
import {FileValidator} from '../file-validator';
import { EventEmitter } from '@angular/core';
import { Input,Output } from '@angular/core';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output()
  notify:EventEmitter <boolean> = new EventEmitter();

  @Input() closeModal: (id: string) => void;
  file: File | null = null;
  fileJson: File | null = null;
  allowedExtensions = ['ttl', 'json'];
  form: FormGroup;
  requestError: boolean;
  shaclFileContent: ShaclFile;
  jsonFileContent: Map<string, string>;
  filteredShapes: Shape[];
  private subscription: Subscription | undefined;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private formfieldService: FormfieldControlService
  ) {
    this.form = this.formBuilder.group({
      file: new FormControl('', [Validators.required, FileValidator.fileExtensions(this.allowedExtensions)]),
      fileSource: new FormControl('', [Validators.required, FileValidator.fileExtensions(this.allowedExtensions)]),
      fileJson: new FormControl('', [FileValidator.fileExtensions(this.allowedExtensions)]),
      fileSourceJson: new FormControl('', [FileValidator.fileExtensions(this.allowedExtensions)])
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
  }

  onFileChange(event, fileSourceKey: string): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        [fileSourceKey]: file
      });
    }
  }

  onSubmit(): void {
    if (this.form.get('fileSourceJson').value === "") {
      this.subscription = this.apiService.upload(this.form.get('fileSource').value).subscribe(
        res => {
          console.log(res);
          this.shaclFileContent = this.formfieldService.readShaclFile(res);
          console.log(this.shaclFileContent);
          this.filteredShapes = this.formfieldService.updateFilteredShapes(this.shaclFileContent);
          if (this.filteredShapes.length > 1) {
            this.router.navigate(['/select-shape'], {state: {file: this.shaclFileContent}});
          } else {
            this.updateSelectedShape();
            this.router.navigate(['/form'], {state: {file: this.shaclFileContent}});
          }
        },
        err => this.requestError = true
      );
    } else {
      this.subscription = this.apiService.uploadShaclAndJson(this.form.get('fileSource').value, this.form.get('fileSourceJson').value).subscribe(
        res => {
          console.log("res.shaclModel: ", res.shaclModel);
          console.log("res.matchedSubjects: ", res.matchedSubjects);

          this.jsonFileContent = this.formfieldService.readJsonFile(res.matchedSubjects);
          this.shaclFileContent = this.formfieldService.readShaclFile(res.shaclModel, this.jsonFileContent);

          console.log("shaclFile: ", this.shaclFileContent);
          console.log("jsonFile: ", this.jsonFileContent);

          this.filteredShapes = this.formfieldService.updateFilteredShapes(this.shaclFileContent);
          if (this.filteredShapes.length > 1) {
            this.router.navigate(['/select-shape'], {state: {file: this.shaclFileContent}});
          } else {
            this.updateSelectedShape();
            this.router.navigate(['/form'], {state: {file: this.shaclFileContent}});
          }
        },
        err => {
          this.requestError = true;
        }
      );
    }
    //this.modal.close('upload-modal');
    //console.log("Call closing statement here");
   this.notify.emit(true);
  }

  updateSelectedShape(): void {
    const shape = this.filteredShapes[0];
    if (shape !== undefined) {
      this.shaclFileContent.shapes.find(x => x.name === shape.name).selected = true;
    }
  }
}


