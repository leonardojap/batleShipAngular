import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  numShots:number = 45;

  constructor(public router: Router) { }

  

  ngOnInit(): void {
  }

  play(value:number){
    this.router.navigate(["/game/"+value]);
  }

  start(){
    this.router.navigate(["/game/"+this.numShots]);
  }
  

}
