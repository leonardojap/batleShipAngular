import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../models/Game';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  numShots = 0;

  displayedColumns: string[] = ['date', 'status', 'level', 'movements'];

  games: Game[]; //
  /*
  level
  movements
  status
  shots
  date
  */

  constructor(public router: Router, public activateRoute: ActivatedRoute) { 
    this.numShots = this.activateRoute.snapshot.params['id'];
    this.games = [];
    this.games = JSON.parse(localStorage.getItem('games') || '[]');
  }

  ngOnInit(): void {
  }

  goToHome(){
    this.router.navigate(["/"]);
  }

  game(){
    this.router.navigate(["/game/"+this.numShots]);
  }

}
