<template>
  <div class="row">
        <div class="col">
            <h3>goal</h3>
            <table id="database1">
            </table> 
            <div class="database-option">
              <p>Group By:</p> 
              <select id="goalGroupBy" @change="changeGoalOption()">
                <option value="matchid">matchid</option>
                <option value="teamid">teamid</option>
                <option value="player">player</option>
                <option value="gtime">gtime</option>
              </select>
            </div>

            <div class="database-option">
              <p>Sum By 1:</p>
              <select id="goalSum1" @change="changeGoalOption()">
                <option value="matchid">matchid</option>
                <option value="teamid">teamid</option>
                <option value="player">player</option>
                <option value="gtime">gtime</option>
              </select>
            </div>

            <div class="database-option">
              <p>Sum By 2:</p>
              <select id="goalSum2" @change="changeGoalOption()">
                <option value="matchid">matchid</option>
                <option value="teamid">teamid</option>
                <option value="player">player</option>
                <option value="gtime">gtime</option>
              </select>
            </div>

            <p class="topTitileChart">Goal</p>
            <canvas id="goal"></canvas>

        </div>
        <div class="col">
            <h3>game</h3>
            <table id="database2">
            </table> 

            <div class="database-option">
              <p>Group By:</p> 
              <select id="gameGroupBy" @change="changeGameOption()">
                <option value="id">id</option>
                <option value="mdate">mdate</option>
                <option value="stadium">stadium</option>
                <option value="team1">team1</option>
                <option value="team2">team2</option>
              </select>
            </div>

            <div class="database-option">
              <p>Sum By 1:</p> 
              <select id="gameSum1" @change="changeGameOption()">
                <option value="id">id</option>
                <option value="mdate">mdate</option>
                <option value="stadium">stadium</option>
                <option value="team1">team1</option>
                <option value="team2">team2</option>
              </select>
            </div>

            <div class="database-option">
              <p>Sum By 2:</p> 
              <select id="gameSum2" @change="changeGameOption()">
                <option value="id">id</option>
                <option value="mdate">mdate</option>
                <option value="stadium">stadium</option>
                <option value="team1">team1</option>
                <option value="team2">team2</option>
              </select>
            </div>

            <p class="topTitileChart">Game</p>
            <canvas id="game"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js'
