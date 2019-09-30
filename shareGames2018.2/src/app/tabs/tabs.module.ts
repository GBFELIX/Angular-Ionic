import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Player } from '../model/player';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {
  protected fire: AngularFirestore
}
//  return this.fire.collection("players")

  // return this.fire.collection('players').snapshotChanges().map(data => {
  // return data.map(d => ({key: d.key, ...d.payload.val()}));
  // });
  // }
