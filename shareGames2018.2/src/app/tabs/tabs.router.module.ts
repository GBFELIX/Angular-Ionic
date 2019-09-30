import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'listPlayer',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/list-player/list-player.module').then(m => m.ListPlayerPageModule)
          }
        ]
      },
      {
        path: 'perfilPlayer/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/perfil-player/perfil-player.module').then(m => m.PerfilPlayerPageModule)
          }
        ]
      },
      {
        path: 'listGame',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/list-game/list-game.module').then(m => m.ListGamePageModule)
          }
        ]
      },
      {
        path: 'addGame',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/add-game/add-game.module').then(m => m.AddGamePageModule)
          }
        ]
      },
      {
        path: 'perfilGame/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/perfil-game/perfil-game.module').then(m => m.PerfilGamePageModule)
          }
        ]
      },
      {
        path: 'addPlayer',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/add-player/add-player.module').then(m => m.AddPlayerPageModule)
          }
        ]
      },
      {
        path: 'addPlayer/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/add-player/add-player.module').then(m => m.AddPlayerPageModule)
          }
        ]
      },
      {
        path: 'list-listgames',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/list-listgames/list-listgames.module').then(m => m.ListGamesPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}


/*{
        path: 'listGame',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/list-game/list-game.module').then(m => m.ListGamePageModule)
          }
        ]
      },
      */