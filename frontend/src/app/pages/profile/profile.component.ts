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
  standalone: true,

  imports:[
    CommonModule,
    FormsModule
  ],

  templateUrl:'./profile.component.html',
  styleUrls:['./profile.component.css']
})


export class ProfileComponent implements OnInit {


  user:any = null;

  favorites:any[] = [];

  loading = true;


  newPassword = '';

  passwordSuccess=false;


  selectedFile:File|null=null;

  previewUrl:string|null=null;


  defaultAvatar='assets/default-avatar.png';



  constructor(
    private userService:UserService,
    private filmService:FilmService,
    private cd:ChangeDetectorRef
  ){}



  ngOnInit():void{

    this.loadProfile();

  }





  loadProfile():void{


    console.clear();

    console.log('========== PROFILE ==========');


    this.loading=true;



    this.userService.getProfile()
    .subscribe({

      next:(data:any)=>{


        console.log(
          '[PROFILE DATA]',
          data
        );



        this.user =
          data?.user ?? null;



        this.favorites =
          data?.favorites ?? [];



        console.log(
          'USER:',
          this.user
        );


        console.log(
          'FAVORITES:',
          this.favorites.length
        );



        this.loading=false;



        /*
          Force Angular à refaire
          le rendu immédiatement
        */
        this.cd.detectChanges();



      },


      error:(err)=>{


        console.error(
          '[PROFILE ERROR]',
          err
        );


        this.loading=false;


        this.cd.detectChanges();


      }


    });



  }






 get avatarUrl(): string {

      if (this.previewUrl) {
          return this.previewUrl;
      }

      if (this.user?.photo_url) {
          return this.user.photo_url;
      }

      return this.defaultAvatar;

  }





  onFileSelected(event:any){


    const file =
      event.target.files?.[0];


    if(!file)return;



    this.selectedFile=file;



    const reader =
      new FileReader();


    reader.onload=()=>{


      this.previewUrl =
        reader.result as string;


      this.cd.detectChanges();

    };


    reader.readAsDataURL(file);



  }







  uploadPhoto(){


    if(!this.selectedFile)
      return;



    const formData =
      new FormData();


    formData.append(
      'photo',
      this.selectedFile
    );



    this.userService
    .updateProfile(formData)
    .subscribe({


      next:()=>{


        console.log(
          '[PHOTO UPDATED]'
        );


        this.selectedFile=null;

        this.previewUrl=null;


        this.loadProfile();


      },


      error:(err)=>{


        console.error(
          err
        );

      }


    });



  }








  removeFavorite(id:number){


    this.filmService
    .removeFavorite(id)
    .subscribe({


      next:()=>{


        this.favorites =
        this.favorites.filter(
          f=>f.tmdb_id!==id
        );


        this.cd.detectChanges();


      },


      error:err=>
        console.error(err)


    });


  }







  updatePassword(){


    if(this.newPassword.length < 6)
      return;



    this.userService
    .updatePassword(this.newPassword)
    .subscribe({


      next:()=>{


        this.newPassword='';

        this.passwordSuccess=true;


        setTimeout(()=>{


          this.passwordSuccess=false;


          this.cd.detectChanges();


        },3000);



      },


      error:err=>
        console.error(err)


    });


  }


}