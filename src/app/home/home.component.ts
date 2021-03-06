import { Inject,Component, OnInit } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut,expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style':'display: block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})

export class HomeComponent implements OnInit {

  dish!:Dish ;
  promotion!:Promotion;
  leader! : Leader ;
  dishErrMess!:string;
  promoErrMess!:string;
  leaderErrMess!:string;

  constructor( private dishservice : DishService ,
     private promotionservice :PromotionService,
     private leaderService: LeaderService,
     @Inject('BaseURL') public BaseURL:string) { }

  ngOnInit(): void {
     this.dishservice.getFeaturedDish()
     .subscribe (fdish => this.dish =fdish,
      disherrmess => this.dishErrMess=<any>disherrmess) ;

     this.promotionservice.getFeaturedPromotion()
     .subscribe(fpromo => this.promotion= fpromo,
      promoerrmess => this.promoErrMess=<any>promoerrmess);

     this.leaderService.getFeaturedLeader()
     .subscribe(fleader => this.leader = fleader,
      leadererrmess => this.leaderErrMess=<any>leadererrmess);
  }

}
