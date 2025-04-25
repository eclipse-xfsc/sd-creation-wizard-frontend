import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ShaclFile} from '@models/shacl-file';
import {Shape} from '@models/shape';
import {FormfieldControlService} from '@services/form-field.service';


@Component({
  selector: 'app-select-shape',
  templateUrl: './select-shape.component.html',
  styleUrls: ['./select-shape.component.scss'],
})
export class SelectShapeComponent implements OnInit {

  requestSuccess = false;
  routeState: any;
  file: ShaclFile = new ShaclFile();
  shapes: Shape[];
  fromBackLink = false;

  constructor(private router: Router, private formfieldService: FormfieldControlService) {
    this.readObjectDataFromRoute();
    if (this.requestSuccess) {
      this.shapes = this.formfieldService.updateFilteredShapes(this.file);
      console.log(this.shapes);
    }
  }

  ngOnInit(): void {
  }

  readObjectDataFromRoute(): void {
    if (this.router.getCurrentNavigation().extras.state) {
      this.routeState = this.router.getCurrentNavigation().extras.state;
      if (this.routeState) {
        this.file = this.routeState.file;
        this.requestSuccess = true;
      }
    }
  }

  navigate(schema: string): void {
    const shape = this.shapes.find(x => x.schema === schema);
    this.file.shapes.find(x => x.schema === shape.schema).selected = true;
    this.router.navigate(['/form'], {state: {file: this.file}});
  }

}
