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

  // @ViewChild('map') mapElement: ElementRef;
  // map: any;
  // address: string;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {
  }


  ngOnInit() {
    // this.loadMap();
    this.loadMap();
  }

  // loadMap() {
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //     const mapOptions = {
  //       center: latLng,
  //       zoom: 15,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP
  //     };

  //     this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  //     this.map.addListener('tilesloaded', () => {
  //       console.log('accuracy', this.map);
  //       this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
  //     });

  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  // }

  // getAddressFromCoords(lattitude, longitude) {
  //   console.log('getAddressFromCoords' + lattitude + '' + longitude);
  //   const options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };

  //   this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
  //     .then((result: []) => {
  //       this.address = '';
  //       const responseAddress = [];
  //       for (const [key, value] of Object.entries(result)) {
  //         if (value > 0) {
  //           responseAddress.push(value);
  //         }

  //       }
  //       responseAddress.reverse();
  //       for (const v of responseAddress) {
  //         this.address += v + ',';
  //       }
  //       this.address = this.address.slice(0, -2);
  //     })
  //     .catch((error: any) => {
  //       this.address = 'Address not found';
  //     });

  // }
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
