//users-list.component.ts
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../core/user.service';



@Component({

  selector:'app-users-list',

  standalone:true,

  imports:[
    CommonModule,
    RouterModule
  ],

  templateUrl:'./users-list.component.html',

  styleUrls:[
    './users-list.component.css'
  ]

})


export class UsersListComponent
implements OnInit, OnDestroy {



  users:any[]=[];


  loading=true;


  private destroy$=
    new Subject<void>();




  constructor(

    private userService:UserService,

    private cd:ChangeDetectorRef

  ){}





  ngOnInit():void{


    this.loadUsers();


  }







  loadUsers():void{


    console.clear();


    console.log(
      '========== USERS =========='
    );


    this.loading=true;



    this.userService
    .getAllUsers()

    .pipe(
      takeUntil(this.destroy$)
    )

    .subscribe({



      next:(data:any)=>{


        console.log(
          '[USERS RECEIVED]',
          data
        );



        /*
          Protection selon réponse backend
        */

        this.users =
          Array.isArray(data)
          ? data
          : data?.users ?? [];



        console.log(
          'TOTAL USERS:',
          this.users.length
        );



        this.loading=false;



        /*
          Force le rendu Angular
        */

        this.cd.detectChanges();



      },



      error:(err)=>{


        console.error(
          '[USERS ERROR]',
          err
        );


        this.users=[];

        this.loading=false;


        this.cd.detectChanges();


      }



    });



  }








  ngOnDestroy():void{


    this.destroy$.next();

    this.destroy$.complete();


  }



}