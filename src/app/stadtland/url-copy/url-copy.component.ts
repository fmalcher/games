import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { merge, Subject, timer } from 'rxjs';
import { map, mapTo, shareReplay, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-url-copy',
  templateUrl: './url-copy.component.html',
  styleUrls: ['./url-copy.component.scss'],
})
export class UrlCopyComponent implements OnInit {
  url = this.getUrl();

  private copyEvent$ = new Subject();
  copyTextState$ = merge(
    this.copyEvent$.pipe(mapTo(true)),
    this.copyEvent$.pipe(switchMap(() => timer(1000).pipe(mapTo(false))))
  ).pipe(startWith(false), shareReplay(1));

  constructor(private clipboard: Clipboard) {}

  ngOnInit(): void {
    this.copyEvent$.subscribe(() => {
      this.clipboard.copy(this.url);
    });
  }

  getUrl() {
    let url = window.location.href;
    const suffix = '/landing';

    if (url.endsWith(suffix)) {
      url = url.slice(0, url.length - suffix.length);
    }

    return url;
  }

  canShare() {
    return !!navigator.share;
  }

  share() {
    navigator.share({
      title: 'Stadt Land Fluss',
      text: `Spiel mit uns eine Runde "Stadt Land Fluss"! 🏘 🌍 🐳 ${this.url}`,
    });
  }

  copy() {
    this.copyEvent$.next();
  }
}
