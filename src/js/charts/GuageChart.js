import React, {Component} from "react";
import ReactHighcharts from "react-highcharts";
import HighchartsMore from "highcharts-more";
import SolidGauge from "highcharts-solid-gauge";


class GuageChart extends Component {
    constructor(props) {
        super(props);
        HighchartsMore(ReactHighcharts.Highcharts);
        SolidGauge(ReactHighcharts.Highcharts);
        window.Highcharts = ReactHighcharts.Highcharts;
    }

    render() {
        return (
            <ReactHighcharts
                config={multiChartsConfig(90, 60, 40, 10, "Total", "Sent")}
            ></ReactHighcharts>
        );
    }
}

export {GuageChart}
const multiChartsConfig = (value, open, click, placement, str1, str2) => {
    return {
        chart: {
            type: "gauge",

        },
        title: {
            text: "زمیں میں پانی کا تناسب",
            style: {
                color: "blue",
                alignText: "right"
            }
        },
        credits: {
            enabled: false
        },
        pane: {
            center: ["50%", "100%"],
            size: "100%",
            innerSize: 0,
            startAngle: -90,
            endAngle: 90,
            // background: {
            //     backgroundColor: "white",
            //     innerRadius: "89%",
            //     outerRadius: "120%",
            //     borderColor: "red",
            //     borderWidth: 1,
            //     shape: "arc"
            // }
        },

        exporting: {
            enabled: true
        },

        tooltip: {
            enabled: true
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 0,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            // title: {
            //     text: "RPM",
            //     margin: 20,
            //     style: {
            //         color: "blue",
            //         fontSize: "20px"
            //     }
            // },
            plotBands: [{
                from: 0,
                to: 40,
                color: '#57ea32', // green
                thickness: 40
            }, {
                from: 40,
                to: 80,
                color: '#eff10a', // yellow
                thickness: 40
            }, {
                from: 80,
                to: 100,
                color: '#fa0707', // red
                thickness: 40
            }]
        },

        series: [
            {
                dial: {
                    backgroundColor: "#000000",
                    baseLength: "10",
                    baseWidth: "10",
                    borderColor: "#000",
                    borderWidth: 0,
                    radius: 90,
                    rearLength: 1,
                    topWidth: 1
                },
                // innerRadius: "59%",
                // radius: 10,
                // lineWidth: 113,
                data: [
                    {
                        y: 52,
                        // unit: "km/h",
                        // name: "sample",
                        // innerRadius: 69,
                        // outerRadius: 80
                    }
                ],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px; color:red">{y:.0f}</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4; color:red">' +
                        `{point.name}` +
                        "</span>" +
                        "</div>"
                },
                // tooltip: {
                //     valueSuffix: " revolutions/min"
                // }
            }
        ]
    };
};

