import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-list-list-games',
  templateUrl: './list-listgames.page.html',
  styleUrls: ['./list-listgames.page.scss'],
})
export class ListListGamePage implements OnInit {
  protected games:any;
  constructor(
    protected gameService: GameService,
    protected router:Router,
    protected alertController: AlertController
  ) { }

  ngOnInit() {
    this.refreshGames();
  }
  apagar(game){
    this.presentAlertConfirm(game);
  }
  editar(game){
    this.router.navigate(['/tabs/addGame/' , game.key])
  }  
  
  doRefresh(event) {
    console.log('Begin async operation');
    this.gameService.getALL().subscribe(
      res => {
        this.games = res
        setTimeout(() => {
          console.log('Async operation has ended');
          event.target.complete();
        }, 0);
      }
    );
  }
  refreshGames(){
    this.gameService.getALL().subscribe(
       res => {
     this.games = res;
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
    async presentAlertConfirm(game) {
      const alert = await this.alertController.create({
        header: 'Apagar game?!',
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
         this.gameService.remove(game).then(
           res=>{
              this.presentAlert("Aviso","Apagado com sucesso!");
              this.refreshGames();
           },
           erro=>{
             this.presentAlert("Erro", "num deu pra apagar o game");
           }
         )
            }
          }
        ]
      });
    
      await alert.present();
    }
    
    }
    
