import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  itemsObservable!: Observable<any[]>;

  constructor(private fireDB: AngularFireDatabase) {
    this.itemsObservable = this.fireDB.list('recipes').valueChanges();
  }
}
