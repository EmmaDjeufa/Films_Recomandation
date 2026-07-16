//users-list.component.ts
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../core/user.service';
import { FormsModule } from '@angular/forms';


@Component({

  selector:'app-users-list',

  standalone:true,

  imports:[
    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl:'./users-list.component.html',

  styleUrls:[
    './users-list.component.css'
  ]

})


export class UsersListComponent
implements OnInit, OnDestroy {



  users:any[]=[];
  filteredUsers:any[]=[];
  search = '';
  loading=true;
  currentUserId:number|null = null;


  private destroy$=
    new Subject<void>();




  constructor(

    private userService:UserService,

    private cd:ChangeDetectorRef,
     
    private router:Router

  ){}





  ngOnInit():void{

    this.loadCurrentUser();
    this.loadUsers();


  }

openProfile(user:any){

  if(user.id === this.currentUserId){

    this.router.navigate(['/profile']);

    return;

  }


  this.router.navigate([
    '/users',
    user.id
  ]);

}

loadCurrentUser(){

    this.userService
    .getProfile()
    .subscribe({

      next:(data:any)=>{

        this.currentUserId =
          Number(data.user.id);

      },

      error:(err)=>{

        console.error(
          "Erreur récupération utilisateur connecté",
          err
        );

      }

    });

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

        this.filteredUsers = [...this.users];


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




  filterUsers(){

    const value = this.search
      .trim()
      .toLowerCase();

    if(!value){

      this.filteredUsers = [...this.users];

      return;

    }

    this.filteredUsers = this.users.filter(user =>

      user.name?.toLowerCase().includes(value) ||

      user.email?.toLowerCase().includes(value) ||

      user.themes?.some((theme:string)=>

        theme.toLowerCase().includes(value)

      )

    );

  }



  ngOnDestroy():void{


    this.destroy$.next();

    this.destroy$.complete();


  }



}