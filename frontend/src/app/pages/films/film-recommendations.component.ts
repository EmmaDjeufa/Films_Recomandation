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
  

    this.loadFavorites();

    this.loadPopular();
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

      next: (response: any) => {

        this.films = Array.isArray(response)
          ? response
          : [];

        this.loading = false;

        this.loadFavorites();

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


  isFavorite(film: any): boolean {
    return this.favorites.some(f => f.tmdb_id === film.id);
  }


  loadFavorites(): void {

    if (!this.filmService.hasAuth()) {
      this.favorites = [];
      return;
    }

    const sub = this.filmService.getFavorites()
      .subscribe({

        next: (data: any) => {
          console.log('FAVORITES', data);

          this.favorites = data ?? [];

          this.cd.detectChanges();

        },

        error: () => {

          this.favorites = [];

          this.cd.detectChanges();

        }

      });

    this.subscriptions.add(sub);

  }




  addFavorite(film: any): void {

    if (!this.filmService.hasAuth()) {
      return;
    }

    if (this.isFavorite(film)) {
      return;
    }

    // Mise à jour immédiate de l'interface
    this.favorites.push({
      tmdb_id: film.id,
      title: film.title,
      poster_path: film.poster_path
    });

    const sub = this.filmService.addFavorite({
      tmdb_id: film.id,
      title: film.title,
      poster_path: film.poster_path
    }).subscribe({

      error: () => {

        // rollback si erreur
        this.favorites = this.favorites.filter(
          f => f.tmdb_id !== film.id
        );

      }

    });

    this.subscriptions.add(sub);

  }



}