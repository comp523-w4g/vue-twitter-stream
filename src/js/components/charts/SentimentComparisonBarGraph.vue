<script>
  import Highcharts from 'highcharts'
  import { Bus, StreamService } from '../../services'

  export default {
    name: 'SentimentComparisonBarGraph',
    data: () => ({
      chart: null,
      tagToIndex: null

    }),
    mounted() {
      this.init()
      Bus.$on('reset', this.onReset)
      Bus.$on('end', this.onReset)
      Bus.$on('update', this.onUpdate)
    },
    destroyed() {
      Bus.$off('reset', this.onReset)
      Bus.$off('update', this.onUpdate)
      Bus.$off('end', this.onReset)
      setTimeout(() => {
        this.chart.destroy()
        this.chart = null
      }, 1000)
    },
    methods: {
      init(tags) {
        console.log("Stream service tags", StreamService.tags);
        this.chart = this.initChart(StreamService.tags);
      },
      onReset() {
        console.log("Inside reset method");
        let points = this.chart.series[0].points
        for (let i = 0; i < points.length; i++) {
          points[i].update(0);
        }
      },
      testMe() {
        console.log("Inside bar graph");
      },
      onUpdate(data) {
        console.log("Full Tweet data", data);
        console.log("Tags in data", data.tags);
        let anger = [];
        let fear = [];
        let disgust = [];
        let joy = [];
        let sadness = [];

        let placeHolder = [];

        for(let i = 0; i < data.tags; i++){
          placeHolder[i] = 0.0;
        }

        if(data.inputTags.length == 0){
          anger=placeHolder;
          fear=placeHolder;
          disgust=placeHolder;
          sadness=placeHolder;
          joy=placeHolder;
        }

        for (let tagIndex in data.inputTags) {
            console.log("Tag: ", data.inputTags[tagIndex]);
            let currTag = data.inputTags[tagIndex];
            let numberOfTweetsAssociatedWithTag = data.tags[currTag].count; // number of times tweet with tag has been tweeted
            let accumulatedSentiment = data.sentimentByTags[currTag];

  
            let index = this.tagToIndex.get(currTag);
            if (numberOfTweetsAssociatedWithTag == 0 || accumulatedSentiment === undefined) {
              console.log("Index for tag: ", currTag, " with index: ", index);
              anger[index] = 0.0;
              fear[index] = 0.0;
              disgust[index] = 0.0;
              joy[index] = 0.0;
              sadness[index] = 0.0;
            }
            else {
              console.log("Index for tag: ", currTag, " with index: ", index);

              anger[index] = +((accumulatedSentiment["Anger"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              fear[index] = +((accumulatedSentiment["Fear"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              disgust[index] = +((accumulatedSentiment["Disgust"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              joy[index] = +((accumulatedSentiment["Joy"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              sadness[index] = +((accumulatedSentiment["Sadness"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
            }
          
        }   
        this.chart.series[0].setData(anger);
        this.chart.series[1].setData(fear);
        this.chart.series[2].setData(disgust);
        this.chart.series[3].setData(joy);
        this.chart.series[4].setData(sadness);
            
      },
      initChart(tags) {
        let colors = [
          'rgb(255, 0, 0)',
          'rgb(0, 0, 0)',
          'rgb(102, 255, 102)',
          'rgb(255, 255, 102)',
          'rgb(0, 128, 255)'
        ];
        let count = 0;
        let data = tags.map((tag) => {
          return {
            name: `#${tag}`,
            y: 0,
            drilldown: `#${tag}`,
            color: count < colors.length ? colors[count++] : '#000'
          }
        })        
        let categories = [];
        this.tagToIndex = new Map();
        for(let i = 0; i < data.length;i++){
          categories[i] = data[i].name;
          this.tagToIndex.set(data[i].name.substr(1), i);
        }

        let startingPoints = [];

        for(let i = 0; i < data.length;i++){
          startingPoints[i] = 0.0;
        }

        const chart = Highcharts.chart(this.$el, {
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Tweet sentiment Analysis'
          },
          subtitle: {
            text: ''
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: categories 
          },
          yAxis: {
            min: 0.0,
            max: 1.0,
            title: {
            
            }
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 0,
            y: 0,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
          },
          plotOptions: {
            bar: {
               dataLabels: {
                enabled: true
              }
            }
          },


          tooltip: {
            // headerFormat: '',
            pointFormat: '<span><b>{point.y:,.0f}</b><br/>'
          },

          series: [{
              name: 'Anger',
              color: colors[0],
              data: startingPoints
          }, {
              name: 'Fear',
              color: colors[1],
              data: startingPoints
          },{
              name: 'Disgust',
              color: colors[2],
              data: startingPoints
          },{
              name: 'Joy',
              color: colors[3],
              data: startingPoints
          }, {
              name: 'Sadness',
              color: colors[4],
              data: startingPoints
          }]
        })
        return chart
      }
    }
  }

  Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Dosis:400,600',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
      style: {
         fontFamily: '\'Dosis\', sans-serif'
      },
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase'
      }
   },
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
</script>

<template>
  <div>
  </div>
</template>
