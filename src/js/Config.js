const Config = {
    // extent_3857: [7966722.351734823, 3486239.100506545, 8223648.321332244, 3661182.3930402338],
    extent_4326: [69.3304661199156840, 27.7030411821049825, 75.3656239009224009, 34.0232471237559366],
    extent_3857: [7717832.183949199, 3211585.3943934124, 8389662.87596805, 4031923.974180402],
    baseProjection: 'EPSG:3857',
    wgs84Projection: 'EPSG:4326',
    animationDuration: 350,
    api_url: 'http://127.0.0.1:8000',
    raster_url: "api/map/raster_tile/{uuid}",
    vector_url: ""

};

export default Config;
