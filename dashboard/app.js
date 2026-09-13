let allData = [];
let currentData = [];

const tip = document.querySelector('#tip');

const barChart = echarts.init(document.querySelector('#bar-chart'));
const pieChart = echarts.init(document.querySelector('#pie-chart'));

function renderCharts(data) {
  currentData = data;

  if (data.length === 0) {
    tip.textContent = '暂无数据';
    barChart.clear();
    pieChart.clear();
    return;
  }

  tip.textContent = '数据加载成功，共 ' + data.length + ' 条';

  const names = data.map(function(item) {
    return item.name;
  });

  const values = data.map(function(item) {
    return item.value;
  });

  barChart.setOption({
    title: {
      text: '校园活动数据'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: names
    },
    yAxis: {
      type: 'value',
      name: '参与度'
    },
    series: [
      {
        type: 'bar',
        data: values
      }
    ]
  });

  const typeData = {};

  data.forEach(function(item) {
    if (!typeData[item.type]) {
      typeData[item.type] = 0;
    }

    typeData[item.type] += item.value;
  });

  const pieData = Object.keys(typeData).map(function(type) {
    return {
      name: type,
      value: typeData[type]
    };
  });

  pieChart.setOption({
    title: {
      text: '不同类型数据占比'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        data: pieData
      }
    ]
  });
}

fetch('data/data.json')
  .then(function(response) {
    if (!response.ok) {
      throw new Error('数据加载失败');
    }

    return response.json();
  })
  .then(function(data) {
    allData = data;
    renderCharts(allData);
  })
  .catch(function(error) {
    tip.textContent = '数据加载失败，请检查网络或文件';
    console.error(error);
  });

$('.buttons button').on('click', function() {
  const type = $(this).data('type');

  if (type === '全部') {
    renderCharts(allData);
  } else {
    const result = allData.filter(function(item) {
      return item.type === type;
    });

    renderCharts(result);
  }
});