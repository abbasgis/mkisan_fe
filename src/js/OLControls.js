import MousePosition from "ol/control/MousePosition";
import {format} from 'ol/coordinate';
import {FullScreen, ScaleLine, ZoomToExtent} from "ol/control";
import "ol-ext/dist/ol-ext.css";
import '../css/custom_layerswitcher.css';
import '../css/custom_css.css';
import Legend from "ol-ext/legend/Legend";
import LegendControl from 'ol-ext/control/Legend';
import GeoBookmark from "ol-ext/control/GeoBookmark";
import {transform} from "ol/proj";
import SearchNominatim from "ol-ext/control/SearchNominatim";
import {GeoJSON} from "ol/format";
import {getCenter} from "ol/extent";
import selectIcon from '../img/icons/yes.png';
import deleteIcon from '../img/icons/delete.png';
import polygonIcon from '../img/icons/ruler_square.png';
import rectangleIcon from '../img/icons/icon_zoomrect.gif';
import identifyIcon from '../img/icons/icon_information.png';
import {Draw, Select} from "ol/interaction";
import Bar from "ol-ext/control/Bar";
import Toggle from "ol-ext/control/Toggle";
import Button from "ol-ext/control/Button";
import Polygon from "ol/geom/Polygon";
import {createBox} from "ol/interaction/Draw";
import Config from "./Config";
import {XYZ} from "ol/source";
import MapApi, {MapAPIs} from "./utils/MapApi";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";

class OLControls {
    map = null;
    mapVm = null;
    lm = null;
    api = null;
    selectionLayer = null;
    setGaugeVal = null

