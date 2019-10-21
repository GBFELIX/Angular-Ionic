import { Component, OnInit } from '@angular/core';
import { Game } from '../../model/game';
import { GameService } from '../../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, MarkerCluster, MyLocation, LocationService, LatLng, Circle } from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-perfil-game',
  templateUrl: './perfil-game.page.html',
  styleUrls: ['./perfil-game.page.scss'],
})
export class PerfilGamePage implements OnInit {
  protected game: Game = new Game;
  private id: string = null;
  protected map: GoogleMap;

  constructor(
    protected gameService: GameService,
    protected activatedRouter: ActivatedRoute,
    private platform: Platform,
    private geolocation: Geolocation,
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();

    this.geolocation.getCurrentPosition().then((resp) => {
      this.game.lat = resp.coords.latitude;
      this.game.lng = resp.coords.longitude;
      this.id = this.activatedRouter.snapshot.paramMap.get("id");
      if (this.id) {
        this.gameService.get(this.id).subscribe(
          res => {
            this.game = res
          }
        )
      }
    })
  }
  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      'camera': {
        'target': {
          "lat": this.game.lat,
          "lng": this.game.lng,
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
          title: this.game.nome,
        })

        let GOOGLE = { "lat": myLocation.latLng.lat, "lng": myLocation.latLng.lng };

        // Add circle
        let circle: Circle = this.map.addCircleSync({
          'center': GOOGLE,
          'radius': 300,
          'strokeColor': '#AA00FF',
          'strokeWidth': 5,
          'fillColor': '#880000'
        });

        this.map.moveCamera({
          target: circle.getBounds()
        })

//adicionar eventos ao mapa
this.map.on(GoogleMapsEvent.MARKER_CLICK).subscribe(
  res => {
    marker.setTitle(this.game.nome)
    marker.showInfoWindow()
  }
)
//colocar pontos extras
this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
  res => {
    console.log(res)
    // this.map.addMarker({
    //   position: {
    //     lat: res[0].lat,
    //     lng: res[0].lng
    //   }
    // })
    marker.setPosition(res[0])
  }
)
      }
    );
  }
}

const slidesOpts = {
  slidesPerView: 3,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  on: {
    beforeInit() {
      const swiper = this;

      swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    },
    setTranslate() {
      const swiper = this;
      const {
        width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
      } = swiper;
      const params = swiper.params.coverflowEffect;
      const isHorizontal = swiper.isHorizontal();
      const transform$$1 = swiper.translate;
      const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
      const rotate = isHorizontal ? params.rotate : -params.rotate;
      const translate = params.depth;
      // Each slide offset from center
      for (let i = 0, length = slides.length; i < length; i += 1) {
        const $slideEl = slides.eq(i);
        const slideSize = slidesSizesGrid[i];
        const slideOffset = $slideEl[0].swiperSlideOffset;
        const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

        let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
        let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
        // var rotateZ = 0
        let translateZ = -translate * Math.abs(offsetMultiplier);

        let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
        let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

        // Fix for ultra small values
        if (Math.abs(translateX) < 0.001) translateX = 0;
        if (Math.abs(translateY) < 0.001) translateY = 0;
        if (Math.abs(translateZ) < 0.001) translateZ = 0;
        if (Math.abs(rotateY) < 0.001) rotateY = 0;
        if (Math.abs(rotateX) < 0.001) rotateX = 0;

        const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        $slideEl.transform(slideTransform);
        $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
        if (params.slideShadows) {
          // Set shadows
          let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
          let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
          if ($shadowBeforeEl.length === 0) {
            $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
            $slideEl.append($shadowBeforeEl);
          }
          if ($shadowAfterEl.length === 0) {
            $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
            $slideEl.append($shadowAfterEl);
          }
          if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
          if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
        }
      }

      // Set correct perspective for IE10
      if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
        const ws = $wrapperEl[0].style;
        ws.perspectiveOrigin = `${center}px 50%`;
      }
    },
    setTransition(duration) {
      const swiper = this;
      swiper.slides
        .transition(duration)
        .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
        .transition(duration);
    }

  }
}


