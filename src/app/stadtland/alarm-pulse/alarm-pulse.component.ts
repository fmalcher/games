import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alarm-pulse',
  templateUrl: './alarm-pulse.component.html',
  styleUrls: ['./alarm-pulse.component.scss'],
})
export class AlarmPulseComponent {
  @Input() value?: string | number;
}
