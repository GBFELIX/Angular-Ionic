import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  MarkerCluster
} from '@ionic-native/google-maps';


import { IonicModule } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AddPlayerPage } from './add-player.page';

import { Camera } from '@ionic-native/camera/ngx';

const routes: Routes = [
  {
    path: '',
    component: AddPlayerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[Camera],
  declarations: [AddPlayerPage]
})
export class AddPlayerPageModule {}
