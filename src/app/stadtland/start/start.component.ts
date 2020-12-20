import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(private sls: StadtlandService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  createNewGame(): void {
    this.sls.createNewGame().subscribe(id => {
      this.router.navigate([id], { relativeTo: this.route });
    });
  }

}
