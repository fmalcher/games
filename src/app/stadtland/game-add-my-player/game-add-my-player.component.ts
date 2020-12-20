import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-add-my-player',
  templateUrl: './game-add-my-player.component.html',
  styleUrls: ['./game-add-my-player.component.scss'],
})
export class GameAddMyPlayerComponent implements OnInit {
  form: FormGroup;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
    });
  }

  submitForm(): void {
    const name = this.form.get('name').value;
    if (!name) {
      return;
    }
    this.sls.addPlayer(name).subscribe();
  }
}
