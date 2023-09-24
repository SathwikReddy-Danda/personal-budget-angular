import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource: any = {
    datasets: [
        {
            data: [],
            backgroundColor: [
              "#ffcd56",
              "#ff6384",
              "#36a2eb",
              "#fd6b19",
              "#ff1a1a",
              "#00ff00",
              "#0000ff",
            ],
        }
    ],
    labels: []
};

public data = [];
public labelText = [];
private svg: any;
  private width = 650;
  private height = 800;
  private margin = 50;
  private colors: any;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;


  constructor(private http: HttpClient, private budgetData: DataService) {   }

  ngAfterViewInit(): void {
    this.budgetData.getData().subscribe(data =>{
      this.data = data.myBudget;
      for (var i = 0 ; i < data.myBudget.length; i++) {
            this.dataSource.datasets[0].data[i] = data.myBudget[i].budget;
             this.dataSource.labels[i] = data.myBudget[i].title;
    }
    this.createChart();
    this.createSvg();
    this.createColors();
    this.drawChart();

  });
  }

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
}

  private createChart(): void {
    var ctx: any = document.getElementById('myChart');
    var myPieChart = new Chart (ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }

private createColors(): void {
  this.colors = d3.scaleOrdinal()
  .domain(this.data.map((d:any) => d.budget.toString()))
  .range(["#ffcd56", "#ff6384", "#36a2eb", "#fd6b19", "#ff1a1a", "#00ff00", "#0000ff" ]);
}
private drawChart(): void {
  const pie = d3.pie<any>().value((d: any) => Number(d.budget));

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(100)
    .outerRadius(this.radius)
  )
  .attr('fill', (d: any, i: any) => (this.colors(i)))
  .attr("stroke", "black")
  .style("stroke-width", "1px");

  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('text')
  .text((d: { data: { title: any; }; }) => d.data.title)
  .attr("transform", (d: d3.DefaultArcObject) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}

}
