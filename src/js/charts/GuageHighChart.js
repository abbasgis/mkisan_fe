import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import solidGauge from 'highcharts/modules/solid-gauge';
import exporting from 'highcharts/modules/exporting';
import * as React from "react";
// Initialize the required Highcharts modules
HighchartsMore(Highcharts);
solidGauge(Highcharts);
exporting(Highcharts);

// example of calling <GuageHighChart title={"x"} gauge_val={"10"}/>
const GuageHighChart = (props) => {
    const title = props.title
    const gauge_val = parseInt(props.gauge_val)
    const chartOptions = {
        chart: {
            type: 'gauge',
            height:300,
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
        },
        title: {
            text: title,
        },
        credits: {
            enabled: false
        },
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [
                {
                    backgroundColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, '#FFF'],
                            [1, '#333'],
                        ],
                    },
                    borderWidth: 0,
                    outerRadius: '109%',
                    innerRadius: '107%',
                },
            ],
        },
        yAxis: {
            min: 0,
            max: 100,
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto',
            },
            title: {
                text: '%',
            },
            plotBands: [
                {
                    from: 0,
                    to: 20,
                    color: '#55BF3B',
                },
                {
                    from: 20,
                    to: 60,
                    color: '#DDDF0D',
                },
                {
                    from: 60,
                    to: 100,
                    color: '#DF5353',
                },
            ],
        },
        series: [
            {
                name: 'Speed',
                data: [gauge_val],
                tooltip: {
                    valueSuffix: ' %',
                },
            },
        ],
    };
    return (
        <React.Fragment>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </React.Fragment>
    )
}
export default GuageHighChart

