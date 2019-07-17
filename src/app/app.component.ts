import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Liste der bisherigen Läufe',
      url: '/list',
      icon: 'list'
    },
    // {
    //   title: 'Foto',
    //   url: '/foto',
    //   icon: 'camera'
    // },
    {
      title: 'Wegstreckentracking',
      url: '/wegstrecke',
      icon: 'person'
    },
    // {
    //   title: 'Maps',
    //   url: '/mapspage',
    //   icon: 'locate'
    // },

  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
