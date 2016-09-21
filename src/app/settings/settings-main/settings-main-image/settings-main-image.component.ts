import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import * as Cropper from 'cropperjs';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-settings-main-image',
  templateUrl: './settings-main-image.component.html',
  styleUrls: ['./settings-main-image.component.scss', '../../../../../node_modules/cropperjs/dist/cropper.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsMainImageComponent implements OnInit, OnDestroy {

  public src: any;
  public load: boolean = false;
  private _cropper: Cropper;

  @ViewChild('preview') preview: ElementRef;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onCancel();
  }

  public onChange(files: any) {
    let reader = new FileReader();

    reader.addEventListener("load", () => {
      this.src = reader.result;
      setTimeout(() => {
        this._cropper = new Cropper(this.preview.nativeElement, {
          aspectRatio: 1,
          viewMode: 2,
          minContainerWidth: 500,
          minContainerHeight: 500
        });
      });
    }, false);

    reader.readAsDataURL(files[0]);
  }

  public onSubmit() {
    this._cropper.disable();
    let canvas = this._cropper.getCroppedCanvas({
      width: 64,
      height: 64
    });

    this.auth.user.setPic(this._dataURIToBlob(canvas.toDataURL()))
      .subscribe(() => {
        this.onCancel();
      });
  }

  public onCancel() {
    if(this._cropper) {
      this._cropper.destroy();
      this._cropper = null;
    }

    this.src = null;
  }

  private _dataURIToBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }

}
