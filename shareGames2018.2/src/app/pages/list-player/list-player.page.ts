import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list-player',
  templateUrl: './list-player.page.html',
  styleUrls: ['./list-player.page.scss'],
})
export class ListPlayerPage implements OnInit {
  protected players: any;
  constructor(
    protected playerService: PlayerService,
    protected router:Router,
    protected alertController: AlertController
  ) { }

  ngOnInit() {
    // this.playerService.getALL().subscribe(
    //   res => {
    //     this.players = res;
    this.refreshPlayers();
      }
    
  
apagar(player){
  this.presentAlertConfirm(player);
}
editar(player){
  this.router.navigate(['/tabs/addPlayer/' , player.key])
}  

  doRefresh(event) {
    console.log('Begin async operation');
    this.playerService.getALL().subscribe(
      res => {
        this.players = res
        setTimeout(() => {
          console.log('Async operation has ended');
          event.target.complete();
        }, 500);
      }
    );
  }
  refreshPlayers(){
    this.playerService.getALL().subscribe(
       res => {
     this.players = res;
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
async presentAlertConfirm(player) {
  const alert = await this.alertController.create({
    header: 'Apagar player?!',
    message: 'Tu quer mesmo apagar?',
    buttons: [
      {
        text: 'Não',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Sim',
        handler: () => {
     this.playerService.remove(player).then(
       res=>{
          this.presentAlert("Aviso","Apagado com sucesso!");
          this.refreshPlayers();
       },
       erro=>{
         this.presentAlert("Erro", "num deu pra apagar o player");
       }
     )
        }
      }
    ]
  });

  await alert.present();
}

}
