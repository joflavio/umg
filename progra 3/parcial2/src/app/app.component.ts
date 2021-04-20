import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Oferente } from './oferente';


@Component({
  selector: 'miumg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'parcial2';
  public monto:number;
  public nombre:string = "";
  public valueList:Array<Oferente> = [];
  public value=0;
  public miobservable: BehaviorSubject<Oferente> = new BehaviorSubject<Oferente>(null);

  constructor(){
    this.miobservable.asObservable().subscribe((result)=>{
      if (result!=null) this.valueList.push(result);
    });
  }

  public showTable(){
    return this.valueList.length>0;
  }

  public agregarOferente(){
    if (this.nombre.trim().length>0)
      this.miobservable.next(new Oferente(this.nombre,this.monto));
  }

}
