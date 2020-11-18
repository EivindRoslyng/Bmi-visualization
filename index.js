/*
let myChart = document.getElementById('myChart').getContext('2d');

// Global Options
Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#777';

let massPopChart = new Chart(myChart, {
    type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data:{
        labels:['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
        datasets:[{
            label:'Population',
            data:[
                617594,
                181045,
                153060,
                106519,
                105162,
                95072
            ],
            //backgroundColor:'green',
            backgroundColor:[
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ],
            borderWidth:1,
            borderColor:'#777',
            hoverBorderWidth:3,
            hoverBorderColor:'#000'
        }]
    },
    options:{
        title:{
            display:true,
            text:'Largest Cities In Massachusetts',
            fontSize:25
        },
        legend:{
            display:true,
            position:'right',
            labels:{
                fontColor:'#000'
            }
        },
        layout:{
            padding:{
                left:50,
                right:0,
                bottom:0,
                top:0
            }
        },
        tooltips:{
            enabled:true
        }
    }
});


const fs = require('fs')

fs.readFile('test.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
*/


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let file = this.responseText
        let allRows = file.split(/\r?\n|\r/);
        let metadata = allRows[0]
        let countries = metadata.split("\t").splice(1, metadata.length)
        let countries_values_with_unknown = allRows[1].split("\t").splice(1, metadata.length)
        let countries_values = []
        var i;
        for (i = 0; i < countries_values_with_unknown.length; i++) {
            let element = countries_values_with_unknown[i].replace("u", "")
            countries_values.push(element)
        }
        //console.log(sort_changed_label_position(countries, countries_values))
        //countries = sort_changed_label_position(countries, countries_values)[1]
        //countries_values = sort_changed_label_position(countries, countries_values)[0]
        let myChart = document.getElementById('myChart').getContext('2d');

// Global Options
        Chart.defaults.global.defaultFontFamily = 'Lato';
        Chart.defaults.global.defaultFontSize = 18;
        Chart.defaults.global.defaultFontColor = '#777';

        let massPopChart = new Chart(myChart, {
            type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:{
                labels:sort_changed_label_position(countries, countries_values)["labels"],
                datasets:[{
                    label:'Population',
                    data: sort_changed_label_position(countries, countries_values)["values"],
                    //backgroundColor:'green',
                    backgroundColor:"green",
                    borderWidth:1,
                    borderColor:'#777',
                    hoverBorderWidth:3,
                    hoverBorderColor:'#000'
                }]
            },

            options:{
                title:{
                    display:true,
                    text:'bmi ',
                    fontSize:25
                },
                legend:{
                    display:true,
                    position:'right',
                    labels:{
                        fontColor:'#000'
                    }
                },
                layout:{
                    padding:{
                        left:50,
                        right:0,
                        bottom:0,
                        top:0
                    }
                },
                tooltips:{
                    enabled:true
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            autoSkip: false
                        }
                    }]
                }
            }


        });
        /*
        let mysecondChart = document.getElementById('mysecondChart').getContext('2d');

// Global Options
        Chart.defaults.global.defaultFontFamily = 'Lato';
        Chart.defaults.global.defaultFontSize = 18;
        Chart.defaults.global.defaultFontColor = '#777';

        let newPopChart = new Chart(mysecondChart, {
            type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data:{
                labels:countries,
                datasets:[{
                    label:'Population',
                    data: countries_values,
                    //backgroundColor:'green',
                    backgroundColor:"green",
                    borderWidth:1,
                    borderColor:'#777',
                    hoverBorderWidth:3,
                    hoverBorderColor:'#000'
                }]
            },

            options:{
                title:{
                    display:true,
                    text:'bmi ',
                    fontSize:25
                },
                legend:{
                    display:true,
                    position:'right',
                    labels:{
                        fontColor:'#000'
                    }
                },
                layout:{
                    padding:{
                        left:50,
                        right:0,
                        bottom:0,
                        top:0
                    }
                },
                tooltips:{
                    enabled:true
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            autoSkip: false
                        }
                    }]
                }
            }


        });

         */

    }
};
xhttp.open("GET", "hlth_ehis_de2.tsv", true);
xhttp.send();


function sort_changed_label_position(values, labels, reverse=false){
    new_combined_array = []
    var i;
    for (i = 0; i < values.length; i++) {
        new_combined_element = [values[i], labels[i] ] ;
        new_combined_array.push(new_combined_element)
    }
    new_combined_array.sort(function(a,b){return a[1] < b[1]})

    let new_labels = []
    let new_values = []
    for (i = 0; i < new_combined_array.length; i++) {
        let value = new_combined_array[i][1] ;
        new_values.push(value)
        let label = new_combined_array[i][0] ;
        new_labels.push(label)
    }

    return {
        labels:new_labels,
        values: new_values
    }

}


function create_graph(e){
    e.preventDefault()
    alert("you created a graph");
}