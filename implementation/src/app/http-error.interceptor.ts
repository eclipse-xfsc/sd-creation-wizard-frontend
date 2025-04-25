import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

import { Observable, EMPTY, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {MatDialogModule} from "@angular/material/dialog";

import {MatDialog} from "@angular/material/dialog"
import Swal from 'sweetalert2';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: 'Please check your network connection!'+error.error.message
          })

          throw Error("The app component has thrown an error!");

        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          Swal.fire({
            icon: 'error',
            title: 'Error occurred.',
            text: error.error,
          })
          console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
          throw Error("The app component has thrown an error!");

        }

        //to return a new response:
        //return of(new HttpResponse({body: [{name: "Default value..."}]}));

        //to return the error on the upper level:
        //return throwError(error);

        // return nothing:
        return EMPTY;
      })
    );
  }
}
