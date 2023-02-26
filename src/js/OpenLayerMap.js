import React, {useEffect, useRef, useState} from "react";
import "ol/ol.css";
import OlMap from "ol/Map";
import OlView from "ol/View";
import MapToolBar from "./MapToolBar";
import Config from "./Config";
import {getCenter} from "ol/extent";
import LayersManager from "./Layers";
import {defaults as defaultControls} from 'ol/control';
import OLControls from "./OLControls";
import LayerGroup from "ol/layer/Group";
import {Col, Form, Button, FormControl, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import CustomHighCharts from "./CustomHighCharts";
import {GuageChart} from "./charts/GuageChart";
import GuageHighChart from "./charts/GuageHighChart";
import CustomCalendar from "./CustomCalendar";
import YouTubeVideo from "./YouTubeVideo";
import {useDispatch} from "react-redux";


function OpenLayerMap() {
    const lm = new LayersManager();
    const [map, setMap] = useState(null);
    const dispatch = useDispatch();
    let state = {center: getCenter(Config.extent_3857), zoom: 6.5, isToastSHow: false};
    const mapRef = useRef(null);
    useEffect(() => {
        let olmap = new OlMap({
            target: mapRef.current,
            // layers:lm.getOverlayLayers(),
            layers: [
                lm.getBaseLayersGroup(),
                new LayerGroup({
                    name: 'Overlay Layers',
                    title: 'Overlay Layers',
                    layers: lm.getOverlayLayers()
                })
            ],
            view: new OlView({
                center: state.center,
                // center: this.state.center,
                zoom: state.zoom,
                projection: 'EPSG:3857',
            }),
            controls: defaultControls(),
        });
        // add controls to map
        new OLControls(olmap, lm)
        // olmap.setTarget("map");
        setMap(olmap);
        dispatch({type: 'SET_MAP', payload: olmap});
    }, [dispatch]);
    return (
        <Container fluid>
            <Row>
                <Col xs lg="6">
                    <MapToolBar layerManager={lm}/>
                    <div ref={mapRef} style={{height: "88vh", padding: "5px"}}></div>
                </Col>
                <Col xs lg="3" style={{backgroundColor: "transparent"}}>
                    <Row>
                        <Col xs lg="12" style={{backgroundColor: "transparent"}}>
                            <div style={{height: "88vh", overflowY: 'scroll'}}>
                                <GuageHighChart title={"زمیں میں پانی کا تناسب"} gauge_val={"60"}/>
                                <div style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}></div>
                                <GuageHighChart title={"زمیں میں پانی کا تناسب"} gauge_val={"60"}/>
                                <div style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}></div>
                                <GuageHighChart title={"زمیں میں پانی کا تناسب"} gauge_val={"60"}/>
                                <div style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}></div>
                                <GuageHighChart title={"زمیں میں پانی کا تناسب"} gauge_val={"60"}/>
                                <GuageHighChart title={"زمیں میں پانی کا تناسب"} gauge_val={"60"}/>
                                <div style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}></div>
                                <GuageHighChart title={"زمیں میں پانی کا تناسب"} gauge_val={"60"}/>
                                <div style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}></div>
                                <GuageHighChart title={"زمیں میں پانی کا تناسب"} gauge_val={"60"}/>
                                <div style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}></div>
                                <GuageHighChart title={"زمیں میں پانی کا تناسب"} gauge_val={"60"}/>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs lg="3">
                    <div style={{position: "absolute", bottom: "30px"}}>
                        <YouTubeVideo/>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default OpenLayerMap;
