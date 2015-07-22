(function ($) {

  'use strict';
  Model.ChartController = function (options) {
    this.op = $.extend({}, Model.ChartController.defaultOptions, options)
    this.model = this.op.model;
    this.init();
  }
  Model.ChartController.defaultOptions = {
    container: $("#monitor"),
    pointSize: 20  //the number of points that show in a chart
  }
  Model.ChartController.prototype = {
    init: function () {
      console.log("Chart controller init...");
      this.container = $("<div></div>").attr("id", this.model.ylabel).appendTo($("#chart"));
      this.render();

    },
    render: function () {
      var me = this;

      var source = $("#chart_template").html();
      var template = Handlebars.compile(source);
      var html = template(me.model);

      var chartOptions = $.extend({}, Model.ChartDefines["spline"]);
      var xlabel=me.model.xlabel;
      var ylabel=me.model.ylabel;

      chartOptions.title = {text: ylabel};

      var data=[];
      for(var index in me.model.data){
        var d= me.model.data[me.model.data.length-parseInt(index)-1];
        data.push({x: parseInt(d["x"]),y:parseFloat(d["y"])});
      }
      chartOptions.series = [{
        name: ylabel,
        data: data
      }];
      me.dom = $(html).prependTo(me.container).find(".highchart");
      me.dom.highcharts(chartOptions);


      this.bind();
    },
    bind: function () {



    },
    addData: function (originData) {
      var series = this.dom.highcharts().series[0];
      var points = series.points;
      var data=[];
      for(var index in originData){
        var d=originData[index];
        data.push({x: parseInt(d["x"]),y:parseFloat(d["y"])});
      }
      var isShift=false;

      if(points.length>200){
        isShift=true;
      }

      for (var index in data) {
        var d = data[data.length-parseInt(index)-1];
        var isExist=false;
        for(var i in points){
          if(points[i].x== d.x){
            isExist=true;
            break;
          }
        }
        if(isExist){
          continue;
        }
        if (points.indexOf(d) == -1) {
          series.addPoint([d.x, d.y], true, isShift);
        }

      }
    }
  }


  Model.ChartDefines = {
    "spline": {
      chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10
      },
      title: {
        text: 'Live random data'
      },
      xAxis: {},
      yAxis: {
        title: {
          text: 'Value'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
            Highcharts.numberFormat(this.y, 2);
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      }
    }
  }


})(jQuery);


