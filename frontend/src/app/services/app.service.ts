import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const helper = new JwtHelperService();
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': ''
  })
};
@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl = "http://localhost:3000/users"
  loginUrl = "/login";
  signupUrl = "/signup"
  constructor(private http: HttpClient) { }

  login(loginData:any){
    return this.http.post(this.baseUrl+this.loginUrl,loginData)
  }

  signup(signupData:any){
    return this.http.post(this.baseUrl+this.signupUrl,signupData)
  }

  setToken(token:string){
    localStorage.setItem("TOKEN", token)
  }

  getToken(){
    return localStorage.getItem("TOKEN")

  }

  isLoggedIn(){
    const token = this.getToken();
    if(token){
      const isExpired = helper.isTokenExpired(token);
      if (isExpired) return false;
      return true ;
    }
    return false ;
  }
}
