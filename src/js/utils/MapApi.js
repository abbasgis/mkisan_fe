import Config from "../Config";


export const MapAPIs = Object.freeze({
    API_OAUTH_LOGIN: "api/jwt/oauth/login/{type}/",
    API_REFRESH_TOKEN: "api/jwt/refresh/",
    API_LOGIN: "api/jwt/auth/login/",
    DCH_LAYER_INFO: "api/dch/layer_info/{uuid}/",
    DCH_LAYER_EXTENT: "api/dch/layer_extent/{uuid}/",
    DCH_LAYER_MVT: "api/dch/layer_mvt/{uuid}",
    DCH_LAYER_RASTER: "api/dch/raster_tile/{uuid}",
    DCH_SAVE_STYLE: "api/dch/save_style/{uuid}",
    DCH_LAYER_FIELDS: "api/dch/layer_fields/{uuid}",
    DCH_LAYER_ATTRIBUTES: "api/dch/layer_attributes/{uuid}",
    DCH_LAYER_FIELD_DISTINCT_VALUE: "api/dch/layer_field_distinct_values/{uuid}/{field_name}/{field_type}/",
    DCH_MAP_INFO: "api/dch/get_map_info/{uuid}/",
    LAYER_PIXEL_VALUE: "api/map/get_pixel_value/{uuid}/{long}/{lat}/",
    LAYER_PIXEL_VALUE_FROM_GEOJSON: "api/map/get_raster_value_from_geo_json/",
    DCH_FEATURE_DETAIL: "api/dch/get_feature_detail/{uuid}/{col_name}/{col_val}/",
    DCH_RASTER_AREA: "api/dch/get_raster_area/{uuid}/{geojson_str}",
    DCH_GET_ALL_LAYERS: "api/dch/get_all_layers/",

});


class MapApi {
    constructor() {

    }

    static getURL(api, params) {
        const API_URL = Config.api_url;
        let url = `${API_URL}/${api}`;
        url = url.slice(-1) !== "/" ? url + "/" : url;
        let getParamsCount = 0;
        for (const key in params) {
            if (url.includes(key)) {
                url = url.replace(`{${key}}`, params[key]);
            } else {
                if (getParamsCount === 0) {
                    url = `${url}?${key}=${params[key]}`
                } else {
                    url = `${url}&${key}=${params[key]}`
                }
                getParamsCount++
            }
        }
        // console.log("url", url)
        return url;
    }

    async getAccessToken() {
        try {
            // const state = store.getState();
            // const refreshToken = state.auth.refreshToken;
            const refreshToken = false;
            if (refreshToken) {
                const url = MapApi.getURL(MapAPIs.API_REFRESH_TOKEN);
                const response = await fetch(url, {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: new Headers({
                        "Content-Type": "application/json"
                    }),
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({
                        refresh: refreshToken
                    })
                });
                const data = await response.json();
                // console.log("accessToken", data);
                return data.access;
            }
        } catch (e) {
            alert("Failed to contact to server. Please ask system administrator.");
        }
    }

    async get(apiKey, params, isJSON) {
        const accessToken = await this.getAccessToken(); //state.user.accessToken``
        let headers;
        if (accessToken) {
            headers = new Headers({
                "Authorization": "Bearer " + accessToken
            });
        } else {
            headers = new Headers({
                // "Authorization": "Bearer " + accessToken
            });
        }

        const url = MapApi.getURL(apiKey, params);
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: headers
        });
        const res = await this.apiResponse(response, isJSON);

        return res && res.payload;
    }

    async post(apiKey, data, params, isJSON) {
        try {
            const accessToken = await this.getAccessToken(); //state.user.accessToken
            let headers
            if (accessToken) {
                headers = new Headers({
                    "Authorization": "Bearer " + accessToken,
                    "Content-Type": "application/json"
                });
            } else {
                headers = new Headers({
                    "Content-Type": "application/json"
                });
            }
            const url = MapApi.getURL(apiKey, params);
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: headers,
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            return await this.apiResponse(response, isJSON);

        } catch (e) {
            alert("Services are not available at this time.");
            console.error(e);
        }
    }


    async apiResponse(response, isJSON) {
        if (response.ok)
            return isJSON ? await response.json() : await response.text();
        else if (response.status === 401)
            alert("You are unauthorized to submit this request. Please contact project office.");
        // store.dispatch(setAuthentication(false));
        else if (response.status === 400)
            alert("Bad Request. Please check your parameters...");
        else if (response.status === 204)
            alert("No related data or content found");
        else
            alert("Failed to post service. Please contact admin");
        return null;
    }

}

export default MapApi;
