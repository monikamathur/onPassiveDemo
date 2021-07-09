import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { Router} from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) { }
  signupForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    username: [''],
    password: ['']
  });
  ngOnInit(): void {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log("test ",this.signupForm.value);
    this.appService.login(this.signupForm.value).subscribe((result: any)=>{
        if(result && result['token']){
             this.appService.setToken(result['token'])
             this.router.navigate(['/dashboard']  )
        }
    })
  }
}