    constructor(map, layerManager, setGaugeVal) {
        let me = this;
        this.map = map;
        this.setGaugeVal = setGaugeVal;
        this.lm = layerManager;
        this.api = new MapApi();
        me.currentMapInteraction = null;
        me.selectionLayer = this.lm.getSelectionLayer()
        // map.addControl(new ZoomSlider(),)

        this.map.addControl(new FullScreen());
        this.map.addControl(new ScaleLine());
        this.map.addControl(new ZoomToExtent({
            extent: Config.extent_3857, // specify the extent to zoom to
        }));
        const mousePosition = new MousePosition({
            coordinateFormat: function (coordinate) {
                // console.log(coordinate);  // displaying coordinate at each change
                return format(coordinate, 'Lat: {y}, Long: {x}', 4);
            },
            projection: 'EPSG:4326',
        });
        this.map.addControl(mousePosition);
        let bm = new GeoBookmark({
            // className: 'custom-search-control',
            marks: {
                Paris: {pos: transform([2.351828, 48.856578], 'EPSG:4326', 'EPSG:3857'), zoom: 11, permanent: true},
                London: {pos: transform([-0.1275, 51.507222], 'EPSG:4326', 'EPSG:3857'), zoom: 11, permanent: true},
            }
        });
        this.map.addControl(bm);
        //Legend
        // Define a new legend
        var legend = new Legend({
            title: 'Legend',
            style: me.selectionLayer.getStyle()
        })
        var legendCtrl = new LegendControl({
            legend: legend,
            collapsed: false
        });
        map.addControl(legendCtrl);
        var layerSwitcher = new LayerSwitcher({
            tipLabel: 'Légende', // Optional label for button
            groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
        });
        me.map.addControl(layerSwitcher);
        // legend.addItem({
        //     label: 'Google',
        //     html: '<img src="' + selectIcon + '" alt="Delete" width="16" height="16">',
        // });
        // legend.addItem(new LegendImage({
        //     title: 'Geology',
        //     src: 'http://geoservices.brgm.fr/geologie?language=fre&version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=GEOSERVICES_GEOLOGIE&format=image/png&STYLE=default'
        // }))

        // The search control
        // Set the search control
        let search = new SearchNominatim({
            //target: $(".options").get(0),
            // className: 'custom-search-control',
            collapsed: true,
            polygon: false,
            reverse: true,
            position: true	// Search, with priority to geo position
        });
        // search.setPosition('bottom-right');
        map.addControl(search);
        // Select feature when click on the reference index
        search.on('select', function (e) {
            // console.log(e);
            me.selectionLayer.getSource().clear();
            // Check if we get a geojson to describe the search
            if (e.search.geojson) {
                let format = new GeoJSON();
                let f = format.readFeature(e.search.geojson, {
                    dataProjection: "EPSG:4326",
                    featureProjection: map.getView().getProjection()
                });
                me.selectionLayer.getSource().addFeature(f);
                let view = map.getView();
                let resolution = view.getResolutionForExtent(f.getGeometry().getExtent(), map.getSize());
                let zoom = view.getZoomForResolution(resolution);
                let center = getCenter(f.getGeometry().getExtent());
                // redraw before zoom
                setTimeout(function () {
                    view.animate({
                        center: center,
                        zoom: Math.min(zoom, 16)
                    });
                }, 100);
            } else {
                map.getView().animate({
                    center: e.coordinate,
                    zoom: Math.max(map.getView().getZoom(), 16)
                });
            }
        });

        // Main control bar
        let mainbar = new Bar();
        map.addControl(mainbar);

        // Edit control bar
        let editbar = new Bar({
            toggleOne: true,	// one control active at the same time
            group: false			// group controls together
        });
        mainbar.addControl(editbar);
        mainbar.setPosition('top')

        let selectCtrl = new Toggle({
            html: '<img src="' + selectIcon + '" alt="Delete" width="16" height="16">',
            title: "Select",
            interaction: new Select({hitTolerance: 2}),
            autoActivate: true,
            active: true
        });

        editbar.addControl(selectCtrl);

        // Add editing tools
        let pedit = new Toggle({
            html: '<img src="' + rectangleIcon + '" alt="Delete" width="16" height="16">',
            title: 'Point',
            interaction: new Draw({
                type: 'Point',
                source: me.selectionLayer.getSource()
            })
        });
        // editbar.addControl(pedit);

        let fedit = new Button({
            html: '<img src="' + polygonIcon + '" alt="Delete" width="16" height="16">',
            title: 'Polygon',
            handleClick: function () {
                me.removeAllDrawInteractionsFromMap(map)
                me.currentMapInteraction = new Draw({
                    type: 'Polygon',
                    source: me.selectionLayer.getSource(),
                    // Count inserted points
                    geometryFunction: function (coordinates, geometry) {
                        this.nbpts = coordinates[0].length;
                        if (geometry) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
                        else geometry = new Polygon(coordinates);
                        return geometry;
                    }
                });
                map.addInteraction(me.currentMapInteraction);
                me.drawInteractionsManagement()
            }
        });
        editbar.addControl(fedit);

        let rectangle = new Button({
            html: '<img src="' + rectangleIcon + '" alt="Delete" width="16" height="16">',
            title: 'Rectangle',
            // interaction: new Draw({
            //     type: 'Circle',
            //     source: selectionLayer.getSource(),
            //     // Count inserted points
            //     geometryFunction: createBox()
            // }),
            handleClick: function () {
                me.removeAllDrawInteractionsFromMap(map)
                me.currentMapInteraction = new Draw({
                    source: me.selectionLayer.getSource(),
                    type: 'Circle',
                    geometryFunction: createBox()
                });
                map.addInteraction(me.currentMapInteraction);
                me.drawInteractionsManagement();
            }
        });

        editbar.addControl(rectangle);

        let identifyCtrl = new Button({
            html: '<img src="' + identifyIcon + '" alt="Delete" width="16" height="16">',
            title: "Identify",
            interaction: new Select({hitTolerance: 2}),
            // autoActivate: true,
            active: true,
            handleClick: function () {
                map.getInteractions().getArray().forEach(interaction => {
                    if (interaction instanceof Draw) {
                        map.removeInteraction(interaction);
                    }
                });
                if (me.currentMapInteraction !== null) {
                    map.removeInteraction(me.currentMapInteraction);
                }
                me.currentMapInteraction = null;
                map.on('click', function (evt) {
                    // me.map.removeInteraction(me.currentMapInteraction);
                    if (!(me.currentMapInteraction instanceof Draw)) {
                        me.displayFeatureInfo(evt);
                    }
                });
            }
        });

        editbar.addControl(identifyCtrl);

        let clearCtrl = new Button({
            html: '<img src="' + deleteIcon + '" alt="Delete" width="16" height="16">',
            title: "Clear",
            // interaction: new Select({hitTolerance: 2}),
            // autoActivate: true,
            active: true,
            handleClick: function () {
                me.selectionLayer.getSource().clear()
            }
        });

        editbar.addControl(clearCtrl);


        // Show info
        function info(i) {
            console.log(i || "");
        }

    }

