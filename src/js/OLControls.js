import MousePosition from "ol/control/MousePosition";
import {format} from 'ol/coordinate';
import {FullScreen, ScaleLine, ZoomSlider, ZoomToExtent} from "ol/control";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
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

class OLControls {
    map = null;
    lm = null;

    constructor(map, layerManager) {
        this.map = map;
        this.lm = layerManager;
        let selectionLayer = this.lm.getSelectionLayer()
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
            style: selectionLayer.getStyle()
        })
        var legendCtrl = new LegendControl({
            legend: legend,
            collapsed: false
        });
        map.addControl(legendCtrl);
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
            selectionLayer.getSource().clear();
            // Check if we get a geojson to describe the search
            if (e.search.geojson) {
                let format = new GeoJSON();
                let f = format.readFeature(e.search.geojson, {
                    dataProjection: "EPSG:4326",
                    featureProjection: map.getView().getProjection()
                });
                selectionLayer.getSource().addFeature(f);
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
        mainbar.setPosition('top-right')

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
                source: selectionLayer.getSource()
            })
        });
        // editbar.addControl(pedit);

        let fedit = new Toggle({
            html: '<img src="' + polygonIcon + '" alt="Delete" width="16" height="16">',
            title: 'Polygon',
            interaction: new Draw({
                type: 'Polygon',
                source: selectionLayer.getSource(),
                // Count inserted points
                geometryFunction: function (coordinates, geometry) {
                    this.nbpts = coordinates[0].length;
                    if (geometry) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
                    else geometry = new Polygon(coordinates);
                    return geometry;
                }
            })
        });
        editbar.addControl(fedit);

        let rectangle = new Toggle({
            html: '<img src="' + rectangleIcon + '" alt="Delete" width="16" height="16">',
            title: 'Rectangle',
            interaction: new Draw({
                type: 'Circle',
                source: selectionLayer.getSource(),
                // Count inserted points
                geometryFunction: createBox()
            })
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
                selectionLayer.getSource().clear()
            }
        });

        editbar.addControl(clearCtrl);

        // Show info
        function info(i) {
            console.log(i || "");
        }

    }
}

export default OLControls;