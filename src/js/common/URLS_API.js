import Config from "../Config";

export default class URLS_API {
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
}