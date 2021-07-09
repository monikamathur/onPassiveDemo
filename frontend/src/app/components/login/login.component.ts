import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) { }
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  ngOnInit(): void {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log("test ",this.loginForm.value);
    this.appService.login(this.loginForm.value).subscribe((result: any)=>{
        if(result && result['token']){
             this.appService.setToken(result['token'])
             this.router.navigate(['/dashboard']  )
        }
    })
  }

}
