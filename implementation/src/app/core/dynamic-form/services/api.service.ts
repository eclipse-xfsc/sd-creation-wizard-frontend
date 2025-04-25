import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Utils} from '@shared/utils';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import Data from '../mock/form.mock.json';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private httpClient: HttpClient, public translate: TranslateService) {
  }

  getFieldContraints(acceptType: string = 'application/json'): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': acceptType
      })
    };
    return this.httpClient.get<any>(`${environment.apiUrl}/demo`);
  }

  // Can be used for development
  getFieldsFromFile() {
    return Data;
  }

  upload(file: File): Observable<any> {
    const apiUrl = Utils.controlUrl(environment.apiUrl);
    const data = new FormData();
    data.append('file', file);
    return this.httpClient.post(`${apiUrl}/convertFile`, data);
  }

  uploadShaclAndJson(file: File, jsonFile: File): Observable<any> {
    const apiUrl = Utils.controlUrl(environment.apiUrl);
    const data = new FormData();
    data.append('file', file);
    data.append('jsonFile', jsonFile);
    return this.httpClient.post(`${apiUrl}/convertAndPrefillFile`, data);
  }

  getFiles(): Observable<any> {
    const apiUrl = Utils.controlUrl(environment.apiUrl);
    return this.httpClient.get(`${apiUrl}/getAvailableShapes`);
  }
  getFilesCategorized(system): Observable<any> {
    const apiUrl = Utils.controlUrl(environment.apiUrl);
    return this.httpClient.get(`${apiUrl}/getAvailableShapesCategorized?ecosystem=`+system);
  }

  getJSON(ecosystem: string, name: string): Observable<any> {
    const apiUrl = Utils.controlUrl(environment.apiUrl);
    const params = new HttpParams().set('ecosystem', ecosystem).set('name', name);
    //incase of choosing language through the link .set('lan',this.translate.currentLang)
   
    return this.httpClient.get(`${apiUrl}/getJSON`, {params});
  }
}
