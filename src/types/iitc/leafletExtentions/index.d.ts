

declare module 'leaflet' {
    function geodesicPolyline(latlngs: L.LatLng[], options?: L.PolylineOptions): GeodesicPolyline;
    function geodesicPolygon(latlngs: L.LatLng[], options?: L.PolylineOptions): GeodesicPolygon;

    class GeodesicPolyline extends L.Polyline {
        getLatLngs(): L.LatLng[];
    }

    // tslint:disable-next-line:no-empty-interface
    class GeodesicPolygon extends GeodesicPolyline {
    }

    // tslint:disable-next-line:no-empty-interface
    class GeodesicCircle extends L.Polyline {
    }
}
