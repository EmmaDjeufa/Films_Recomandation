import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../core/user.service';
import { FilmService } from '../../core/film.service';


@Component({
  selector: 'app-profile',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule
  ],
  templateUrl:'./profile.component.html',
  styleUrls:[
    './profile.component.css'
  ]
})


export class ProfileComponent implements OnInit {


  user:any = null;

  favorites:any[]=[];


  loading=true;


  selectedFile:File|null=null;


  previewUrl:string|null=null;


  newPassword='';


  passwordSuccess=false;


  avatarError=false;


  readonly defaultAvatar =
    'images/default.png';



  constructor(
    private userService:UserService,
    private filmService:FilmService,
    private cd:ChangeDetectorRef
  ){}



  ngOnInit(){

    this.loadProfile();

  }





  loadProfile(){

    console.clear();

    console.log(
      "========== PROFILE =========="
    );


    this.loading=true;



    this.userService
    .getProfile()
    .subscribe({

      next:(data:any)=>{


        console.log(
          "[PROFILE DATA]",
          data
        );


        this.user =
          data.user ?? null;


        this.favorites =
          data.favorites ?? [];



        console.log(
          "USER:",
          this.user
        );


        console.log(
          "FAVORITES:",
          this.favorites.length
        );


        this.loading=false;



        this.cd.detectChanges();



      },


      error:(err)=>{


        console.error(
          "[PROFILE ERROR]",
          err
        );


        this.loading=false;


        this.cd.detectChanges();


      }


    });

  }







  get avatarUrl(){


    if(this.previewUrl){

      return this.previewUrl;

    }


    if(
      this.user?.photo_url &&
      !this.avatarError
    ){

      return this.user.photo_url;

    }


    return this.defaultAvatar;

  }







  

  onFileSelected(event:any){

    const file =
      event.target.files?.[0];

    if(!file){
      return;
    }

    this.avatarError = false;

    this.selectedFile=file;

    const reader =
      new FileReader();

    reader.onload=()=>{

      this.previewUrl =
        reader.result as string;

    };

    reader.readAsDataURL(file);

  }







  uploadPhoto(){


    if(!this.selectedFile){

      return;

    }



    const formData =
      new FormData();


    formData.append(
      "photo",
      this.selectedFile
    );



    this.userService
    .updateProfile(formData)
    .subscribe({

      next:(response:any)=>{


        console.log(
          "[PHOTO UPDATED]",
          response
        );


        this.selectedFile=null;

        this.previewUrl=null;


        this.avatarError=false;


        this.loadProfile();


      },


      error:(err)=>{


        console.error(
          "[UPLOAD ERROR]",
          err
        );


      }

    });


  }







  removeFavorite(tmdbId:number){


    this.filmService
    .removeFavorite(tmdbId)
    .subscribe({

      next:()=>{


        this.favorites =
          this.favorites.filter(
            f=>f.tmdb_id!==tmdbId
          );


      },


      error:err=>
        console.error(
          "[REMOVE FAVORITE ERROR]",
          err
        )

    });


  }







  updatePassword(){


    if(this.newPassword.length < 6){

      return;

    }



    this.userService
    .updatePassword(this.newPassword)
    .subscribe({

      next:()=>{


        this.newPassword='';


        this.passwordSuccess=true;



        setTimeout(()=>{

          this.passwordSuccess=false;

        },3000);


      },


      error:err=>
        console.error(
          "[PASSWORD ERROR]",
          err
        )

    });


  }



}