import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'MapaCalorDengue';

  ngOnInit(): void {
    
  }

  scroll(value: any){

    let element = document.getElementById(value);
    if(element)
      element.scrollIntoView({block: "end", behavior: "smooth"});
  
  }

}