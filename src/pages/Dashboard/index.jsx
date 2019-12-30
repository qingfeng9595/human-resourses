import { Card, Divider, Dropdown, Form, Icon, Menu, message, Table, Badge } from 'antd';
import React, { useState, Fragment } from 'react';
import SearchForm from '@/components/SearchForm';
import { connect } from 'dva';
import moment from 'moment';
import { Chart, Axis, Tooltip, Geom, Legend, Coord, Label, Guide,Html} from 'bizcharts';
import DataSet from "@antv/data-set";
// import echarts from 'echarts';
import style from './index.less';

@connect(({ dashboard, loading }) => ({
  dashboard,
  loading: loading.models.dashboard,
}))
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      grid: {
        bottom: '8%'
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
    window.addEventListener('resize', function () {
      chart.resize();
    });
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/fetchAttendanceMonthSumList',
    })
    dispatch({
      type: 'dashboard/fetchAttendanceDeptSumList',
    })
  }
  render() {
    const cols = {
      sales: { tickInterval: 20 },
    };
    const {
      dashboard: { monthList, pieList, deptList,deptPieList },
    } = this.props;
    const ds = new DataSet();
    const dv = ds.createView().source(monthList);
    dv.transform({
      type: "fold",
      fields: ["2019-01", "2019-02", "2019-03", "2019-04", "2019-05", "2019-06", "2019-07", "2019-08", "2019-09", "2019-10", "2019-11","2019-12"],
      // 展开字段集
      key: "月份",
      // key字段
      value: "加班工时" // value字段
    });
    const { DataView } = DataSet;
    const dv2 = new DataView();
    dv2.source(pieList).transform({
      type: "percent",
      field: "sumOverTime",
      dimension: "month",
      as: "percent"
    });
    const dv4 = new DataView();
    dv4.source(deptPieList).transform({
      type: "percent",
      field: "sumOverTime",
      dimension: "deptName",
      as: "percent"
    });
    const cols2 = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + "%";
          return val;
        }
      }
    };
    const ds3 = new DataSet();
    const dv3 = ds3.createView().source(deptList);
    const fields = deptPieList.map(item=>item.deptName)
    dv3.transform({
      type: "fold",
      fields: fields,
      // 展开字段集
      key: "部门",
      // key字段
      value: "加班工时" // value字段
    });
    return (
      <div className={style.dashboardLayout}>
        <div className={style.up}>
          <div className={style.chart} style={{ marginRight: '15px' }}>
            <Card title="每月加班工时统计">
              {/* <div ref="monthBarChart" style={{ width: '100%', height: '300px' }}></div> */}
              <Chart height={300} data={dv} forceFit>
                <Axis name="月份" />
                <Axis name="加班工时" />
                <Legend />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom
                  type="interval"
                  position="月份*加班工时"
                  color={"name"}
                  adjust={[
                    {
                      type: "dodge",
                      marginRatio: 1 / 32
                    }
                  ]}
                />
              </Chart>
            </Card>
          </div>
          <div className={style.chart}>
            <Card title="每月加班工时占比统计">
              <Chart
                height={300}
                padding="auto" 
                data={dv2}
                scale={cols2}
                padding={[20, 100, 20, 40]}
                forceFit
              >
                <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                <Axis name="month" />
                <Legend
                  position="right"
                  offsetY={0}
                  offsetX={0}
                />
                <Tooltip
                  showTitle={false}
                  itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                />
                {/* <Guide>
                  <Html
                    position={["50%", "50%"]}
                    html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>主机<br><span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>台</div>"
                    alignX="middle"
                    alignY="middle"
                  />
                </Guide> */}
                <Geom
                  type="intervalStack"
                  position="percent"
                  color="month"
                  tooltip={[
                    "month*percent",
                    (item, percent) => {
                      percent = (percent * 100).toFixed(2) + "%";
                      return {
                        name: item,
                        value: percent
                      };
                    }
                  ]}
                  style={{
                    lineWidth: 1,
                    stroke: "#fff"
                  }}
                >
                  <Label
                    content="percent"
                    formatter={(val, item) => {
                      return item.point.month + ": " + val;
                    }}
                  />
                </Geom>
              </Chart>
            </Card>
          </div>
        </div>
        <div className={style.down}>
          <div className={style.chart} style={{ marginRight: '15px' }}>
            <Card title="部门加班工时统计">
              <Chart height={300} data={dv3} forceFit>
                <Axis name="部门" />
                <Axis name="加班工时" />
                <Legend />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom
                  type="interval"
                  position="部门*加班工时"
                  color={"name"}
                  adjust={[
                    {
                      type: "dodge",
                      marginRatio: 1 / 32
                    }
                  ]}
                />
              </Chart>
            </Card>
          </div>
          <div className={style.chart}>
            <Card title="部门加班工时占比统计">
              <Chart
                height={300}
                padding="auto"
                data={dv4}
                scale={cols2}
                padding={[20, 150, 20, 40]}
                forceFit
              >
                <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                <Axis name="deptName" />
                <Legend
                  position="right"
                  offsetY={0}
                  offsetX={0}
                />
                <Tooltip
                  showTitle={false}
                  itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                />
                {/* <Guide>
                  <Html
                    position={["50%", "50%"]}
                    html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>主机<br><span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>台</div>"
                    alignX="middle"
                    alignY="middle"
                  />
                </Guide> */}
                <Geom
                  type="intervalStack"
                  position="percent"
                  color="deptName"
                  tooltip={[
                    "deptName*percent",
                    (item, percent) => {
                      percent = (percent * 100).toFixed(2) + "%";
                      return {
                        name: item,
                        value: percent
                      };
                    }
                  ]}
                  style={{
                    lineWidth: 1,
                    stroke: "#fff"
                  }}
                >
                  <Label
                    content="percent"
                    formatter={(val, item) => {
                      return item.point.deptName + ": " + val;
                    }}
                  />
                </Geom>
              </Chart>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
