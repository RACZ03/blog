import {animate, state, style, transition, trigger} from '@angular/animations';

export const fadeLateral =
   trigger('fadeLateral',[
       transition(':enter', [
        style({
          opacity:0,
          transform: 'translateX(-20%)'
     }),
     animate('300ms ease-in',
     style({
          opacity:1,
          transform: 'translateX(0)'

     }))
    ])
  ]);