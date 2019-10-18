import { Component, OnInit } from '@angular/core';
import { Player } from '../../model/player';
import { PlayerService } from '../../services/player.service';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, MarkerCluster, MyLocation, LocationService } from '@ionic-native/google-maps';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.page.html',
  styleUrls: ['./add-player.page.scss'],
})
export class AddPlayerPage implements OnInit {

  protected player: Player = new Player;
  protected id: any = null;
  protected preview: any = null;
  protected map: GoogleMap;

  constructor(
    public alertController: AlertController,
    protected playerService: PlayerService,
    public loadingController: LoadingController,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    private camera: Camera,
    private geolocation: Geolocation,
    private platform: Platform,


  ) { }

  async ngOnInit() {
    //this.localAtual();
    await this.platform.ready();
    await this.loadMap();

    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.playerService.get(this.id).subscribe(
        res => {
          this.player = res
        },
        erro => this.id = null
      )
    }
  }

  onsubmit(form) {
    if (!this.preview) {
      this.presentAlert("Erro", "Deve cadastrar alguma foto no perfil");
    } else {
      this.player.foto = this.preview;
      this.geolocation.getCurrentPosition().then((resp) => {
        this.player.lat = resp.coords.latitude;
        this.player.lng = resp.coords.longitude;
        console.log(resp)
      }).catch((error) => {
        this.player.lat = 0;
        this.player.lng = 0;
        console.log('Error getting location', error);
      });
      if (!this.id) {
        this.playerService.save(this.player).then(
          res => {
            //console.log("Cadastrado");
            this.presentLoading();
            this.presentAlert("Deu bom confia", "tu foi Cadastrado!");
            form.reset();
            this.router.navigate(['/tabs/listPlayer']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("DEU ERRO, fuja para as colinas", "NAO Cadastrado! ou seja deu ruim")
          }
        )
      } else {
        this.playerService.update(this.player, this.id).then(
          res => {
            this.presentLoading();
            this.presentAlert("Deu bom confia", "tu foi Atualizado!");
            form.reset();
            this.router.navigate(['/tabs/listPlayer']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("DEU ERRO, fuja para as colinas", "NAO atualizado! ou seja deu ruim")
          }
        )
      }
    }
  }
  tirarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.preview = base64Image;
    }, (err) => {
      // Handle error
    });
  }
  async presentAlert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      message: texto,
      buttons: ['Sendo assim sim']
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
          "lat": this.player.lat,
          "lng": this.player.lng,
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
          title: this.player.nome,
          snippet: this.player.nickname,
        })
        //adicionar eventos ao mapa
        this.map.on(GoogleMapsEvent.MARKER_CLICK).subscribe(
          res => {
            marker.setTitle(this.player.nome)
            marker.setSnippet(this.player.nickname)
            marker.showInfoWindow()
          }
        )
        //colocar pontos extras
        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
          res => {
            this.map.addMarker({
              position: {
                lat: res.position.lat,
                lng: res.position.lng
              }
            })
          }
        )
      }
    );
  }
}


