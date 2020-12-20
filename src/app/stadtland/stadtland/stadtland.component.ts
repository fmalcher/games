import { Component, OnInit } from '@angular/core';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-stadtland',
  templateUrl: './stadtland.component.html',
  styleUrls: ['./stadtland.component.scss']
})
export class StadtlandComponent implements OnInit {

  state$ = this.sls.state$;

  constructor(private sls: StadtlandService) { }

  ngOnInit(): void {
  }

}
