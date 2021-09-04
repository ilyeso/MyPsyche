import { Inject,Component, OnInit } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish!:Dish ;
  promotion!:Promotion;
  leader! : Leader ;
  dishErrMess!:string;

  constructor( private dishservice : DishService ,
     private promotionservice :PromotionService,
     private leaderService: LeaderService,
     @Inject('BaseURL') public BaseURL:string) { }

  ngOnInit(): void {
     this.dishservice.getFeaturedDish()
     .subscribe (fdish => this.dish =fdish,
      disherrmess => this.dishErrMess=<any>disherrmess) ;
     this.promotionservice.getFeaturedPromotion()
     .subscribe(fpromo => this.promotion= fpromo);
     this.leaderService.getFeaturedLeader()
     .subscribe(fleader => this.leader = fleader);
  }

}
