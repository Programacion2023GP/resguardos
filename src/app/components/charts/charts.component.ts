import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d'; 
import { ServiceService } from 'src/app/service.service';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  datas:any=[
    {id:'chart1',chart:'column',name:"Estados/resguardos",url:"charts/states",titles:[],values:[]},
    {id:'chart2',chart:'column',name:"Tipos/resguardos",url:"charts/types",titles:[],values:[]},
    {id:'chart3',chart:'column',name:"Departamentos",url:"charts/groups",titles:[],values:[]},

  ]
  ngOnInit(): void {
  }
  constructor(private service:ServiceService<any>){
    Highcharts3D(Highcharts); // Activa el módulo Highcharts 3D
    this.getDatas()
    setTimeout(() => {
      // this.createChart("chart2", "column", "Estados/resguardos", ["s", "c"], [100, 300]);
      // this.createChart("chart3", "column", "Departamentos", ["s", "c"], [100, 300]);

  }, 2000);
  

  }
getDatas(){
  this.datas.forEach((item)=>{
    this.service.Data<any>(item.url).subscribe({
      next:(n:any)=>{
        n["data"]["result"].forEach((element:any) => {
          item.titles.push(element.nombre)
          item.values.push(element.total)

        });
        this.createChart(item.id,item.chart,item.name,item.titles,item.values)
        // this.createChart("chart1", "column", "Tipos/resguardos", ["s", "c"], [100, 300]);

      }
    })
  })
}



createChart(id: string, chart: string, title: string, causas: string[], conteos: number[]): void {
    // const exists = this.cards.some(card => card.text === Object.keys(this.keys).find(key => this.keys[key] === option_selected));
    
    // if (!exists) {
    //     this.cards.push({
    //         text: Object.keys(this.keys).find(key => this.keys[key] === option_selected),
    //         value: conteos.reduce((total, numero) => total + numero, 0)
    //     });
    // }
    
    
        const finalChartConfig: any[] = [];
        
        finalChartConfig.push(this.configChart(chart));
        finalChartConfig.push(this.configLegend());
        finalChartConfig.push(this.configTitle(chart,title,conteos));
        finalChartConfig.push(this.configPlotOptions(chart));
        finalChartConfig.push(this.configXaxis(chart,causas));
        finalChartConfig.push(this.configYaxis());
        finalChartConfig.push(this.configData(chart,causas,conteos));
        console.warn(id,finalChartConfig)
        Highcharts.chart(id, Object.assign({}, ...finalChartConfig));
    
    
      }
      configChart(chart: string) {
        switch(chart) {
          case "column":
          case "bar":
            return {
              chart: {
                type: `${chart}`,
                animation: true,
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 20,
                    depth: 100,
                    viewDistance: 25
                }
    
    
              }
            };
          case "pie":
            return {
              chart: {
                type: `${chart}`,
                options3d: {
                  enabled: true,
                  alpha: 45,
                  beta: 0
                }
              }
            };
          default:
            return {}; // Devuelve un objeto vacío si el tipo de gráfico no es reconocido
        }
      }
    
    
    
    
      configLegend() {
        return {
          legend: {
            bubbleLegend: {
              enabled: true,
              minSize: 20,
              maxSize: 60,
              ranges: [{
                value: 14
              }, {
                value: 89
              }]
            }
          }
        };
      }
    
      configTitle(chart: string, title: any,conteos:number[]): any {
        const total = conteos.reduce((total, numero) => total + numero, 0);
    
        switch (chart) {
            case "bar":
            case "column":
            case "line":
                return {
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: `total de registros: ${total}`
                    }
                };
            case "pie":
            case "area":
                return {
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: `total de registros: ${total}`
                    },
                    accessibility: {
                        point: {
                            valueSuffix: '%'
                        }
                    },
                    tooltip: {
                        pointFormat: `{series.name}: <b>{point.percentage:.1f}% de ${total} registros</b>`
                    }
                };
        }
    }
    
        configPlotOptions(chart: string): any {
            switch(chart) {
                case "bar":
                case "column":
                    return {
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                // Ajusta este valor para cambiar el espaciado entre columnas
                                cursor: 'pointer',
                                dataLabels: {
                                  enabled: true,
                                  format: '{point.y:.0f}',// Mostrar solo números enteros
                                  distance: 150, // Ajusta este valor según sea necesario
                                  style: {
                                    color: 'black',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }
                            },
                            depth: 150,
                            colorByPoint: true,
                            allowPointSelect: false
                          }
                        }
                      };
                case "pie":
                case "area":
                  return {
                    plotOptions: {
                      pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        slicedOffset: 20,
                        dataLabels: {
                          enabled: true,
                          format: `<b>{point.name}</b>: {point.percentage:.1f} % de un total de registros`, // Formato para mostrar el nombre y el porcentaje
                          distance: 30 // Distancia de las etiquetas desde el centro del pastel
                        }
                      }
                    }
                  };
    
              }
        }
    
        configXaxis(chart,titles){
            switch(chart) {
                case "line":
                case "area":
                return{
                    xAxis: {
                        type: "category",
                        categories: ["",...titles],
                        title: {
                            text: "total",
                            align: "middle"
                        },
                        labels: {
                            autoRotation: [-45, -90],
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    }
                }
                default:
                return{
                    xAxis: {
                        type: "category",
                        categories: [""],
                        title: {
                            text: "total",
                            align: "middle"
                        },
                        labels: {
                            autoRotation: [-45, -90],
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    }
                }
            }
        }
        configYaxis(){
          return{
            yAxis: {
              title: {
                text: "total",
                align: "middle"
              }
            }
          }
        }
    
        configData(chart: string, causas: any[], conteos: any[]): any {
            switch(chart) {
                case "bar":
                case "column":
                  return {
                    series: causas.map((name, index) => ({
                      name: name,
                      type: chart,
                      data: [{ y: conteos[index], color: this.getRandomColor() }],
                      dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}',
                        y: 0,
                        style: {
                          fontSize: '13px',
                          fontFamily: 'Verdana, sans-serif'
                        }
                      }
                    }))
                  };
                case "pie":
                case "area":
                  return {
                    series: [{
                      type: chart,
                      name: 'Porcentaje obtenido',
                      data: causas.map((value, index) => ({
                        name: value,
                        y: conteos[index],
                        sliced: index === 2,
                        selected: index === 2
                      }))
                    }]
                  };
    
                  case "line":
                    return{
    
                      series: [{
                        data: conteos.map((value, index) => ({
                            y: value, // El valor del punto en la serie
                            x: index + 1 // El índice del punto más 1 (para empezar desde 1)
                        }))
                    }]
    
                    }
              }
        }
        getRandomColor() {
          // Generar un color hexadecimal aleatorio
          return '#' + Math.floor(Math.random() * 16777215).toString(16);
      }
}
