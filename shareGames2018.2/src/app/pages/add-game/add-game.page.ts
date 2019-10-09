import { Component, OnInit } from '@angular/core';
import { Game } from '../../model/game';
import { AlertController, LoadingController } from '@ionic/angular';
import { GameService } from '../../services/game.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.page.html',
  styleUrls: ['./add-game.page.scss'],
})
export class AddGamePage implements OnInit {
  protected game:Game = new Game;
  protected id: any = null;
  protected preview: any = null;

  constructor(
    public alertController: AlertController,
    protected gameService:GameService,
    public loadingController: LoadingController,
    protected router:Router,
    protected activatedRoute: ActivatedRoute,
    
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if(this.id){
      this.gameService.get(this.id).subscribe(
        res=>{
          this.game = res
        },
        erro => this.id = null
      )
    }
  }

  onsubmit(form){
    // if(!this.preview) {
    //   this.presentAlert("Erro", "Deve cadastrar alguma foto no game");
    // } else {
      
    // }
    if (!this.id) {
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
   } else {
      this.gameService.update(this.game, this.id).then(
        res=> {
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

