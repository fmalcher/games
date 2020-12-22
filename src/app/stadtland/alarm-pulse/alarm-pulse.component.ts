import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alarm-pulse',
  templateUrl: './alarm-pulse.component.html',
  styleUrls: ['./alarm-pulse.component.scss'],
})
export class AlarmPulseComponent implements OnInit {
  @Input() value: any;

  constructor() {}

  ngOnInit(): void {}
}
