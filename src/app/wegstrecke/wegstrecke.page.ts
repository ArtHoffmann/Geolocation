import { FotoPage } from './../foto/foto.page';
import { ListPage } from './../list/list.page';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { FotoPage } from '../foto/foto.page';
import { Observable, timer, Subscription } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wegstrecke',
  templateUrl: './wegstrecke.page.html',
  styleUrls: ['./wegstrecke.page.scss'],
})
export class WegstreckePage implements OnInit {

  anOtherPage: FotoPage;

  geoLatitude: number;
  geoLongitude: number;

  geoStopLatitude: number;
  geoStopLongitude: number;

  distanceInKm: number;

  geoAccuracy: number;
  geoAddress: string;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  watchLocationUpdates: any;
  loading: any;
  isWatching: boolean;

  counter: number;
  time: number;
  timerRef;
  running = false;
  startText = 'Start';

  public photos: any;
  public base64Image: string;
  public fileImage: string;
  public responseData: any;
  userData = { user_id: '', token: '', imageB64: '' };

  takePhoto() {
    console.log('coming here');

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 450,
      targetHeight: 450,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.photos.push(this.base64Image);
        this.photos.reverse();
      },
      err => {
        console.log(err);
      }
    );
  }


  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private storage: Storage,
    private camera: Camera,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    // this.loadSaved();
    this.loadMap();
  }


  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const map = GoogleMaps.create('map');
      map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {

        const coordinates: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
        console.log('datensatz ' + resp.coords.longitude, resp.coords.latitude);
        const position = {
          target: coordinates,
          zoom: 14
        };
        const coordinatesEnd: LatLng = new LatLng(resp.coords.latitude + 0.1, resp.coords.longitude + 0.1);
        console.log('datensatz ' + resp.coords.longitude, resp.coords.latitude);

        map.animateCamera(position);

        const markerOptions: MarkerOptions = {
          position: coordinates,
          title: 'Hier bin ich'
        };
        const markerOptionsEnd: MarkerOptions = {
          position: coordinatesEnd,
          title: 'Ziel'
        };

        const marker = map.addMarker(markerOptions)
          // tslint:disable-next-line:no-shadowed-variable
          .then((marker: Marker) => {
            marker.showInfoWindow();
          });
        const markerEnd = map.addMarker(markerOptionsEnd)
          // tslint:disable-next-line:no-shadowed-variable
          .then((marker: Marker) => {
            marker.showInfoWindow();
          });
        const points = [];
        // points.push({
        //   lat: resp.coords.latitude,
        //   lng: resp.coords.longitude
        // });
        // points.push({
        //   lat: resp.coords.latitude + 0.01,
        //   lng: resp.coords.longitude + 0.2
        // });
        // points.push({
        //   lat: resp.coords.latitude + 0.1,
        //   lng: resp.coords.longitude + 0.23
        // });
        // points.push({
        //   lat: resp.coords.latitude + 0.13,
        //   lng: resp.coords.longitude - 0.3
        // });

        map.addPolyline({
          points,
          color: '#AA00FF',
          width: 5,
          geodesic: true
        });
      });
    });
  }

  startTimer() {
    this.running = !this.running;
    if (this.running) {
      this.startText = 'Stop';
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
        this.newMethod();
        this.time = Date.now() - startTime;
      });
    } else {
      this.startText = 'Resume';
      this.stopTimer();
    }
  }

  private newMethod() {
    if (this.counter > 3599999) {
      this.counter -= 3599999;
    }
  }

  stopTimer() {
    this.running = false;
    this.startText = 'Start';
    const startTime = Date.now() - (this.counter || 0);
    this.counter = Date.now() - startTime;
    clearInterval(this.timerRef);
  }

  clearTimer() {
    this.running = false;
    this.startText = 'Start';
    this.counter = undefined;
    clearInterval(this.timerRef);
  }
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }


  watchLocation() {
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    });
  }

  stopLocationWatch() {
    this.stopTimer();
    this.isWatching = false;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoStopLatitude = resp.coords.latitude;
      this.geoStopLongitude = resp.coords.longitude;
    });
    this.calculateDistanceInKm();
    this.takePhoto();
  }

  getPosition() {
    this.startTimer();
    this.geolocation.getCurrentPosition().then((resp) => {
      const coordinates: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
      console.log('datensatz ' + resp.coords.longitude, resp.coords.latitude);
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
    });

  }
  calculateDistanceInKm() {
    this.distanceInKm = this.getDistanceFromLatLonInKm(this.geoLatitude, this.geoLongitude, this.geoStopLatitude, this.geoStopLongitude);
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }


}
