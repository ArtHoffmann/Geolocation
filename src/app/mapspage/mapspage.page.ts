import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

declare var google;

@Component({
  selector: 'app-mapspage',
  templateUrl: './mapspage.page.html',
  styleUrls: ['./mapspage.page.scss'],
})


export class MapspagePage implements OnInit {

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {
  }


  ngOnInit() {

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

        map.animateCamera(position);

        const markerOptions: MarkerOptions = {
          position: coordinates,
          title: 'Hier bin ich'
        };

        const marker = map.addMarker(markerOptions)
          // tslint:disable-next-line:no-shadowed-variable
          .then((marker: Marker) => {
            marker.showInfoWindow();
          });
      });
    });
  }
}
