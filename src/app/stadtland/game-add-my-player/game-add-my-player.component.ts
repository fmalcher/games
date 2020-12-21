import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { slfConfig } from '../shared/config';
import { StadtlandService } from '../shared/stadtland.service';

@Component({
  selector: 'app-game-add-my-player',
  templateUrl: './game-add-my-player.component.html',
  styleUrls: ['./game-add-my-player.component.scss'],
})
export class GameAddMyPlayerComponent implements OnInit {
  form: FormGroup;
  emojiPanelVisible = false;
  emojis = slfConfig.emojis;

  constructor(private sls: StadtlandService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      emoji: new FormControl(this.randomEmoji(this.emojis)),
    });
  }

  randomEmoji(emojis: string[]) {
    const rnd = Math.floor(Math.random() * emojis.length);
    return emojis[rnd];
  }

  toggleEmojiPanel() {
    this.emojiPanelVisible = !this.emojiPanelVisible;
  }

  setEmoji(emoji: string) {
    this.form.get('emoji').setValue(emoji);
    this.emojiPanelVisible = false;
  }

  submitForm(): void {
    const name = this.form.get('name').value;
    const emoji = this.form.get('emoji').value;
    if (!name || !emoji) {
      return;
    }
    this.sls.addPlayer(name, emoji).subscribe();
  }
}
