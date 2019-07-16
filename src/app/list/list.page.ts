import { Component, OnInit } from '@angular/core';
import { Run } from '../wegstrecke/wegstrecke.page';
import { saveConfig } from '@ionic/core';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  previousRuns: Run[];
  constructor() {

  }

  ngOnInit() {
    this.previousRuns = JSON.parse(localStorage.getItem('previousRuns')) as Run[];
    this.previousRuns.reverse();
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }

  deleteElement(run: Run) {
    console.log(run);
    this.previousRuns = this.previousRuns.filter(x => x !== run);
    console.log(this.previousRuns);
    this.save();
  }

  deleteAllElements() {
    this.previousRuns = [];
    this.save();
  }

  save() {
    localStorage.setItem('previousRuns', JSON.stringify(this.previousRuns));
  }

  viewSpecificRun(run: Run) {
    localStorage.setItem('viewRun', JSON.stringify(run));
  }

}
