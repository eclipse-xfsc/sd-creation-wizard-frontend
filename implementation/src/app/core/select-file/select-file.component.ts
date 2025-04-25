import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ShaclFile } from '@models/shacl-file';
import { Shape } from '@models/shape';
import { ApiService } from '@services/api.service';
import { FormfieldControlService } from '@services/form-field.service';
import { Utils } from '@shared/utils';
import { ModalService } from '../_modal';
import Swal from 'sweetalert2';
import {FilesProvider} from "@shared/files-provider";

@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.component.html',
  styleUrls: ['./select-file.component.scss']
})
export class SelectFileComponent implements OnInit {

  files: string[];
  participantFiles: string[] = [];
  serviceFiles: string[];
  defaultFiles: string[];
  coreFiles: string[];
  otherFiles: string[];
  complianceFiles: string[];
  configurationFiles: string[];
  shaclFile: ShaclFile;
  filteredShapes: Shape[];
  requestError: boolean;
  public trigger: number = 0;
  ecosystem: string= "gax-trust-framework";// pass this to getFiles Api
  ecosystemList: string[] = [];

  constructor(private apiService: ApiService, private formFieldService: FormfieldControlService, private router: Router,private modalService: ModalService,
              filesProvider: FilesProvider) {
    this.requestShapes(this.ecosystem);
    this.ecosystemList = filesProvider.getEcosystems();
  }

  ngOnInit(): void { }
  requestShapes(system:string){
    //pass the system string down here
    this.apiService.getFilesCategorized(system).subscribe(res => {
      //this.files = res;
      this.defaultFiles=res?.Resource;
      this.serviceFiles=res?.Service;
      this.participantFiles=res?.Participant;
      this.coreFiles= res?.Core;
      this.complianceFiles= res?.Compliance;
      this.configurationFiles=res?.Configuration;
      this.otherFiles= res?.Other;
    });
  }
  select(name: string): void {
    this.apiService.getJSON(this.ecosystem, name).subscribe(
      res => {
        this.shaclFile = this.formFieldService.readShaclFile(res);
        this.filteredShapes = this.formFieldService.updateFilteredShapes(this.shaclFile);
        if (this.filteredShapes.length > 1) {
          this.router.navigate(['/select-shape'], { state: { file: this.shaclFile } });
        }
        else {
          console.log("this here"+this.shaclFile);
          console.table(this.shaclFile);
          //set description.input value depending on language
          this.updateSelectedShape();
          this.closeModal('upload-modal');
          this.router.navigate(['/form'], { state: { file: this.shaclFile } });
        }
      },
      err => this.requestError = true
    );
  }

  updateSelectedShape(): void {
    const shape = this.filteredShapes[0];
    if (shape !== undefined) {
      this.shaclFile.shapes.find(x => x.name === shape.name).selected = true;
    }
  }

  getFileName(fullFileName: string): string {
      // remove the extension of the file.
      return Utils.removeAfterCharacter(fullFileName);
  }
  openModal(id: string) {
      this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }
  @ViewChild("uploadanimation")uploadanimation:ElementRef;
  @ViewChild("contents")contents:ElementRef;

  file:any;
  onFileSelected(event: any, id: string){
    this.file = event.target.files[0];
    console.log('file',this.file);
    // close modal after recieveing file
    //create load animation if all successful
    this.uploadanimation.nativeElement.setAttribute('begin','definite');
    this.uploadanimation.nativeElement.beginElement();
    this.contents.nativeElement.remove();
    console.log(this.contents.nativeElement.color)
    this.modalService.close(id);

  }
  reload(ecosystem: string){


    document.getElementById("dropbtn").innerText=ecosystem;
    if(ecosystem=="Gaia-X Trust Framework"){
      this.ecosystem="gax-trust-framework";
    }else if(ecosystem=="PLC AAD Trust Framework"){
      this.ecosystem="plc-aad-trust-framework";
    }else if(ecosystem=="GX4FM PLC-AAD"){
      this.ecosystem="gx4fm-plc-aad";
    }else{
      this.ecosystem="trusted-cloud";
    }

    //request updated shapes
    this.requestShapes(this.ecosystem);
    //invoke rerender
    this.trigger++;

  }

  isGx4FmEnabled(){
    return this.ecosystemList.includes('gx4fm-plc-aad');
  }
}