    displayFeatureInfo(evt) {
        let me = this;
        let map = me.map;
        let pixel = evt.pixel;
        let coord = evt.coordinate;
        const features = [];
        let projCode = map.getView().getProjection().getCode();
        if (projCode === 'EPSG:3857') {
            coord = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        }
        map.forEachFeatureAtPixel(pixel, function (feature, lyr) {
            feature['layer_name'] = lyr.get('name');
            feature['layer_title'] = lyr.get('title');
            features.push(feature);
        });
        me.getRasterPixelValue(coord)
        // if (features.length > 0) {
        //     let vectorSource = mapVm.getSelectionLayer().getSource();
        //     vectorSource.clear();
        //     let feature = features[0];
        //     if(feature['layer_name'] ==="weather_data"){
        //         feature =feature.getProperties().features[0]
        //     }
        //     let gType = feature.getGeometry().getType()
        //     if (gType === 'Polygon' && feature.flatCoordinates_) {
        //         const inflatedCoordinates = inflateCoordinatesArray(
        //             feature.getFlatCoordinates(), // flat coordinates
        //             0, // offset
        //             feature.getEnds(), // geometry end indices
        //             2, // stride
        //         )
        //         const polygonFeature = new Feature(new Polygon(inflatedCoordinates));
        //         polygonFeature.setProperties(feature.getProperties())
        //         vectorSource.addFeatures([polygonFeature]);
        //     } else if (gType === 'LineString' && feature.flatCoordinates_) {
        //         const inflatedCoordinates = inflateCoordinatesArray(
        //             feature.getFlatCoordinates(), // flat coordinates
        //             0, // offset
        //             feature.getEnds(), // geometry end indices
        //             2, // stride
        //         )
        //         const lineFeature = new Feature(new LineString(inflatedCoordinates[0]));
        //         lineFeature.setProperties(feature.getProperties())
        //         vectorSource.addFeatures([lineFeature]);
        //     }
        //     let row = '';
        //     for (let key in feature.getProperties()) {
        //         row = row + key + ":  " + feature.get(key) + " , "
        //     }
        //     // alert(row || '&nbsp');
        //     // me.showJsonDataInHTMLTable(feature.getProperties(), 'v', targetElem);
        //     if(feature.hasOwnProperty('layer_name')){
        //         me.getFeatureDetailFromDB(feature, mapVm, targetElem);
        //     }
        // } else {
        //     // alert('&nbsp;');
        // }
    };

    getRasterPixelValue(coord) {
        let me = this;
        Object.keys(me.lm.overlayLayers).forEach((key) => {
            const lyr = me.lm.overlayLayers[key]
            if (lyr.getSource() instanceof XYZ) {
                let layer_name = lyr.get('name');
                let layer_title = lyr.get('title');
                me.getApi().get(MapAPIs.LAYER_PIXEL_VALUE, {uuid: layer_name, long: coord[0], lat: coord[1]}, true)
                    .then((payload) => {
                        if (payload) {
                            let obj = {'layer': layer_title, 'value': payload}
                            me.setGaugeVal(parseInt(payload.b1))
                            // me.showJsonDataInHTMLTable(obj, 'raster', targetElem);
                        }
                    });
            }
        });

    }

    getApi() {
        return this.api;
    }

    removeAllDrawInteractionsFromMap(map) {
        map.getInteractions().getArray().forEach(interaction => {
            if (interaction instanceof Draw) {
                map.removeInteraction(interaction);
            }
        });
    }

    drawInteractionsManagement = function () {
        let me = this;
        if (me.currentMapInteraction) {
            me.currentMapInteraction.on('drawstart', function (e) {
                me.selectionLayer.getSource().clear();
            });
            me.currentMapInteraction.on('drawend', function (event) {
                let feature = event.feature;
                let writer = new GeoJSON();
                let geoJsonStr = writer.writeFeatures([feature], {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                // console.log(geoJsonStr);
                me.getRasterValueFromGeoJson(geoJsonStr)

            });
        }
    }
    getRasterValueFromGeoJson = function (geoJsonStr) {
        let me = this;
        Object.keys(me.lm.overlayLayers).forEach((key) => {
            const lyr = me.lm.overlayLayers[key]
            if (lyr.getSource() instanceof XYZ) {
                let layer_name = lyr.get('name');
                let layer_title = lyr.get('title');
                me.getApi().post(MapAPIs.LAYER_PIXEL_VALUE_FROM_GEOJSON, geoJsonStr, {uuid: layer_name}, true)
                    .then((payload) => {
                        if (payload) {
                            let obj = {'layer': layer_title, 'value': payload}
                            let v = parseInt(payload.payload.b1.mean)
                            me.setGaugeVal(v)
                            // me.showJsonDataInHTMLTable(obj, 'raster', targetElem);
                        }
                    });
            }
        });
    }
}

export default OLControls;