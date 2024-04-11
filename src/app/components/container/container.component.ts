import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent {
}
