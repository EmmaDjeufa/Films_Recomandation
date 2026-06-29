import { Component } from "@angular/core";

import { FormsModule } from "@angular/forms";

import { ActivatedRoute } from "@angular/router";

import { Router } from "@angular/router";

import { CommonModule } from "@angular/common";

import { AuthService } from "../../core/auth.service";

@Component({

selector:"app-verify",

standalone:true,

imports:[CommonModule,FormsModule],

templateUrl:"./verify.component.html",

styleUrls:["./verify.component.css"]

})

export class VerifyComponent{

email="";

code="";

message="";

constructor(

private route:ActivatedRoute,

private auth:AuthService,

private router:Router

){

this.route.queryParams.subscribe(

params=>{

this.email=params["email"];

}

);

}

verify(){

this.auth.verifyCode(

this.email,

this.code

).subscribe({

next:(res:any)=>{

this.message=res.message;

setTimeout(()=>{

this.router.navigate(["/login"]);

},1500);

},

error:(err)=>{

this.message=err.error.message;

}

});

}

}