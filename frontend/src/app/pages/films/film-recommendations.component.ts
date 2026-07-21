import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { FilmService } from '../../core/film.service';


@Component({
  selector: 'app-film-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './film-recommendations.component.html',
  styleUrls: ['./film-recommendations.component.css']
})
export class FilmRecommendationsComponent
implements OnInit, OnDestroy {


  searchTerm = '';

  films:any[] = [];

  filteredFilms:any[] = [];

  favorites:any[] = [];

  themes:any[] = [];

  filmsByTheme:any[] = [];

  loading = false;


  private subscriptions =
    new Subscription();



  constructor(
    private filmService:FilmService,
    private cd:ChangeDetectorRef
  ){}



  ngOnInit():void {


    console.log('[FILMS] INIT');


    this.loadFavorites();

    this.loadThemes();

    this.loadPopular();


  }




  ngOnDestroy():void {

    this.subscriptions.unsubscribe();

  }





  loadThemes():void {


    const sub =
    this.filmService.getThemes()
    .subscribe({

      next:(themes:any[])=>{


        console.log(
          '[THEMES]',
          themes
        );


        this.themes = themes;


        this.loadThemeRows();


        this.cd.detectChanges();


      },


      error:(err:any)=>{

        console.error(
          '[THEMES ERROR]',
          err
        );


      }


    });


    this.subscriptions.add(sub);

  }







loadThemeRows():void {

this.filmsByTheme = [];


this.themes.forEach(theme=>{


const sub =
this.filmService
.getFilmsByTheme(theme.id)
.subscribe({

next:(films:any)=>{


const movies =
Array.isArray(films)
? films
: films?.results ?? [];



this.filmsByTheme.push({

id:theme.id,
name:theme.name,
films:movies.slice(0,20)

});



this.filmsByTheme.sort(
(a,b)=>a.id-b.id
);


this.cd.detectChanges();



},


error:(err:any)=>{

console.error(
'[THEME ERROR]',
theme.name,
err
);


}



});


this.subscriptions.add(sub);



});


}





  loadPopular():void {


    this.loading=true;


    const sub =
    this.filmService.getPopular()
    .subscribe({

      next:(response:any)=>{


        this.films =
        response.results ??
        response;


        this.filteredFilms=[
          ...this.films
        ];


        this.loading=false;


        this.cd.detectChanges();


      },


      error:(err:any)=>{


        console.error(
          err
        );


        this.loading=false;


      }


    });


    this.subscriptions.add(sub);

  }







  loadFavorites():void {


    if(!this.filmService.hasAuth()){

      this.favorites=[];

      return;

    }



    const sub =
    this.filmService.getFavorites()
    .subscribe({

      next:(data:any)=>{


        this.favorites =
        data ?? [];


        this.cd.detectChanges();

      },


      error:(err:any)=>{


        console.error(err);


        this.favorites=[];


      }


    });


    this.subscriptions.add(sub);


  }






  isFavorite(film:any):boolean{


    return this.favorites.some(
      f =>
      f.tmdb_id === film.id
    );


  }






  addFavorite(film:any):void{


    if(!this.filmService.hasAuth()){

      return;

    }


    if(this.isFavorite(film)){

      return;

    }



    this.favorites.push({

      tmdb_id:film.id,

      title:film.title,

      poster_path:film.poster_path

    });



    const sub =
    this.filmService
    .addFavorite({

      tmdb_id:film.id,

      title:film.title,

      poster_path:film.poster_path

    })
    .subscribe({

      error:(err:any)=>{


        console.error(err);


        this.favorites =
        this.favorites.filter(
          f =>
          f.tmdb_id !== film.id
        );


      }


    });


    this.subscriptions.add(sub);


  }






  searchFilms():void{


    const term =
    this.searchTerm
    .toLowerCase()
    .trim();



    if(!term){

      this.filteredFilms=[
        ...this.films
      ];

      return;

    }



    this.filteredFilms =
    this.films.filter(

      film =>
      film.title
      ?.toLowerCase()
      .includes(term)

    );


  }






  trackById(
    index:number,
    item:any
  ){

    return item.id;

  }
  scrollToTheme(id:number):void {


    const element =
    document.getElementById(
    'theme-'+id
    );


    if(element){

    element.scrollIntoView({

    behavior:'smooth',
    block:'start'

    });

    }


    }
   scrollLeft(id:number):void {

 const row =
 document.getElementById(
 'row-'+id
 );

 if(row){

 row.scrollBy({
   left:-500,
   behavior:'smooth'
 });

 }

}



scrollRight(id:number):void {

 const row =
 document.getElementById(
 'row-'+id
 );


 if(row){

 row.scrollBy({
   left:500,
   behavior:'smooth'
 });

 }

}
}