import { Component, OnInit } from '@angular/core';
import { Player } from '../../model/player';
import { PlayerService } from '../../services/player.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.page.html',
  styleUrls: ['./add-player.page.scss'],
})
export class AddPlayerPage implements OnInit {

  protected player:Player = new Player;

  constructor(
    public alertController: AlertController,
    protected playerService:PlayerService,
    public loadingController: LoadingController,
    protected router:Router
  ) { }

  ngOnInit() {
  }

  onsubmit(form){
    this.playerService.save(this.player).then(
      res=>{
        //console.log("Cadastrado");
        this.presentLoading();
        this.presentAlert("Deu bom confia","tu foi Cadastrado!");
        form.reset();
        this.router.navigate(['/tabs/listPlayer']);
      },
      erro=>{
        console.log("Erro: " + erro);
        this.presentAlert("DEU ERRO, fuja para as colinas","NAO Cadastrado! ou seja deu ruim")
      }
    )
  }
async presentAlert(tipo:string, texto:string) {
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
