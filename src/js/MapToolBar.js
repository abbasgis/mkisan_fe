import Button from 'react-bootstrap/Button';
import Config from '../js/Config';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/custom_css.css';
import {Stack, Form, Dropdown} from "react-bootstrap";
import React, {Component} from "react";
import DragPan from 'ol/interaction/DragPan';
import {DragBox} from "ol/interaction";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import {inflateCoordinatesArray} from "ol/geom/flat/inflate";
import ShowToast from "./common/Toast";
import LineString from "ol/geom/LineString";
import SLD2OL from "./common/SLD2OL";
import reproject from "reproject";
import {connect} from "react-redux";


class MapToolBar extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.map);
        this.state = {olmap: props.map, lm: props.layerManager, btnClicked: 'default', isToastSHow: false}
        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(btnClick) {
        const mtb = this;
        const map = this.props.map;
        await this.setState({
            btnClicked: btnClick
        }, function () {
        })
        const view = map.getView()
        switch (btnClick) {
            case "full-extent":
                view.fit(Config.extent_3857, map.getSize());
                break;
            case "zoom-in":
                view.setZoom(view.getZoom() + 1)
                break;
            case "zoom-out":
                view.setZoom(view.getZoom() - 1)
                break;
            case "zoom-rectangle":
                this.setCurserDisplay("crosshair");
                this.removeAllInteraction(map);
                const dragBox = new DragBox({
                    className: 'dragZoom',
                });
                map.addInteraction(dragBox);
                dragBox.on('boxend', function () {
                    let extent = dragBox.getGeometry().getExtent();
                    view.fit(extent, {})
                });
                break;
            case "pan":
                this.setCurserDisplay("grab");
                this.removeAllInteraction(map);
                map.addInteraction(new DragPan());
                break;
            case "identify":
                this.setCurserDisplay("help");
                // this.setState((state) => {
                //     return {isToastSHow: true};
                // });
                // this.setState({isToastSHow: true})
                map.on('click', function (evt) {
                    if (mtb.state.btnClicked === "identify") {
                        mtb.displayFeatureInfo(evt.pixel, map);
                    }
                });
                break;
            case "clear":
                this.testProj()
                this.removeAllInteraction(map);
                this.setCurserDisplay("default");
                let vectorSource = this.state.lm.specialLayers["selectedFeatureLayer"].getSource();
                vectorSource.clear();

                break;
            default:
                break;
        }

    }

    removeAllInteraction(map) {
        const interactionColl = map.getInteractions();
        interactionColl.forEach(function (interaction) {
            if (interaction)
                map.removeInteraction(interaction)
        })
    }

    testProj() {
        const reproject = require('reproject');
        const geojson = {
            "type": "Feature",
            "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::900913"}},
            "geometry": {
                "type": "Point",
                "coordinates": [11779400.0, 4865700.0]
            },
            "properties": {
                "name": "My Point"
            }
        }
        var epsg = require('epsg');
        let outputData = reproject.toWgs84(geojson, undefined, epsg);
        outputData = reproject.detectCrs(geojson, epsg)
        console.log(outputData);
    }

    setCurserDisplay(curserStyle) {
        // document.getElementById("map").style.cursor = curserStyle;
    }


    displayFeatureInfo(pixel, map) {
        let lm = this.state.lm;
        const features = [];
        map.forEachFeatureAtPixel(pixel, function (feature) {
            features.push(feature);
        });
        if (features.length > 0) {
            const info = [];
            let i, ii;
            let vectorSource = lm.specialLayers["selectedFeatureLayer"].getSource();
            vectorSource.clear();
            let feature = features[0];
            let gType = feature.getGeometry().getType()
            if (gType === 'Polygon' && feature.flatCoordinates_) {
                const inflatedCoordinates = inflateCoordinatesArray(
                    feature.getFlatCoordinates(), // flat coordinates
                    0, // offset
                    feature.getEnds(), // geometry end indices
                    2, // stride
                )
                const polygonFeature = new Feature(new Polygon(inflatedCoordinates));
                polygonFeature.setProperties(feature.getProperties())
                vectorSource.addFeatures([polygonFeature]);
            } else if (gType === 'LineString' && feature.flatCoordinates_) {
                const inflatedCoordinates = inflateCoordinatesArray(
                    feature.getFlatCoordinates(), // flat coordinates
                    0, // offset
                    feature.getEnds(), // geometry end indices
                    2, // stride
                )
                const lineFeature = new Feature(new LineString(inflatedCoordinates[0]));
                lineFeature.setProperties(feature.getProperties())
                vectorSource.addFeatures([lineFeature]);
            }
            let row = '';
            for (let key in feature.getProperties()) {
                row = row + key + ":  " + feature.get(key) + " , "
            }
            alert(row || '&nbsp');
        } else {
            alert('&nbsp;');
        }
    };

    componentDidMount() {
        this.setState({olmap: this.props.map});
    }

    componentDidUpdate() {
        if (!this.props.map) {
            this.setState({olmap: this.props.map});
        }

    }

    render() {
        return (
            <div className="d-flex justify-content-end">
                <ShowToast isToastSHow={this.state.isToastSHow} title="asd" content="dfg"/>
                <Stack direction="horizontal" gap={2}
                       style={{margin: "10px", zIndex: 2, position: "absolute", backgroundColor: "#eee4bb"}}
                       aria-label="Toolbar">
                    {/*<Button variant="outline-light" onClick={() => this.handleClick("full-extent")}><img*/}
                    {/*    src={require('../img/icons/ZoomFullExtent.png')}*/}
                    {/*    data-toggle="tooltip" title="Zoom to Full Extent" alt="Extent"></img> </Button>{' '}*/}
                    {/*<Button variant="outline-light" onClick={() => this.handleClick("zoom-in")}><img*/}
                    {/*    src={require('../img/icons/icon_zoomin.gif')}*/}
                    {/*    data-toggle="tooltip" title="Zoom In"></img> </Button>{' '}*/}
                    {/*<Button variant="outline-light" onClick={() => this.handleClick("zoom-out")}><img*/}
                    {/*    src={require('../img/icons/icon_zoomout.gif')}*/}
                    {/*    data-toggle="tooltip" title="Zoom Out"></img> </Button>{' '}*/}
                    {/*<Button variant="outline-light" onClick={() => this.handleClick("zoom-rectangle")}><img*/}
                    {/*    src={require('../img/icons/icon_zoomrect.gif')}*/}
                    {/*    data-toggle="tooltip" title="Zoom by Rectangle"></img> </Button>{' '}*/}
                    {/*<Button variant="outline-light" onClick={() => this.handleClick("pan")}><img*/}
                    {/*    src={require('../img/icons/icon_pan.gif')}*/}
                    {/*    data-toggle="tooltip" title="Zoom In"></img> </Button>{' '}*/}
                    {/*<Button variant="outline-light" onClick={() => this.handleClick("identify")}><img*/}
                    {/*    src={require('../img/icons/icon_information.png')}*/}
                    {/*    data-toggle="tooltip" title="Identify"></img> </Button>{' '}*/}
                    {/*<Button variant="outline-light" onClick={() => this.handleClick("clear")}><img*/}
                    {/*    src={require('../img/icons/yes.png')}*/}
                    {/*    data-toggle="tooltip" title="Clear All"></img> </Button>{' '}*/}
                    {/*<Form.Control className="me-auto" placeholder="Add your item here..."/>*/}
                    {/*<div className="vr"/>*/}
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Choose Layer To View on Map
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Stack>
            </div>
        );

    }


}

const mapStateToProps = (state) => {
    return {
        map: state.map.map,
    };
};
export default connect(mapStateToProps)(MapToolBar);