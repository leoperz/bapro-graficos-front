import { Component, OnInit } from '@angular/core';
import {FileSelectDirective, FileUploader} from 'ng2-file-upload';
const uri = 'http://localhost:5500/adjuntarArchivoMultiple';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploader:FileUploader = new FileUploader({url:uri});
  adjuntos:any = [];

  constructor() {
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any)=>{
      this.adjuntos.push(JSON.parse(response));
      
    }
   }

  ngOnInit() {
  }

  aceptar(){
    this.uploader.uploadAll();
  }


}