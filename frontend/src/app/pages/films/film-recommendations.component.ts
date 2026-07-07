import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FilmService } from '../../core/film.service';


@Component({
  selector: 'app-film-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-recommendations.component.html',
  styleUrls: ['./film-recommendations.component.css']
})
export class FilmRecommendationsComponent implements OnInit, OnDestroy {


  films:any[] = [];

  favorites:any[] = [];

  loading:boolean = false;

  activeCategory:string = 'popular';


  private subscriptions = new Subscription();



  constructor(
    private filmService:FilmService,
    private router:Router,
    private cd:ChangeDetectorRef
  ){}




  ngOnInit():void {


    console.log('[FILMS] INIT');


    this.loadPopular();


    this.loadFavorites();


  }




  ngOnDestroy():void {

    this.subscriptions.unsubscribe();

  }





  private fetchFilms(
    request$:any,
    category:string
  ):void {



    console.log(
      '[FILMS] Chargement:',
      category
    );



    this.loading=true;

    this.activeCategory=category;



    const sub=request$
    .subscribe({

      next:(response:any)=>{


        console.log(
          '[FILMS] réponse',
          response
        );



        this.films = Array.isArray(response)
          ? response
          : [];



        console.log(
          '[FILMS] Nombre:',
          this.films.length
        );



        this.loading=false;



        // force Angular à rafraîchir
        this.cd.detectChanges();



      },


      error:(err:any)=>{


        console.error(
          '[FILMS] erreur',
          err
        );


        this.films=[];

        this.loading=false;


        this.cd.detectChanges();

      }



    });



    this.subscriptions.add(sub);

  }





  loadPopular():void {


    this.fetchFilms(
      this.filmService.getPopular(),
      'popular'
    );


  }





  loadTopRated():void {


    this.fetchFilms(
      this.filmService.getTopRated(),
      'top'
    );

  }





  loadUpcoming():void {


    this.fetchFilms(
      this.filmService.getUpcoming(),
      'upcoming'
    );

  }





  loadFavorites():void {


    if(!this.filmService.hasAuth()){

      this.favorites=[];

      return;

    }



    const sub=this.filmService.getFavorites()
    .subscribe({

      next:(data:any)=>{

        this.favorites=data;

      },

      error:()=>{

        this.favorites=[];

      }


    });



    this.subscriptions.add(sub);


  }





  addFavorite(film:any):void{


    if(!this.filmService.hasAuth()){

      console.warn(
        'Connexion nécessaire'
      );

      return;

    }



    const sub=this.filmService
    .addFavorite({

      tmdb_id:film.id,
      title:film.title,
      poster_path:film.poster_path

    })
    .subscribe(()=>{

      this.loadFavorites();

    });



    this.subscriptions.add(sub);


  }



}