export default {
  name: 'Container',
  props: {
    msg: String
  },
  mounted() {
    console.log('mounted');
    try {
      // 表1数据
      this.alasql("CREATE TABLE goal (matchid INT, teamid STRING, player STRING, gtime INT)");
      this.alasql("INSERT INTO goal VALUES (1001, 'POL', 'Robert', '17')");
      this.alasql("INSERT INTO goal VALUES (1001, 'GRE', 'Dim', '51')");
      this.alasql("INSERT INTO goal VALUES (1002, 'RUS', 'Alan', '15')");
      this.alasql("INSERT INTO goal VALUES (1002, 'RUS', 'Roman', '82')");

        // 表2数据
      this.alasql("CREATE TABLE game (id INT, mdate STRING, stadium STRING, team1 STRING, team2 STRING)");
      this.alasql("INSERT INTO game VALUES (1001, '8 JUNE 2012', 'National Stadium', 'POL', 'GRE')");
      this.alasql("INSERT INTO game VALUES (1003, '12 JUNE 2012', 'Stadion Miejsky', 'GRE', 'CZE')");
      
      // 表1渲染
      const data1 = this.alasql('select * from goal')
      const database1 = document.getElementById('database1')
      this.renderData(data1, database1)
      
      // 表2渲染
      const data2 = this.alasql('select * from game')
      const database2 = document.getElementById('database2')
      this.renderData(data2, database2)
      

    } catch (e) {
      alert(e)
    }

    this.setUpGoalChartData();
    this.setUpGameChartData();

    //generate goal chart
    var goalctx = document.getElementById('goal');

    this.goalChart = new Chart(goalctx, {
        type: 'bar',
        data: {
          labels: this.goalLabels,
          datasets: this.goalDatasets,
        },
        options: {
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }]
          }
        }
      });

    //generate game chart
    var gamectx = document.getElementById('game');

    this.gameChart = new Chart(gamectx, {
        type: 'bar',
        data: {
          labels: this.gameLabels,
          datasets: this.gameDatasets
        },
        options: {
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }]
          }
        }
      });

    
  },
  data() {
    return {
      goalLabels: [],
      goalDatasets: [],
      gameLabels: [],
      gameDatasets: [],
      goalChart: Chart,
      gameChart: Chart,
    }
  },
  methods: {
    renderGoalChart: function () {
      this.goalChart.data.labels = this.goalLabels;
      this.goalChart.data.datasets = this.goalDatasets;
      this.goalChart.update();
    },
    renderGameChart: function(){
      this.gameChart.data.labels = this.gameLabels;
      this.gameChart.data.datasets = this.gameDatasets;
      this.gameChart.update();
    },
    renderData: function (data, tableEl) {
      if (!data.length) return
        const columnNameList = Object.keys(data[0])

        const thead = document.createElement('thead')
        columnNameList.forEach(columnName => {
          const th = document.createElement('th')
          th.textContent = columnName
          th.style="border: 1px solid gray !important; padding: 4px !important; text-align: center !important;"
          thead.appendChild(th)
        })

        const tbody = document.createElement('tbody')

        data.forEach(row => {
          const tr = document.createElement('tr')    
          columnNameList.forEach(columnName => {
            const td = document.createElement('td')
            td.textContent = row[columnName]
            td.style="border: 1px solid gray !important; padding: 4px !important; text-align: center !important;"
            tr.appendChild(td)
          })
          tbody.appendChild(tr)
        })
        
        while (tableEl.firstChild) tableEl.removeChild(tableEl.firstChild);
        tableEl.appendChild(thead) 
        tableEl.appendChild(tbody) 
    },
    setUpGameChartData: function() {
      // set up game chart dataset
      const data = this.alasql('select * from game')

      this.gameLabels = [];
      this.gameDatasets = [];

      let data1 = [];
      let data1Value = 0;
      let data1PreviousValue = '';
      data.map(row => {
        let sum1Value = document.getElementById('gameSum1').value;
        if(row[sum1Value] != data1PreviousValue)
        {
          data1Value ++;
          data1PreviousValue = row[sum1Value]
        }
      })

      let data2 = [];
      let data2Value = 0;
      let data2PreviousValue = '';
      data.map(row => {
        let sum2Value = document.getElementById('gameSum2').value;
        
        if(row[sum2Value] != data2PreviousValue)
          data2Value ++;
          data2PreviousValue = row[sum2Value]
      })

      data.map(row => {
        let gameGroupValue = document.getElementById('gameGroupBy').value;
        if(row[gameGroupValue] != this.gameLabels[this.gameLabels.length - 1])
        {
          this.gameLabels = [...this.gameLabels, row[gameGroupValue]]
          data1 = [...data1, data1Value];
          data2 = [...data2, data2Value];
        }
          
      })
      
      this.gameDatasets = [ {
          label: document.getElementById('gameSum1').value,
          data: data1,
          backgroundColor: 'rgb(109, 21, 39)',
        },
        {
          label: document.getElementById('gameSum2').value,
          data: data2,
          backgroundColor: 'rgb(237, 166, 234)',
        }
      ]
    },
    setUpGoalChartData: function () {
      // set up goal chart dataset
      const data = this.alasql('select * from goal')

      this.goalLabels = [];
      this.goalDatasets = [];

      let data1 = [];
      let data1Value = 0;
      let data1PreviousValue = '';
      data.map(row => {
        let sum1Value = document.getElementById('goalSum1').value;
        if(row[sum1Value] != data1PreviousValue)
        {
          data1Value ++;
          data1PreviousValue = row[sum1Value]
        }
      })

      let data2 = [];
      let data2Value = 0;
      let data2PreviousValue = '';
      data.map(row => {
        let sum2Value = document.getElementById('goalSum2').value;
        
        if(row[sum2Value] != data2PreviousValue)
          data2Value ++;
          data2PreviousValue = row[sum2Value]
      })

      data.map(row => {
        let goalGroupValue = document.getElementById('goalGroupBy').value;

        if(row[goalGroupValue] != this.goalLabels[this.goalLabels.length - 1])
        {
          this.goalLabels = [...this.goalLabels, row[goalGroupValue]]
          data1 = [...data1, data1Value];
          data2 = [...data2, data2Value];
        }
      })
  
      this.goalDatasets = [ {
          label: document.getElementById('goalSum1').value,
          data: data1,
          backgroundColor: 'rgb(198, 24, 72)',
        },
        {
          label: document.getElementById('goalSum2').value,
          data: data2,
          backgroundColor: 'rgb(17, 146, 193)',
        }
      ]
    },
  
    changeGoalOption: function() {
      this.setUpGoalChartData();
      this.renderGoalChart();
    },
    changeGameOption: function() {
      this.setUpGameChartData();
      this.renderGameChart();
    },
    
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
th, td {
  border: 1px solid gray !important;
  padding: 4px !important;
  text-align: center !important;
}

.row {
  display: flex;
}

.col {
  flex: 1;  
  display: flex;
  flex-direction: column;
  align-items: center;
}

h3 {
  text-align: center;  
}

textarea {
  width: 100%;
  height: 100px;
}

.database-option {
  display: flex;

}

select {
  height: 50px;
  width: 100px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  box-sizing: border-box;
  border: 1px solid rgba(109, 135, 144, 0.2);
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 4px 4px 0 rgba(109, 135, 144, 0.1);
  color: #1c323f;
  font-family: "DM Sans";
  font-size: 18px;
  letter-spacing: 0;
  line-height: 18px;

  -webkit-appearance: none;
  padding-left: 8px;
  background: url(./../assets/dropdown_arrow.svg) no-repeat scroll
      calc(100% - 10px) center/11px auto;
}

.topTitileChart {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  font-size: 15px;
  color: gray;
}
</style>
