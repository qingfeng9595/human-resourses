import { Card, Divider, Dropdown, Form, Icon, Menu, message, Table, Badge } from 'antd';
import React, { useState, Fragment } from 'react';
import SearchForm from '@/components/SearchForm';
import { connect } from 'dva';
import moment from 'moment';
// import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import echarts from 'echarts';
import style from './index.less';

@connect(({ dashboard, loading }) => ({
  dashboard,
  loading: loading.models.dashboard,
}))
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthSum: [
        {
          month: '1月',
          temperature: 23,
        },
        {
          month: '2月',
          temperature: 23,
        },
        {
          month: '3月',
          temperature: 23,
        },
        {
          month: '4月',
          temperature: 23,
        },
        {
          month: '5月',
          temperature: 23,
        },
      ],
    };
  }
  handlemonthBarChart = () => {
    var chart = echarts.init(this.refs.monthBarChart);
    console.log(chart);
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      legend: {
        data: ['实际加班工时', '换算加班工时'],
      },
      grid:{
        bottom:'8%'
      },
      xAxis: [
        {
          type: 'category',
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
          ],
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '加班工时',
          min: 0,
          // max: 250,
          // interval: 50,
          axisLabel: {
            formatter: '{value} h',
          },
        },
      ],
      series: [
        {
          name: '实际加班工时',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        },
        {
          name: '换算加班工时',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        },
      ],
    });
    window.addEventListener('resize', function() {
      chart.resize();
    });
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/fetchAttendanceMonthSumList',
    }).then(() => {
      this.handlemonthBarChart();
    });


  }
  render() {
    const cols = {
      sales: { tickInterval: 20 },
    };
    const {
      dashboard: { monthList },
    } = this.props;
    return (
      <div className={style.dashboardLayout}>
        <div className={style.up}>
          <div className={style.chart} style={{ marginRight: '15px' }}>
            <Card title="每月加班工时统计">
              <div ref="monthBarChart" style={{ width: '100%', height: '300px' }}></div>
            </Card>
          </div>
          <div className={style.chart}>
            <Card title="每月加班工时占比统计"></Card>
          </div>
        </div>
        <div className={style.down}>
          <div className={style.chart} style={{ marginRight: '15px' }}>
            <Card title="部门加班工时统计"></Card>
          </div>
          <div className={style.chart}>
            <Card title="部门加班工时占比统计"></Card>
          </div>
        </div>
      </div>
    );
  }
}
