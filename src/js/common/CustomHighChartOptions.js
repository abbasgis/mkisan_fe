class CustomHighChartOptions {

    chartType = null
    chartData = null

    constructor(props) {
        this.chartData = props.chartData
        this.chartType = props.chartType
    }

    getChartOptions = function () {
        let me = this;
        let options = null
        if (me.chartType === "guage") {
            options = me.getGuageChartOptions()
        } else {
            options = me.getPieChartOptions(me.chartData)
        }
        return options
    }
    getGuageChartOptions = function () {
        let options = {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: '80%'
            },

            title: {
                text: 'Speedometer'
            },

            pane: {
                startAngle: -90,
                endAngle: 89.9,
                background: null,
                center: ['50%', '75%'],
                size: '110%'
            },

            // the value axis
            yAxis: {
                min: 0,
                max: 200,
                tickPixelInterval: 72,
                tickPosition: 'inside',
                tickColor: '#FFFFFF',
                tickLength: 20,
                tickWidth: 2,
                minorTickInterval: null,
                labels: {
                    distance: 20,
                    style: {
                        fontSize: '14px'
                    }
                },
                plotBands: [{
                    from: 0,
                    to: 120,
                    color: '#55BF3B', // green
                    thickness: 20
                }, {
                    from: 120,
                    to: 160,
                    color: '#DDDF0D', // yellow
                    thickness: 20
                }, {
                    from: 160,
                    to: 200,
                    color: '#DF5353', // red
                    thickness: 20
                }]
            },

            series: [{
                name: 'Speed',
                data: [80],
                tooltip: {
                    valueSuffix: ' km/h'
                },
                dataLabels: {
                    format: '{y} km/h',
                    borderWidth: 0,
                    color: '#333333',
                    style: {
                        fontSize: '16px'
                    }
                },
                dial: {
                    radius: '80%',
                    backgroundColor: 'gray',
                    baseWidth: 12,
                    baseLength: '0%',
                    rearLength: '0%'
                },
                pivot: {
                    backgroundColor: 'gray',
                    radius: 6
                }

            }]
        }
        return options

    }
    getPieChartOptions = function (data) {
        const chartOptions = {
            chart: {
                type: 'pie',
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    depth: 45,
                    allowPointSelect: true,
                    colors: ["#2458a7", "#ee330c", "#918f7e", "#ffad0a",
                        "#0022ff", "#5b9411", "#11284d", "#942308"],
                    cursor: 'pointer',
                    dataLabels: {
                        y: -15,
                        x: 8,
                        padding: -5,
                        zIndex: 50,
                        softConnector: false,
                        style: {
                            textOverflow: 'ellipsis',
                            fontSize: '10px',
                            fontStyle: 'bold',
                        },
                        useHTML: true,
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                },
                // series: {
                //     innerSize: '50%',
                //     point: {
                //         events: {
                //             click: function (e: any) {
                //                 const name = e.point.name.replace("/", "$")
                //                 let p = "";
                //                 let i = 0;
                //                 for (let key in params) {
                //                     let value = params[key]
                //                     if (key == "donor") {
                //                         value = name
                //                     }
                //                     p += i == 0 ? `${key}=${value}` : `&${key}=${value}`
                //                     i++
                //                 }
                //                 // navigate("/projects?" + p)
                //             }
                //         }
                //     }
                // }
            },
            series: [{
                name: 'Area',
                colorByPoint: true,
                data: data
            }]
        }
        return chartOptions
    }

}

export default CustomHighChartOptions;
