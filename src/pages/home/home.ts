import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  providers: [Camera],
  templateUrl: 'home.html'
})
export class HomePage {
  public base64Image: string[];

  constructor(public navCtrl: NavController
    , public platform: Platform
    , private camera: Camera
    , private nativeStorage: NativeStorage
  ) {
    this.base64Image = new Array();

    this.platform.ready().then(() => {
      this.nativeStorage.getItem('photos').then(data => {
        
        // data = data.replace(/^file:\/\//, '');
        console.log(data);
        this.base64Image = data.split(', ');
      },
        error => {
          console.log("error in getting photos " + error);
        });
    });
  }

  takePicture() {
    this.camera.getPicture({
      quality: 75,
      destinationType: 1,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false
    }).then((imageUri) => {
      console.log("imageUri is " + imageUri);
      this.base64Image.push(imageUri);
      let imageUris = this.base64Image.map(o => o).join(', ');
      // let imageUris = this.base64Image.join(', ');

      this.nativeStorage.setItem('photos', imageUris).then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
      console.log("imageUris is " + imageUris);

    }, (err) => {
      console.log("error occured " + err);
    });
  }



}
