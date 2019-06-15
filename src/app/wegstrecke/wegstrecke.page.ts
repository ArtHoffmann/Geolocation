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

@Component({
  selector: 'app-wegstrecke',
  templateUrl: './wegstrecke.page.html',
  styleUrls: ['./wegstrecke.page.scss'],
})
export class WegstreckePage implements OnInit {

  geoLatitude: number;
  geoLongitude: number;

  geoStopLatitude: number;
  geoStopLongitude: number;

  distanceInKm: number;

  geoAccuracy: number;
  geoAddress: string;

  watchLocationUpdates: any;
  loading: any;
  isWatching: boolean;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private storage: Storage
  ) { }

  ngOnInit() { }

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
    this.isWatching = false;
    // this.watchLocationUpdates.unsubscribe();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoStopLatitude = resp.coords.latitude + 0.1 ;
      this.geoStopLongitude = resp.coords.longitude + 0.1;
    });
  }

  getPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const coordinates: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
      console.log('datensatz ' + resp.coords.longitude, resp.coords.latitude);
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
    });

  }
  calculateDistanceInKm() {
    this.distanceInKm = this.getDistanceFromLatLonInKm(this.geoLatitude, this.geoLongitude, this.geoStopLatitude, this.geoStopLongitude);
    console.log(this.geoLatitude);
    console.log(this.geoLongitude);
    console.log(this.geoStopLatitude);
    console.log(this.geoStopLongitude);
    console.log(this.distanceInKm);
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
    console.log('berechnung ' + d);
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
