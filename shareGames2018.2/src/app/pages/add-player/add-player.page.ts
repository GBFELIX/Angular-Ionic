import { Component, OnInit } from '@angular/core';
import { Player } from '../../model/player';
import { PlayerService } from '../../services/player.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.page.html',
  styleUrls: ['./add-player.page.scss'],
})
export class AddPlayerPage implements OnInit {

  protected player: Player = new Player;
  protected id: any = null;
  protected preview: any = null;

  constructor(
    public alertController: AlertController,
    protected playerService: PlayerService,
    public loadingController: LoadingController,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    private camera: Camera,
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
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
}
  

