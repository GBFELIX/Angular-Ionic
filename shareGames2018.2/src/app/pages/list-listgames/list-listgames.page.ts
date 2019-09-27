import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-list-list-games',
  templateUrl: './list-listgames.page.html',
  styleUrls: ['./list-listgames.page.scss'],
})
export class ListListGamePage implements OnInit {
  protected games:any;
  constructor(
    protected gameService: GameService
  ) { }

  ngOnInit() {
    this.gameService.getALL().subscribe(
      res => {
        this.games = res;
      }
    );
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
}
