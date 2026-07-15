//user-detail.component.ts
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../core/user.service';




@Component({

  selector:'app-user-detail',

  standalone:true,

  imports:[
    CommonModule
  ],

  templateUrl:'./user-detail.component.html',

  styleUrls:[
    './user-detail.component.css'
  ]

})


export class UserDetailComponent implements OnInit {


  user:any = null;

  loading=true;



  constructor(

    private route:ActivatedRoute,

    private userService:UserService,

    private router:Router,

    private cd:ChangeDetectorRef

  ){}





  ngOnInit(){


    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );



    console.log(
      '[USER DETAIL ID]',
      id
    );



    if(!id){

      console.error(
        'ID utilisateur absent'
      );

      return;

    }



    this.userService
    .getUserById(id)
    .subscribe({


      next:(response:any)=>{


        console.log(
          '[USER DETAIL RESPONSE]',
          response
        );



        /*
          Protection selon backend
        */

        this.user =
          response.user ?? response;



        this.loading=false;


        this.cd.detectChanges();


      },



      error:(err)=>{


        console.error(
          '[USER DETAIL ERROR]',
          err
        );


        this.loading=false;


        this.cd.detectChanges();


      }


    });


  }

goBackUsers(){

  this.router.navigate([
    '/users'
  ]);

}
}