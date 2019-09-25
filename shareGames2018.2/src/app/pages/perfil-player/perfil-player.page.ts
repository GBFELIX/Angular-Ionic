import { Component, OnInit } from '@angular/core';
import { Player } from '../../model/player';
import { PlayerService } from '../../services/player.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-player',
  templateUrl: './perfil-player.page.html',
  styleUrls: ['./perfil-player.page.scss'],
})
export class PerfilPlayerPage implements OnInit {

  protected player:Player;
  private id: string = null;

  constructor(
    protected playerService: PlayerService,
    protected activateddRouter:ActivatedRoute
  ) { }

  ngOnInit() {
     this.id = this.activateddRouter.snapshot.paramMap.get("id");
     if(this.id){
       this.playerService.get(this.id).subscribe(
         res=>{
           this.player = res
         }
       )
     }
  }

}
