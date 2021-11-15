import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { Game } from '../models/Game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  cols = [1,2,3,4,5,6,7,8,9,10];
  rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];//estas variables son para dibujar el tablero en el html

  shipsTaken = [4,3,3,2,2,2,1,1,1,1];//esta variable nos ayuda a encolar el proceso de asignacion aleatorea de barcos

  ships:string[][] = []; //lista de barcos

  positions:string[] = [];//guardamos la lista de coordenadas de todos los barcos


  shoots:string[] = [];//alamcenamos las coordenadas qeu han sido disparadas

  shipsDestroyed:string[] = [];

  level = 0; //para saber el niver de dificultad
  
  counterTurns = "∞";
  
  constructor(public activateRoute: ActivatedRoute, public dialog: MatDialog, public router: Router) { 
    this.putShipInGrid();
    this.startCounter();
  }

  
  ngOnInit(): void {
  }

  replay(){
    this.shipsTaken = [4,3,3,2,2,2,1,1,1,1];
    this.ships = [];
    this.positions = [];
    this.shoots = [];
    this.shipsDestroyed = [];
    this.putShipInGrid();
    this.startCounter();
  }

  startCounter(){
    this.level = this.activateRoute.snapshot.params['id'];
    if(this.level > 0){
      this.counterTurns = this.level.toString();
    }else{
      this.counterTurns = "∞";
    }
  }

  putShipInGrid(){
    let size = this.shipsTaken[0];
    let ship = this.getPositionShip(size);
    if(this.checkIfShipIsInGrid(ship)){
      this.ships.push(ship);
      this.positions = this.positions.concat(ship);
      if(this.shipsTaken.length > 1){
        this.shipsTaken.shift();
        this.putShipInGrid();
      }else{
        this.shipsTaken.shift();
        console.log(this.ships);
      }
    }else{
      this.putShipInGrid();
    }
  
  }


  getPositionShip(size:number){
    let fCol = this.getRandomInt(1,10);//del 1 al 10
    let letfRow = this.getRandomInt(0,9);//de la A a la J
    let getIfVertical = this.getRandomInt(0,1); //saber si es vertical u horizontal
    let fPos = this.rows[letfRow] + fCol; //posicion inicial
    
    let ship:string[] = []; //array con las posiciones del barco
    ship.push(fPos);
    if(getIfVertical == 0){
      if(fCol - size >= 1){
        for(let i = 1; i < size; i++){
          ship.push(this.rows[letfRow] + (fCol - i));
        }
      }else{
        for(let i = 1; i < size; i++){
          ship.push(this.rows[letfRow] + (fCol + i));
        }
      }
      return ship;
    }else{
      if(letfRow - size >= 0){
        for(let i = 1; i < size; i++){
          ship.push(this.rows[letfRow - i] + fCol);
        }
      }else{
        for(let i = 1; i < size; i++){
          ship.push(this.rows[letfRow + i] + fCol);
        }
      }
      return ship;
    }
  }

  //saber si una posicion esta ocupada por algun barco
  checkIfPosIsInPositions(pos:string){
    return this.positions.includes(pos);
  }

  checkIfShipIsInGrid(ship:string[]){
    let flag = true;
    ship.forEach(pos => {
      if(this.checkIfPosIsInPositions(pos)){
        flag = false;
      }
    });
    return flag;
  }


  //funcion para obtener un numero aleatorio
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //para saber si la posicion esta ocupada por un barco
  checkIfPosIsInPositionsCoord(row:string, col:number){
    let pos = row+col;
    return this.positions.includes(pos);
  }

  //para saber si una posicion ha sido disparada
  checkIfPosIsInPositionsCoordShooted(row:string, col:number){
    let pos = row+col;
    return this.shoots.includes(pos);
  }

  checkIfShipIsDestroyedCoord(row:string, col:number){
    let pos = row+col;
    return this.shipsDestroyed.includes(pos);
  }

  //al disparar una posicion
  shot(row:string, col:number){
    let pos = row+col;
    if(this.checkIfPosIsInPositionsCoordShooted(row, col)){
      //eventos en caso de que ya se haya disparado en esta posicion
    }else{
      if(this.counterTurns == "∞" || this.level > 0){
        this.shoots.push(pos);
        this.counterTurnsLeft();
        this.checkIfShipIsDestroyed();
        if(this.level == 0 && this.checkIfUserWinOrLoose()){
          this.openDialog("Congratulations, you win!");//ganamos
          this.saveGameInHistory("You win");
        }
        if(this.level == 0 && !this.checkIfUserWinOrLoose()){
          this.openDialog("Sorry, you loose...");//perdemos
          this.saveGameInHistory("You loose");
        }
        if(this.level > 0 && this.checkIfUserWinOrLoose()){
          this.openDialog("Congratulations, you win!");//ganamos
          this.saveGameInHistory("You win");
        }
      }
    }
  }


  counterTurnsLeft(){
    if(this.counterTurns != "∞"){
      this.level--;
      this.counterTurns = this.level.toString();
    }
  }

  checkIfShipIsDestroyed(){
    for(let i = 0; i < this.ships.length; i++){
      let ship = this.ships[i];
      let flag = true;
      let counter = 0;
      ship.forEach(pos => {
        if(this.shoots.includes(pos)){
          counter++;
        }
      });
      if(counter == ship.length){
        this.shipsDestroyed = this.shipsDestroyed.concat(ship);
      }
    }
  }


  openDialog(tittle:string, ): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {title:tittle},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.replay();
    });
  }

  //verifica si ya todos los barcos han sido destruidos
  checkIfUserWinOrLoose():boolean{
    let flag = false;
    if(this.positions.every(pos => this.shoots.includes(pos))){
      flag = true;  
    }
    return flag;
  }

  goToHome(){
    this.router.navigate(["/"]);
  }

  resume(){
    this.router.navigate(["/resume/"+this.activateRoute.snapshot.params['id']]);
  }

  //guardamos la partida
  saveGameInHistory(status:string){
    let game:Game = new Game();
    game.date = this.convertDateToYearMonthDayHourMinuteSecond(new Date());
    game.level = this.activateRoute.snapshot.params['id'];
    game.movements = this.shoots;
    game.status = status;
    game.shots = this.shoots.length;
    let games = [];
    let gamesString = localStorage.getItem("games") == null || localStorage.getItem("games") == undefined ? "" : localStorage.getItem("games");
    games = JSON.parse(gamesString || "[]");
    games.push(game);
    localStorage.setItem("games", JSON.stringify(games));
  }

  convertDateToYearMonthDayHourMinuteSecond(date:Date){
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }

}
