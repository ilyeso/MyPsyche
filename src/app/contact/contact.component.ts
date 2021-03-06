import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder , FormGroup, NgForm, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut,expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style':'display: block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  lat :number = 35.651483 ;
  lng: number =10.897201;
  
  
  feedbackForm!: FormGroup  ;
  feedback!: Feedback;
  errMess!: string;
  contactType =ContactType ;
  @ViewChild('fform') feedbackFormDirective!: NgForm ;

  constructor( private fb: FormBuilder,
    private feedbackservice : FeedbackService) {
    this.createForm();
   }

  ngOnInit(): void {
   
  }

  formErrors : any = {
    'firstname' : '',
    'lastname' : '',
    'telnum' : '',
    'email' : ''
  };

  validationMessages : any= {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    }
  };

  submitting = false ;
  submitted = false ;
  recievedForm !: Feedback ;


  createForm(){
    this.feedbackForm=this.fb.group( {
      firstname:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0,[Validators.required, Validators.pattern]],
      email: ['',[Validators.required, Validators.email]],
      agree: false ,
      contacttype: '',
      message: ''
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged(); // (re)set validation messages now 
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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
    this.submitting = true ;
    this.feedback = this.feedbackForm.value ;
    this.feedbackservice.submitFeedback(this.feedback)
    .subscribe( feedback => {
      this.feedback=feedback;
      this.recievedForm=feedback ;
      this.submitting=false ;
      this.submitted=true ;
    },
    errmess => {this.errMess= <any>errmess ;
    }) ;
    console.log(this.feedback) ;
    setTimeout(() => {
      this.submitted=false;
      this.feedbackForm.reset( {
        firstname: '',
        lastname: '',
        telnum: '',
        email: '',
        agree: false,
        contacttype: '',
        message: ''
      }) ;
      this.feedbackFormDirective.resetForm();
    }, 5000);

   
  }

}
