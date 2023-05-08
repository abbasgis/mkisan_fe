import LayerGroup from 'ol/layer/Group';
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import {Stroke, Style} from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import CircleStyle from "ol/style/Circle"
import Fill from "ol/style/Fill";
import Text from 'ol/style/Text';
import Config from "./Config";
// import SLD2OL from "./common/SLD2OL";
import Legend from "ol-ext/legend/Legend";
import {XYZ} from "ol/source";
import URLS_API from "./common/URLS_API";
import {Group} from "ol/layer";

class LayersManager {
    overlayLayers = []
    baseLayers = []
    specialLayers = []
    layers = [
        {
            'title': ' زمیں میں پانی کا تناسب',
            'name': '6104d834-b0e8-11ed-bfa3-010101010000',
            'displayInSwitcher': true,
            'lType': 'raster',
            'url': "http://localhost:3338/layers/mvt_layer/2/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'ol', graphic: null}, // stype is Style Type can be "ol" or "sld"
        },
        {
            'title': 'CROP CONSUMPTION',
            'name': '6104d834-b0e8-11ed-bfa3-010101010001',
            'displayInSwitcher': true,
            'lType': 'raster',
            'url': "http://localhost:3338/layers/mvt_layer/2/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'ol', graphic: null}, // stype is Style Type can be "ol" or "sld"
        },
        {
            'title': 'CROP Min DEMAND',
            'name': '6104d834-b0e8-11ed-bfa3-010101010003',
            'displayInSwitcher': true,
            'lType': 'raster',
            'url': "http://localhost:3338/layers/mvt_layer/2/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'ol', graphic: null}, // stype is Style Type can be "ol" or "sld"
        },
        {
            'title': 'RAINFALL',
            'name': '6104d834-b0e8-11ed-bfa3-010101010006',
            'displayInSwitcher': true,
            'lType': 'raster',
            'url': "http://localhost:3338/layers/mvt_layer/2/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'ol', graphic: null}, // stype is Style Type can be "ol" or "sld"
        },
        {
            'title': 'SOIL MOISTURE',
            'name': '6104d834-b0e8-11ed-bfa3-010101010007',
            'displayInSwitcher': true,
            'lType': 'raster',
            'url': "http://localhost:3338/layers/mvt_layer/2/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'ol', graphic: null}, // stype is Style Type can be "ol" or "sld"
        },
        {
            'title': 'TEMPERATURE',
            'name': '6104d834-b0e8-11ed-bfa3-010101010008',
            'displayInSwitcher': true,
            'lType': 'raster',
            'url': "http://localhost:3338/layers/mvt_layer/2/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'ol', graphic: null}, // stype is Style Type can be "ol" or "sld"
        },
        // {
        //     'title': 'Irrigation Canals',
        //     'name': 'irrigation_canals',
        //     'displayInSwitcher': true,
        //     'lType': 'mvt',
        //     'url': "http://localhost:3338/layers/mvt_layer/1/{z}/{x}/{y}",
        //     'isVisible': true,
        //     'legend': {sType: 'sld', graphic: null}, // stype is Style Type can be "ol" or "sld"
        // },
    ]

    constructor() {
        this.addBaseLayer();
        this.addOverlayLayers();
        // this.updateLayersStyle(this.overlayLayers);
        this.addSelectedFeatureLayer();
    }

