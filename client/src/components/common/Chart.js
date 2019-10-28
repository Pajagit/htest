import React, { Component } from "react";
import Chart from "react-apexcharts";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log(this.props.options);
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.props.options}
              series={this.props.series}
              type={this.props.type}
              width={this.props.width}
              height={400}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;