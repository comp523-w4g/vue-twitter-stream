<script>
  import Highcharts from 'highcharts'
  import { Bus, StreamService } from '../../services'
  import _ from 'lodash';

  export default {
    name: 'SentimentComparisonBarGraph',
    data: () => ({
      chart: null,
      tagToIndex: null,
      userInputTags: [],
      anger: [],
      fear: [],
      disgust: [],
      joy: [],
      sadness: [],
      openness: [],
      conscience: [],
      extraversion: [],
      agreeableness: [],
      emotionalRange: [],
      hashtags: []
    }),
    mounted() {
      this.init()
      Bus.$on('reset', this.onReset);
      Bus.$on('end', this.onReset);
      Bus.$on('start', this.onStart);
      Bus.$on('update', this.onUpdate);
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
        //console.log("Stream service tags: ", StreamService.tags);
        this.chart = this.initChart(StreamService.tags);
        this.userInputTags = StreamService.tags;
        console.log("User input tags: ", this.userInputTags);
      },
      onReset() {
        //empty
      },
      onUpdate(data) {
        console.log('SentimentComparisonBarGraph: Inside Update method');
        console.log('User input tags: ', this.userInputTags);
        let predominantSentiment = [];
        let placeHolder = [];

        for(let i = 0; i < data.tags; i++){
          placeHolder[i] = 0.0;
        }

        if (!this.userInputTags || this.userInputTags.length == 0){
          //core emotions
          this.anger=placeHolder;
          this.fear=placeHolder;
          this.disgust=placeHolder;
          this.sadness=placeHolder;
          this.joy=placeHolder;
          //social emotions
          this.openness=placeHolder;
          this.conscience=placeHolder;
          this.extraversion=placeHolder;
          this.agreeableness=placeHolder;
          this.emotionalRange=placeHolder;
        }

        for (let i in this.userInputTags) {
            let currTag = this.userInputTags[i];
            let numberOfTweetsAssociatedWithTag = data.tags[currTag].count; // number of times tweet with tag has been tweeted
            let accumulatedSentiment = data.sentimentByTags[currTag];
            let index = this.tagToIndex.get(currTag);
            if (numberOfTweetsAssociatedWithTag == 0 || accumulatedSentiment === undefined) {
              this.anger[index] = 0.0;
              this.fear[index] = 0.0;
              this.disgust[index] = 0.0;
              this.joy[index] = 0.0;
              this.sadness[index] = 0.0;
              
              this.openness[index]=0.0;
              this.conscience[index]=0.0;
              this.extraversion[index]=0.0;
              this.agreeableness[index]=0.0;
              this.emotionalRange[index]=0.0;
              predominantSentiment[index]='';
            }
            else {
              console.log("Index for tag: ", currTag, " with index: ", index);
              this.anger[index] = +((accumulatedSentiment["Anger"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.fear[index] = +((accumulatedSentiment["Fear"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.disgust[index] = +((accumulatedSentiment["Disgust"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.joy[index] = +((accumulatedSentiment["Joy"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.sadness[index] = +((accumulatedSentiment["Sadness"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.openness[index] = +((accumulatedSentiment["Openness"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.conscience[index] = +((accumulatedSentiment["Conscientiousness"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.extraversion[index] = +((accumulatedSentiment["Extraversion"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.agreeableness[index] = +((accumulatedSentiment["Agreeableness"]/numberOfTweetsAssociatedWithTag)).toFixed(3);
              this.emotionalRange[index] = +((accumulatedSentiment["Emotional Range"]/numberOfTweetsAssociatedWithTag)).toFixed(3);

              const mappedSentiments = {
                'anger': this.anger[index], 
                'fear': this.fear[index],
                'disgust': this.disgust[index],
                'joy': this.joy[index],
                'sadness': this.sadness[index]
              };

              predominantSentiment[index] = _.maxBy(_.keys(mappedSentiments), function (o) { return mappedSentiments[o]; });
              this.hashtags.push(currTag);
            }
        }

        // emit sentiment back to server to produce rss feed
        let anger = this.anger;
        let fear = this.fear;
        let disgust = this.disgust;
        let joy = this.joy;
        let sadness = this.sadness;
        const dataToCast = {
          anger,
          fear,
          disgust,
          joy,
          sadness,
          predominantSentiment
        };

        StreamService.updateRSS(dataToCast);
        let openness = this.openness;
        let conscience = this.conscience;
        let extraversion = this.extraversion;
        let emotionalRange = this.emotionalRange;
        let hashtags = this.hashtags;
        const emotionValues = {
          anger,
          fear,
          disgust,
          joy,
          sadness,
          openness,
          conscience,
          extraversion,
          emotionalRange,
          hashtags
        }
        StreamService.sendEmotionArraysDictToServer(emotionValues);

        this.chart.series[0].setData(this.openness);
        this.chart.series[1].setData(this.conscience);
        this.chart.series[2].setData(this.extraversion);
        this.chart.series[3].setData(this.agreeableness);
        this.chart.series[4].setData(this.emotionalRange);
        this.chart.series[5].setData(this.anger);
        this.chart.series[6].setData(this.fear);
        this.chart.series[7].setData(this.disgust);
        this.chart.series[8].setData(this.joy);
        this.chart.series[9].setData(this.sadness);
      },
      initChart(tags) {
        let colors = [
          // emotional colors
          'rgb(255, 0, 0)',
          'rgb(255,140,0)',
          'rgb(255, 255, 102)',
          'rgb(102, 255, 102)',
          'rgb(0, 128, 255)',
          // social tone colors
          'rgb(255, 153, 153)',
          'rgb(255, 204, 153)',
          'rgb(153, 255, 153)',
          'rgb(153, 204, 255)',
          'rgb(255, 255, 153)'
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

        let heightBasedOnHashtags = 300*data.length;

        const chart = Highcharts.chart(this.$el, {
          chart: {
            height: heightBasedOnHashtags,
            width: 880,
            type: 'bar'
          },
          title: {
            text: 'Sentiment Index Breakdown'
          },
          subtitle: {
            text: 'By Hashtag'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: categories,
            labels : {
              style: {
                color: 'white',
                fontSize: 16
              }
            },
          
          },
          yAxis: {
            min: 0.0,
            max: 1.15,
            title: {
            
            }
          },
          legend: {
             title: {
                text: 'Emotion<br/><span style="font-size: 9px; color: #FFF; font-weight: normal">(Click to hide)</span>',
                style: {
                  fontSize: '17',
                  fontStyle: 'italic',
                  color: 'white'
                }
            },
            itemStyle: {
              fontSize: '15'
            },
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
            series :  {groupPadding : 0.05}, 
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
              name: 'Openness',
              color: colors[5],
              data: startingPoints
          }, {
              name: 'Conscientiousness',
              color: colors[6],
              data: startingPoints
          }, {
              name: 'Extraversion',
              color: colors[7],
              data: startingPoints
          }, {
              name: 'Agreeabless',
              color: colors[8],
              data: startingPoints
          }, {
              name: 'Emotional Range',
              color: colors[9],
              data: startingPoints
          }, {
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
   href: 'https://fonts.googleapis.com/css?family=Roboto:400,600',
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
