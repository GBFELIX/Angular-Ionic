import { Component, OnInit } from '@angular/core';
import { Player } from '../../model/player';
import { PlayerService } from '../../services/player.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.page.html',
  styleUrls: ['./add-player.page.scss'],
})
export class AddPlayerPage implements OnInit {

  protected player:Player = new Player;
  protected id:any = null;
  constructor(
    public alertController: AlertController,
    protected playerService:PlayerService,
    public loadingController: LoadingController,
    protected router:Router,
    protected activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if(this.id){
      this.playerService.get(this.id).subscribe(
        res=>{
          this.player = res
        },
        erro => this.id = null
      )
    }
  }

  onsubmit(form){
    if(!this.id){
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
    }else{
      this.playerService.update(this.player, this.id).then(
        res=>{
          this.presentLoading();
          this.presentAlert("Deu bom confia","tu foi Atualizado!");
          form.reset();
          this.router.navigate(['/tabs/listPlayer']);
        },
        erro=>{
          console.log("Erro: " + erro);
          this.presentAlert("DEU ERRO, fuja para as colinas","NAO atualizado! ou seja deu ruim")
        }
      )
    }
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
