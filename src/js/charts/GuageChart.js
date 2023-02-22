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
            type: "gauge"
        },
        title: {
            text: "",
            style: {
                color: "blue",
                alignText: "right"
            }
        },
        credits: {
            enabled: false
        },
        pane: {
            center: ["50%", "95%"],
            size: "120%",
            innerSize: 0,
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: "",
                innerRadius: "59%",
                outerRadius: "120%",
                borderColor: "red",
                borderWidth: 1,
                shape: "arc"
            }
        },

        exporting: {
            enabled: false
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
            max: 170,
            title: {
                text: "RPM",
                margin: 20,
                style: {
                    color: "blue",
                    fontSize: "20px"
                }
            },
            plotBands: [{
                from: 25,
                to: 120,
                color: '#55BF3B', // green
                // thickness: 20
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D', // yellow
                thickness: 40
            }, {
                from: 160,
                to: 200,
                color: '#DF5353', // red
                thickness: 50
            }]
        },

        series: [
            {
                dial: {
                    backgroundColor: "#000000",
                    baseLength: "10",
                    baseWidth: "14",
                    borderColor: "#000",
                    borderWidth: 0,

                    radius: 100,
                    rearLength: 1,
                    topWidth: 1
                },
                innerRadius: "59%",
                radius: 120,
                lineWidth: 113,
                data: [
                    {
                        y: 52,
                        unit: "km/h",
                        name: "sample"
                        // innerRadius: 69,
                        // outerRadius: 80
                    }
                ],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">${y:.1f}</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4; color:red">' +
                        `{point.name}` +
                        "</span>" +
                        "</div>"
                },
                tooltip: {
                    valueSuffix: " revolutions/min"
                }
            }
        ]
    };
};

