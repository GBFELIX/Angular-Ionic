import { Component, OnInit } from '@angular/core';
import { Game } from '../../model/game';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { GameService } from '../../services/game.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, MarkerCluster, MyLocation, LocationService, LatLng } from '@ionic-native/google-maps';


@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.page.html',
  styleUrls: ['./add-game.page.scss'],
})
export class AddGamePage implements OnInit {
  protected game: Game = new Game;
  protected id: any = null;
  protected preview: any = null;
  protected map: GoogleMap;

  constructor(
    public alertController: AlertController,
    protected gameService: GameService,
    public loadingController: LoadingController,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    private platform: Platform,
    private geolocation: Geolocation
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();

    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.gameService.get(this.id).subscribe(
        res => {
          this.game = res
        },
        erro => this.id = null
      )
    }
  }

  onsubmit(form) {
    // if(!this.preview) {
    //   this.presentAlert("Erro", "Deve cadastrar alguma foto no game");
    // } else {

    // }
    if(this.id){
      
    }
    if (!this.id) {
      this.gameService.save(this.game).then(
        res => {
          //console.log("Cadastrado");
          this.presentLoading();
          this.presentAlert("Deu bom confia", "teu jojo ta sendo Cadastrado!");
          form.reset();
          this.router.navigate(['/tabs/listGame']);
          this.geolocation.getCurrentPosition().then((resp) => {
            this.game.lat = resp.coords.latitude;
            this.game.lng = resp.coords.longitude;
            console.log(resp)
          }).catch((error) => {
            this.game.lat = 0;
            this.game.lng = 0;
            console.log('Error getting location', error);
          });
        },
        erro => {
          console.log("Erro: " + erro);
          this.presentAlert("DEU ERRO, fuja para as colinas", "NAO Cadastrado! ou seja deu ruim")
        }
      )
    } else {
      this.gameService.update(this.game, this.id).then(
        res => {
          this.presentLoading();
          this.presentAlert("Deu bom confia", "tu foi Atualizado!");
          form.reset();
          this.router.navigate(['/tabs/listGame']);
        },
        erro => {
          console.log("Erro: " + erro);
          this.presentAlert("DEU ERRO, fuja para as colinas", "NAO atualizado! ou seja deu ruim")
        }
      )
    }
  }

  async presentAlert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      message: texto,
      buttons: ['time to game']
    });

    await alert.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'tamo te cadastrando pera ae',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      'camera': {
        'target': {
          "lat": this.game.lat,
          "lng": this.game.lng,
        },
        'zoom': 18
      }
    });
    //this.addCluster(this.dummyData());
    this.minhaLocalizacao();
  }
  minhaLocalizacao() {
    LocationService.getMyLocation().then(
      (myLocation: MyLocation) => {
        this.map.setOptions({
          camera: {
            target: myLocation.latLng
          }
        })
        //marcadores
        let marker: Marker = this.map.addMarkerSync({
          position: {
            lat: myLocation.latLng.lat,
            lng: myLocation.latLng.lng
          },
          icon: "#00ff00",
          title: this.game.nome,
        })
        //adicionar eventos ao mapa
        this.map.on(GoogleMapsEvent.MARKER_CLICK).subscribe(
          res => {
            marker.setTitle(this.game.nome)
            marker.showInfoWindow()
          }
        )
        //colocar pontos extras
        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
          res => {
            console.log(res)
            // this.map.addMarker({
            //   position: {
            //     lat: res[0].lat,
            //     lng: res[0].lng
            //   }
            // })
            marker.setPosition(res[0])
          }
        )
      }
    );
  }
}



