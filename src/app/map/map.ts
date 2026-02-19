import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as leaflet from 'leaflet';

delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements OnChanges, OnDestroy {
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() markerLabel = '';

  @ViewChild('mapContainer') private mapContainer?: ElementRef<HTMLDivElement>;

  private mapInstance?: leaflet.Map;
  hasCoordinates = false;

  ngOnChanges(_: SimpleChanges): void {
    this.hasCoordinates = this.latitude != null && this.longitude != null;
    queueMicrotask(() => this.renderMap());
  }

  ngOnDestroy(): void {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = undefined;
    }
  }

  private renderMap(): void {
    if (!this.hasCoordinates || !this.mapContainer) {
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = undefined;
      }
      return;
    }

    const latitude = this.latitude;
    const longitude = this.longitude;
    if (latitude == null || longitude == null) {
      return;
    }

    if (this.mapInstance) {
      this.mapInstance.remove();
    }

    const map = leaflet
      .map(this.mapContainer.nativeElement)
      .setView([latitude, longitude], 13);
    this.mapInstance = map;

    leaflet
      .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      })
      .addTo(map);

    const marker = leaflet.marker([latitude, longitude]).addTo(map);
    if (this.markerLabel.trim()) {
      marker.bindPopup(this.markerLabel).openPopup();
    }
  }
}
