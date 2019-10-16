import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    GooglePlus,
    Device,
    AndroidPermissions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}





