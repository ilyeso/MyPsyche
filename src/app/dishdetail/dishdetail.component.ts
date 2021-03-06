import { Inject,ViewChild,Component, OnInit  } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';
import { FormBuilder , FormGroup, NgForm, Validators } from '@angular/forms';

import { Params , ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { visibility, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations:[
   visibility(),
   expand()
  ]
})
export class DishdetailComponent implements OnInit {
  
 
  dish! : Dish;
  dishcopy! : Dish ;
  dishIds!: string[];
  prev! : string;
  next! :string;
  errMess!:string;

  commentForm!: FormGroup;
  comment!:Comment ;
  @ViewChild('cform') feedbackFormDirective!: NgForm ;
  visibility = 'shown';


 formErrors : any ={
   'author': '',
   'comment' : ''

 };

 validationMessages : any = {
   'author': {
     'required': 'Author name is required.',
     'minlength': 'Author name must be at least 2 characters long.'
   },
   'comment':{
     'required': 'Comment is required'
   }
 }
  
  constructor( private dishservice: DishService,
    private route:ActivatedRoute,
    private location:Location,
    private cm: FormBuilder,
    @Inject('BaseURL') public BaseURL:string ) {
    this.createForm();
     }

  ngOnInit(): void {
   
    
    this.dishservice.getDishIds()
    .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params)=> {this.visibility='hidden'; return this.dishservice.getDish(params['id']); }))
    .subscribe(dish => {
      this.dish=dish;
      this.dishcopy= dish ;
      this.setPrevNext(dish.id);
    this.visibility = 'shown';},
      errmess => this.errMess=<any>errmess);
     
  }


  createForm () {
    this.commentForm = this.cm.group ({
      author: ['', [Validators.required,Validators.minLength(2)]],
      comment: ['',[Validators.required]],
      rating: [5],
      date: ['']
    });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged() ;
     }

     onValueChanged(data? : any) {
      if(!this.commentForm) {return;}
      const form = this.commentForm;
        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);
                if (control && control.dirty && !control.valid) {
                    const messages = this.validationMessages[field];
                    for (const key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
     }

     onSubmit(){
      this.comment = this.commentForm.value;
      let date = new Date();
      this.comment.date =date.toISOString();
      this.dishcopy.comments.push(this.comment);
      this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish ;
        this.dishcopy =dish;
      },
      errmess => {this.errMess= <any>errmess ;
      }) ;
      console.log(this.dish.comments) ;
     
      this.commentForm.reset({
        author: '',
        comment: '',
        rating: '5'
      });
     }

  setPrevNext ( dishId:string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[ (this.dishIds.length + index -1)% this.dishIds.length] ;
    this.next = this.dishIds[ (this.dishIds.length+ index +1)% this.dishIds.length];
  }

  goBack(): void {
    this.location.back() ;
  }
 

}
