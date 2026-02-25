import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import type * as Leaflet from 'leaflet';

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

  private mapInstance?: Leaflet.Map;
  private static leafletPromise?: Promise<typeof Leaflet>;
  private static leafletIconConfigured = false;
  
  get hasCoordinates(): boolean {
    return this.latitude != null && this.longitude != null;
  }

  ngOnChanges(): void {
    queueMicrotask(() => void this.renderMap());
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  private destroyMap(): void {
    this.mapInstance?.remove();
    this.mapInstance = undefined;
  }

  private async renderMap(): Promise<void> {
    const { latitude, longitude, mapContainer } = this;

    if (latitude == null || longitude == null || !mapContainer) {
      this.destroyMap();
      return;
    }

    this.destroyMap();
    const leaflet = await this.getLeaflet();
    if (!this.mapContainer) return;

    const map = leaflet.map(this.mapContainer.nativeElement).setView([latitude, longitude], 13);
    this.mapInstance = map;

    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = leaflet.marker([latitude, longitude]).addTo(map);
    if (this.markerLabel.trim()) marker.bindPopup(this.markerLabel).openPopup();
  }

  private async getLeaflet(): Promise<typeof Leaflet> {
    MapComponent.leafletPromise ??= import('leaflet');
    const leaflet = await MapComponent.leafletPromise;

    if (!MapComponent.leafletIconConfigured) {
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      });
      MapComponent.leafletIconConfigured = true;
    }

    return leaflet;
  }
}
