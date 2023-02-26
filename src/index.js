import React from "react";
// import { render } from "react-dom";
import {createRoot} from "react-dom/client";
import OpenLayerMap from "./js/OpenLayerMap";
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavBar from "./js/MainNavBar";
import FooterComponent from "./js/FooterComponent";
import {Provider} from "react-redux";
import store from "./js/common/store";

const App = () => (
    <Provider store={store}>
        <div>
            <MainNavBar/>
            <OpenLayerMap/>
            <FooterComponent/>
        </div>
    </Provider>
);
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App/>)
