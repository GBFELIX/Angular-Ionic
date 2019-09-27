import { Component, OnInit } from '@angular/core';
import { Game } from '../../model/game';
import { AlertController, LoadingController } from '@ionic/angular';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.page.html',
  styleUrls: ['./add-game.page.scss'],
})
export class AddGamePage implements OnInit {
  protected game:Game = new Game;

  constructor(
    public alertController: AlertController,
    protected gameService:GameService,
    public loadingController: LoadingController,
    protected router:Router
  ) { }

  ngOnInit() {
  }
  onsubmit(form){
    this.gameService.save(this.game).then(
      res=>{
        //console.log("Cadastrado");
        this.presentLoading();
        this.presentAlert("Deu bom confia","teu jojo ta sendo Cadastrado!");
        form.reset();
        this.router.navigate(['/tabs/listGame']);
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
}