    addBaseLayer() {
        if (this.baseLayers.length === 0) {
            this.baseLayers = new LayerGroup({
                name: 'Base Layers',
                info: false,
                title: 'Base Layers',
                fold: 'open',
                openInLayerSwitcher: true,
                layers: [
                    new OlLayerTile({
                        name: "Satellite",
                        title: "Google Satellite",
                        type: "base",
                        visible: false,
                        source: new OlSourceOSM({
                            url: "http://mt{0-3}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                        })
                    }),
                    new OlLayerTile({
                        name: 'Road Map',
                        title: "Google Roads",
                        type: "base",
                        visible: true,
                        displayInLayerSwitcher: true,
                        source: new OlSourceOSM({
                            url: "http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",

                        })
                    }),
                    new OlLayerTile({
                        type: "base",
                        title: "OSM",
                        visible: false,
                        source: new OlSourceOSM()
                    }),
                ]
            });
        }
    };

    addOverlayLayers() {
        let me = this;
        this.layers.forEach(function (layer) {
            // const layer = this.layers[index];
            if (layer.lType === 'raster') {
                layer.url = Config.raster_url
                let mvt_layer = me.getRasterLayer(layer)
                me.overlayLayers.push(mvt_layer)
            } else {
                layer.url = Config.vector_url
                let mvt_layer = me.getVectorLayer(layer)
                me.overlayLayers.push(mvt_layer)
            }
        })
    }

    addMyLayerToMap(layer, map) {
        let me = this;
        let layer_settings = {
            'title': ' زمیں میں پانی کا تناسب',
            'name': '6104d834-b0e8-11ed-bfa3-010101010000',
            'displayInSwitcher': true,
            'lType': 'raster',
            'url': "http://localhost:3338/layers/mvt_layer/2/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'ol', graphic: null}, // stype is Style Type can be "ol" or "sld"
        };
        layer.url = Config.raster_url
        let checkLayer = me.getLayerByName(layer_settings.name)
        if (checkLayer) {
            me.setLayersVisibility(layer_settings.name, map)
        } else {
            // let mvt_layer = me.getRasterLayer(layer_settings)
            // me.overlayLayers.push(mvt_layer)
        }
    }

    getRasterLayer = function (layer) {
        let me = this;
        let url = URLS_API.getURL(layer.url, {uuid: layer.name})
        let mvt_layer = new OlLayerTile({
            title: layer.title,
            name: layer.name,
            visible: layer.isVisible,
            displayInSwitcher: layer.displayInSwitcher,
            // legend: layer.legend,
            source: new XYZ({
                url: `${url}{z}/{x}/{y}`
            }),
            // style: function (feature, res) {
            //     return me.getVectorLayerStyle(feature, layer)
            // }
        });
        return mvt_layer
    }
    getVectorLayer = function (layer) {
        let me = this;
        let mvt_layer = new VectorTileLayer({
            title: layer.title,
            name: layer.name,
            visible: layer.isVisible,
            displayInSwitcher: layer.displayInSwitcher,
            legend: layer.legend,
            source: new VectorTileSource({
                format: new MVT(),
                url: layer.url
            }),
            style: function (feature, res) {
                return me.getVectorLayerStyle(feature, layer)
            }
        });
        return mvt_layer
    }
    getLegendGraphic = function (layer) {
        let tileGrid = layer.getSource().getTileGrid()
        let feature = layer.getSource().getFeaturesInExtent(tileGrid.getExtent());
        let img = Legend.getLegendImage({
            /* given a style  and a geom type*/
            style: layer.getStyle(),
            typeGeom: feature.getGeometry().getType()

        });
        return img;
    }
    // updateLayersStyle = function (arrLayers) {
    //     let k = new SLD2OL()
    //     const me = this;
    //     arrLayers.forEach(function (layer) {
    //         if (layer.get('legend')['sType'] === 'sld') {
    //             k.convertSLD2OL(layer)
    //         } else if (layer.get('legend')['sType'] === 'ol') {
    //             layer.legend = {sType: 'ol', graphic: null}
    //         }
    //     });
    // }

    getVectorLayerStyle(feature, layer) {
        if (layer.legend['sType'] === 'ol') {
            let style = null;
            switch (layer['name']) {
                case "irrigation_canals":
                    style = new Style({
                        stroke: new Stroke({
                            width: 2,
                            color: 'rgba(0, 102, 204)'
                        })
                    })
                    break;
                case "irrigation_divisions":
                    style = new Style({
                        stroke: new Stroke({
                            width: 2,
                            color: 'rgb(10,12,94)'
                        })
                    })
                    break;
                default:
                    break
            }
            return style;
        }

    }

    getBaseLayersGroup() {
        return this.baseLayers;
    }

    getOverlayLayers(map) {
        if (map) {
            const layers = map.getLayers().getArray();
            for (let i = 0; i < layers.length; i++) {
                let layer = layers[i]
                if (layer.get('name') !== 'Base Layers') {
                    {
                        this.overlayLayers = layer.getLayers().getArray()
                        break;
                    }

                }
            }
        }
        return this.overlayLayers
    }

    addSelectedFeatureLayer() {
        let me = this;
        this.specialLayers["selectedFeatureLayer"] = new VectorLayer({
            name: "selected features",
            title: "Selection Layer",
            info: false,
            // visible:false,
            hideInLegend: true,
            displayInLayerSwitcher: false,
            source: new VectorSource({
                features: []
            }),
            style: function (feature) {
                return me.getSelectStyle(feature)
            }
        });
        this.specialLayers["selectedFeatureLayer"].setZIndex(999)
        this.overlayLayers.push(this.specialLayers['selectedFeatureLayer']);
    }

    getSelectStyle(feature) {
        let g_type = feature.getGeometry().getType();
        let selStyle = null;
        if (!g_type) g_type = feature.f;
        if (g_type.indexOf('Point') !== -1) {
            selStyle = new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({color: 'rgba(0, 0, 0, 0.33)'}),
                    stroke: new Stroke({
                        color: [0, 0, 0], width: 1.5
                    })
                })
                // image: new ol.style.Icon({
                //     anchor: [0.5, 0.5],
                //     opacity: 1,
                //     src: '/static/assets/img/icons/flashing_circle.gif'
                // })
            });
        } else if (g_type.indexOf('LineString') !== -1) {
            selStyle = new Style({
                stroke: new Stroke({
                    color: '#d17114',
                    width: 5
                }),
                text: new Text({
                    text: feature.get('measurement'),
                    stroke: new Stroke({color: "#fff", width: 2}),
                    fill: new Fill({color: 'black'}),
                    font: 'bold' + ' ' + '15' + 'px ' + 'Arial, Helvetica, Helvetica, sans-serif',
                })
            });
        } else {
            selStyle = new Style({
                fill: new Fill({
                    color: 'rgba(209, 113, 20, 0)'
                }),
                stroke: new Stroke({
                    color: '#d17114',
                    width: 3
                }),
                text: new Text({
                    text: feature.get('measurement'),
                    stroke: new Stroke({color: "#fff", width: 2}),
                    fill: new Fill({color: 'black'}),
                    overflow: true,
                    font: 'bold' + ' ' + '15' + 'px ' + 'Arial, Helvetica, Helvetica, sans-serif',
                })
            });
        }
        return selStyle;
    }

    getSelectionLayer() {
        return this.specialLayers["selectedFeatureLayer"]
    }

    getLayerByName(name) {
        let me = this;
        let layer = null
        me.overlayLayers.map(function (lyr) {
            if (lyr.get('name') === name) {
                layer = lyr;
                return lyr
            }
        })
        return layer;
    }

    setLayersVisibility(name, map) {
        let me = this;
        const layers = me.getOverlayLayers(map);
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i]
            if (layer.get('name') === name || layer.get('name') === 'selected features') {
                layer.setVisible(true)
            } else {
                layer.setVisible(false)
            }
        }
        return null;
    }
}

export default LayersManager;
