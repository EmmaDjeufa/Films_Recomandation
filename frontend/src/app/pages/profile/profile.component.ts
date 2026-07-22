import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';


import {
  CommonModule
} from '@angular/common';


import {
  FormsModule
} from '@angular/forms';


import {
  UserService
} from '../../core/user.service';


import {
  FilmService
} from '../../core/film.service';




@Component({

selector:'app-profile',

standalone:true,

imports:[

CommonModule,

FormsModule

],

templateUrl:'./profile.component.html',

styleUrls:['./profile.component.css']

})


export class ProfileComponent implements OnInit {



user:any=null;


favorites:any[]=[];


themes:any[]=[];


similarUsers:any[]=[];


recommendations:any[]=[];


ranking:number|null=null;



loading=true;



selectedFile:File|null=null;


previewUrl:string|null=null;


avatarError=false;


passwordSuccess=false;


newPassword='';



readonly defaultAvatar=
'images/default.png';




constructor(

private userService:UserService,

private filmService:FilmService,

private cd:ChangeDetectorRef

){}





ngOnInit(){

this.loadProfile();

}





// ===================================
// CHARGEMENT PROFIL
// ===================================


loadProfile(){


console.log(

"[PROFILE] loading"

);



this.loading=true;



this.userService
.getProfile()
.subscribe({

next:(data)=>{



console.log(

"[PROFILE DATA]",

data

);



this.user=data.user;


this.favorites=
data.favorites || [];


this.themes=
data.themes || [];


this.similarUsers=
data.similarUsers || [];


this.ranking=
data.ranking;


this.recommendations=
data.recommendations || [];



this.loading=false;



this.cd.detectChanges();



},



error:(err)=>{


console.error(

"[PROFILE ERROR]",

err

);


this.loading=false;



}

});

}





// ===================================
// AVATAR
// ===================================


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


const file=
event.target.files?.[0];



if(!file){

return;

}



this.selectedFile=file;


this.avatarError=false;



const reader=
new FileReader();



reader.onload=()=>{


this.previewUrl=
reader.result as string;



};



reader.readAsDataURL(file);


}






uploadPhoto(){


if(!this.selectedFile){

return;

}



const formData=
new FormData();



formData.append(

"photo",

this.selectedFile

);




this.userService
.updateProfile(formData)

.subscribe({

next:()=>{


console.log(

"[PHOTO UPDATED]"

);



this.selectedFile=null;


this.previewUrl=null;


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







// ===================================
// FAVORIS
// ===================================


removeFavorite(id:number){



this.favorites=

this.favorites.filter(

f=>f.tmdb_id!==id

);



this.filmService
.removeFavorite(id)

.subscribe({

error:()=>{

this.loadProfile();

}

});


}









// ===================================
// PASSWORD
// ===================================


updatePassword(){



if(

this.newPassword.length<6

){

return;

}



this.userService

.updatePassword(

this.newPassword

)

.subscribe({

next:()=>{


this.newPassword='';


this.passwordSuccess=true;



setTimeout(()=>{


this.passwordSuccess=false;


},3000);



},



error:(err)=>{


console.error(

"[PASSWORD ERROR]",

err

);


}

});

}




}