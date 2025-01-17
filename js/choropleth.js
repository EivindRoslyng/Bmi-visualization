//Data cleaning process:
/*
1. Modify dataset to contain percentage of underweight population of respective European countries
2. Clean each row excluding bmi,sex,age,quantile
3. Convert each row to array of float
4. Normalize data by replacing all the NaN values to zero
5. sum each indices of each row value and take average of it
*/
let bmi_data_file = "bmi-dataset-2008.csv";
let countries_chosen_to_be_vis_obese = []
let current_shown_element = "LT18.5"


$(document).ready(function(){
	$("#carouselExampleControls").carousel({
		interval : false
  });
});
let obese_population_percentage = [];
let normal_population_percentage = [];
let population_percentage = [];

Plotly.d3.csv("bmi-choropleth-underweight.csv", function (err, rows) {
  rows.map(function (row) {
    let converted_row_to_float = Object.values(row).splice(
      4,
      Object.values(row).length
    );
    converted_row_to_float = converted_row_to_float.map(Number);
    converted_row_to_float = converted_row_to_float.map((value) =>
      Number.isNaN(value) ? 0 : value
    );


    //console.log("Converted_row_to_float", converted_row_to_float);
    population_percentage.push(converted_row_to_float);
    //   console.log(
    //     "Row",
    //     Object.values(row).splice(4, Object.values(row).length)
    //   );
    //   return row[key];
    // return population_percentage;
  });

  //console.log("Population_percentage", population_percentage);
  let sum_population_percentage = population_percentage.reduce(function (r, a) {
    a.forEach(function (b, i) {
      r[i] = (r[i] || 0) + b;
    });
    return r;
  }, []);
  ///console.log("sum_population_percentage \n", sum_population_percentage);

  let avg_of_sum_population_percentage = sum_population_percentage.map(
    function (item) {
      return item / population_percentage.length;
    }
  );
  /*
  console.log(
    "Avg_of_sum_population_percentage \n",
    avg_of_sum_population_percentage
  );

   */
  function precise_round(num, decimals) {
    var sign = num >= 0 ? 1 : -1;
    return (
      Math.round(num * Math.pow(10, decimals) + sign * 0.001) /
      Math.pow(10, decimals)
    ).toFixed(decimals);
  }
  avg_of_sum_population_percentage = avg_of_sum_population_percentage.map(
    (value) => precise_round(value, 2)
  );
  /*
  console.log(
    " ROUNDED Avg_of_sum_population_percentage \n",
    avg_of_sum_population_percentage
  );

   */

  var data = [
    {
      type: "choropleth",
      locationmode: "country names",
      locations: [
        "Belgium",
        "Bulgaria",
        "Czechia",
        "Germany",
        "Estonia",
        "Ireland",
        "Spain",
        "France",
        "Cyprus",
        "Latvia",
        "Luxembourg",
        "Malta",
        "Austria",
        "Poland",
        "Romania",
        "Slovenia",
        "Slovakia",
        "Turkey",
      ],
      z: avg_of_sum_population_percentage,
      hover: "red",
      zmin: 0,
      zmax: 3,
      colorscale: "Blues",
      reversescale: true,
      colorbar: {
        tickcolor: "#fff",
        tick0: 0,
        dtick: 1,
        title: {
          text: "Underweightness",
          font: { size: 17, color: "#fff" },
        },
        ticksuffix: "%",
        ypad: 50,
        thickness: 20,
        thicknessmode: "pixel",
        x: 1,
        len: 0.5,
        tickfont: { color: "#fff" },
      },
      marker: {
        line: {
          color: "rgb(255,255,255)",
          width: 2,
        },
      },
    },
  ];

  var layout = {
    title: {
      text: "Underweightness in 18 European Countries <b>(2008)</b>",
      font: { size: 20, color: "#fff" },
    },
    yaxis: {fixedrange: true},
    xaxis : {fixedrange: true},
    autosize: false,
    width: 1100,
    height: 720,
    paper_bgcolor: "#171d1c",
    plot_bgcolor: "#171d1c",
    geo: {
      bgcolor: "#171d1c",
      scope: "europe",
      countrycolor: "#171d1c",
      showland: true,
      landcolor: "rgb(217, 217, 217)",
    },
  };
  var config = { responsive: true };

  Plotly.newPlot("underweight-all-age-income-map", data, layout, config, {
    showLink: false,
  }).then((gd) => {
    gd.on("plotly_click", (d) => {
      var pt = (d.points || [])[0];
      let country =  pt.location
      if (countries_chosen_to_be_vis_obese.includes(country)){
        let index_country = countries_chosen_to_be_vis_obese.indexOf(country)
        //console.log(index_country)
        countries_chosen_to_be_vis_obese.splice(index_country,index_country+1)
      }
      else{
        countries_chosen_to_be_vis_obese.push(country)
      }
      getData(bmi_data_file, ["LT18.5"])

    });
//     var update = {
//       'xaxis.range': [0, 12],   // updates the xaxis range
//       'yaxis.range[1]': 15     // updates the end of the yaxis range
//   };
// Plotly.relayout("underweight-all-age-income-map", update);
  });
});


Plotly.d3.csv("bmi-choropleth-obese.csv", function (err, rows) {
  rows.map(function (row) {
    let converted_row_to_float = Object.values(row).splice(
        4,
        Object.values(row).length
    );
    converted_row_to_float = converted_row_to_float.map(Number);
    converted_row_to_float = converted_row_to_float.map((value) =>
        Number.isNaN(value) ? 0 : value
    );

    //console.log("Converted_row_to_float", converted_row_to_float);

    obese_population_percentage.push(converted_row_to_float);
  });


  //console.log("obese_Population_percentage", obese_population_percentage);
  let sum_obese_population_percentage = obese_population_percentage.reduce(
      function (r, a) {
        a.forEach(function (b, i) {
          r[i] = (r[i] || 0) + b;
        });
        return r;
      },
      []
  );
  /*
  console.log(
    "sum_obese_population_percentage \n",
    sum_obese_population_percentage
  );

   */

  let avg_of_sum_obese_population_percentage = sum_obese_population_percentage.map(
      function (item) {
        return item / obese_population_percentage.length;
      }
  );
  /*
  console.log(
    "Avg_of_sum_obese_population_percentage \n",
    avg_of_sum_obese_population_percentage
  );

   */
  function precise_round(num, decimals) {
    var sign = num >= 0 ? 1 : -1;
    return (
        Math.round(num * Math.pow(10, decimals) + sign * 0.001) /
        Math.pow(10, decimals)
    ).toFixed(decimals);
  }
  avg_of_sum_obese_population_percentage = avg_of_sum_obese_population_percentage.map(
      (value) => precise_round(value, 2)
  );
  /*
  console.log(
    " ROUNDED Avg_of_sum_obese_population_percentage \n",
    avg_of_sum_obese_population_percentage
  );

   */

  const obese_data = [
    {
      type: "choropleth",
      locationmode: "country names",
      locations: [
        "Belgium",
        "Bulgaria",
        "Czechia",
        "Germany",
        "Estonia",
        "Ireland",
        "Spain",
        "France",
        "Cyprus",
        "Latvia",
        "Luxembourg",
        "Malta",
        "Austria",
        "Poland",
        "Romania",
        "Slovenia",
        "Slovakia",
        "Turkey",
      ],
      z: avg_of_sum_obese_population_percentage,
      zmin: 0,
      zmax: 24,
      colorscale: [
        [0, "rgb(236,231,242)"],
        [7, "rgb(166,189,219)"],
        [12, "rgb(188,189,220)"],
        [16, "rgb(158,154,200)"],
        [20, "rgb(117,107,177)"],
        [24, "rgb(209,20,20)"],
      ],
      colorbar: {
        tickcolor: "#fff",
        tick0: 0,
        dtick: 1,
        title: {
          text: "Obesity Level",
          font: { size: 17, color: "#fff" },
        },
        thickness: 20,
        thicknessmode: "pixel",
        x: 1,
        xpad: 70,
        ypad: 40,
        len: 0.5,
        tickfont: { color: "#fff" },
        tickvals: [0, 7, 12, 16, 20, 24],
        ticktext: ["None", "Few", "Average", "Moderate", "High", "Very High"],
      },
      marker: {
        line: {
          color: "rgb(255,255,255)",
          width: 2,
        },
      },
    },
  ];

  var obese_layout = {
    title: {
      text: "Obesity in 18 European Countries <b>(2008)</b>",
      font: { size: 20, color: "#fff" },
    },
    autosize: false,
    width: 1100,
    height: 800,
    paper_bgcolor: "#171d1c",
    plot_bgcolor: "#171d1c",
    geo: {
      bgcolor: "#171d1c",
      scope: "europe",
      countrycolor: "#171d1c",
      showland: true,
      landcolor: "rgb(217, 217, 217)",
    },
  };
  var config = { responsive: true };

  Plotly.newPlot("obese-all-age-income-map", obese_data, obese_layout, config, {
    showLink: true,
  }).then((gd) => {
    gd.on("plotly_click", (d) => {
      var pt = (d.points || [])[0];
      var pt = (d.points || [])[0];
      let country =  pt.location
      if (countries_chosen_to_be_vis_obese.includes(country)){
        let index_country = countries_chosen_to_be_vis_obese.indexOf(country)
        //console.log(index_country)
        countries_chosen_to_be_vis_obese.splice(index_country,index_country+1)
      }
      else{
        countries_chosen_to_be_vis_obese.push(country)
      }
      getData(bmi_data_file, ["GE30"])

    });
  });
});



Plotly.d3.csv("bmi-choropleth-normal.csv", function (err, rows) {
  rows.map(function (row) {
    let converted_row_to_float = Object.values(row).splice(
        4,
        Object.values(row).length
    );
    converted_row_to_float = converted_row_to_float.map(Number);
    converted_row_to_float = converted_row_to_float.map((value) =>
        Number.isNaN(value) ? 0 : value
    );



    //console.log("Converted_row_to_float", converted_row_to_float);

    normal_population_percentage.push(converted_row_to_float);
  });
  //console.log("normal_Population_percentage", normal_population_percentage);
  let sum_normal_population_percentage = normal_population_percentage.reduce(
      function (r, a) {
        a.forEach(function (b, i) {
          r[i] = (r[i] || 0) + b;
        });
        return r;
      },
      []
  );
  /*
  console.log(
    "sum_normal_population_percentage \n",
    sum_normal_population_percentage
  );
cc*/
  let avg_of_sum_normal_population_percentage = sum_normal_population_percentage.map(
      function (item) {
        return item / normal_population_percentage.length;
      }
  );
  /*
  console.log(
    "Avg_of_sum_normal_population_percentage \n",
    avg_of_sum_normal_population_percentage
  );

   */
  function precise_round(num, decimals) {
    var sign = num >= 0 ? 1 : -1;
    return (
        Math.round(num * Math.pow(10, decimals) + sign * 0.001) /
        Math.pow(10, decimals)
    ).toFixed(decimals);
  }
  avg_of_sum_normal_population_percentage = avg_of_sum_normal_population_percentage.map(
      (value) => precise_round(value, 2)
  );
  /*
  console.log(
    " ROUNDED Avg_of_sum_normal_population_percentage \n",
    avg_of_sum_normal_population_percentage
  );

   */

  const normal_weight_data = [
    {
      type: "choropleth",
      locationmode: "country names",
      locations: [
        "Belgium",
        "Bulgaria",
        "Czechia",
        "Germany",
        "Estonia",
        "Ireland",
        "Spain",
        "France",
        "Cyprus",
        "Latvia",
        "Luxembourg",
        "Malta",
        "Austria",
        "Poland",
        "Romania",
        "Slovenia",
        "Slovakia",
        "Turkey",
      ],
      z: avg_of_sum_normal_population_percentage,
      zmin: 10,
      zmax: 50,
      colorscale: "Greens",
      reversescale: true,
      colorbar: {
        tickcolor: "#fff",
        tick0: 0,
        dtick: 1,
        title: {
          text: "Percentage of Healthy BMI",
          font: { size: 17, color: "#fff" },
        },
        thickness: 20,
        thicknessmode: "pixel",
        x: 1,
        xpad: 70,
        ypad: 40,
        len: 0.5,
        tickfont: { color: "#fff" },
        tickvals: [10, 20, 30, 40, 50],
        ticktext: ["Very Low", "Low", "Average", "Good", "High"],
      },
      marker: {
        line: {
          color: "rgb(255,255,255)",
          width: 2,
        },
      },
    },
  ];

  var normal_weight_layout = {
    title: {
      text: "Normal BMI Population in 18 European Countries <b>(2008)</b>",
      font: { size: 20, color: "#fff" },
    },
    autosize: false,
    width: 1100,
    height: 800,
    paper_bgcolor: "#171d1c",
    plot_bgcolor: "#171d1c",
    geo: {
      bgcolor: "#171d1c",
      scope: "europe",
      countrycolor: "#171d1c",
      showland: true,
      landcolor: "rgb(217, 217, 217)",
    },
  };
  var config = { responsive: true };

  Plotly.newPlot(
      "normal-weight-all-age-income-map",
      normal_weight_data,
      normal_weight_layout,
      config,
      {
        showLink: true,
      }
  ).then((gd) => {
    gd.on("plotly_click", (d) => {
      var pt = (d.points || [])[0];
      //console.log(pt);
      let country =  pt.location
      if (countries_chosen_to_be_vis_obese.includes(country)){
        let index_country = countries_chosen_to_be_vis_obese.indexOf(country)
        //console.log(index_country)
        countries_chosen_to_be_vis_obese.splice(index_country,index_country+1)
      }
      else{
        countries_chosen_to_be_vis_obese.push(country)
      }
      getData(bmi_data_file, ["18.5-25"])

    });

  });
});




async function getData(filename, bmi) {
  var xmlhttp = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      let bmi_data = filecontent(xmlhttp)
      startup(bmi_data, bmi)
    }
  };

  await xmlhttp.open("GET", filename, true);
  await xmlhttp.send();
}


function startup(bmi_data, bmi){
  if(countries_chosen_to_be_vis_obese.length === 0){
    document.getElementById("canvas").style.display = "none"
  }
  else{
    document.getElementById("canvas").style.display = "block"
  }
  const generated_data_age =  finddataforageallcountries(bmi_data, countries_chosen_to_be_vis_obese,["TOTAL"], ["TOTAL"], bmi, "T");
  line_chart_graph([18, 45, 55, 65, 75], generated_data_age)
}




//const avg_wage_data = getData(average_wage_file);
const countries_in_data = ["Belgium", "Bulgaria", "Czechia", "Germany",  "Estonia" , "Ireland", 	"Spain",  	"France" , 	"Cyprus" , 	"Latvia" 	, "Luxembourg"   , 	"Malta"  , "Austria","Poland" , "Romania", "Slovenia", "Slovakia" , "Turkey"];




//this one will create starting graph.


//takes the csv file and create an array with obj consisting of one set of tags.
function filecontent(file){
  let csv_file = file.responseText;
  let arr = csv_file.split("\n");
  var jsonObj = [];
  var headers = arr[0].split(",");
  for (var i = 1; i < arr.length; i++) {
    var data = arr[i].split(",");
    var obj = {};
    for (var j = 0; j < data.length; j++) {
      obj[headers[j].trim()] = data[j].trim();
    }
    jsonObj.push(obj);
  }
  //console.log("AS JAVASCRIPT KEY-VALUE OBJECT========== \n", jsonObj);
  return jsonObj
}


//find data for age of the countries given.
function finddataforageallcountries(array_of_bmi ,countries , age, quantile, bmi, sex) {
  let values_and_labels = []
  for (let i = 0; i < countries.length; i++) {
    values_and_labels.push(findagedataforcountry(array_of_bmi, countries[i], age[0], quantile[0], bmi[0], sex))
  }
  return values_and_labels

}

//this takes a country, and return all the values of different ages
function findagedataforcountry(array_of_bmi , country , age, quantile, bmi, sex) {
  let data_array = []
  for (let i = 0; i < array_of_bmi.length; i++) {
    if (test_if_metadata_pass_for_a_country(array_of_bmi[i], age, quantile, bmi, sex)) {
      data_array.push(array_of_bmi[i][country])
    }

  }

  return {
    label: {
      bmi:bmi,
      country: country,
      sex: sex,
      age: age,
      quantile: quantile
    },
    value: data_array
  }
}





//here we want to find different data when we are looking with age.
function test_if_metadata_pass_for_a_country(bmi_dict, age, quantile, bmi, sex, ages){
  return bmi_dict["sex"] === sex && bmi_dict["quantile"] === quantile && bmi_dict["bmi"] === bmi;
}

//this created the graph with graph js.

let linechart = document.getElementById('linegraph').getContext('2d');
let line_chart_list = []
let colors = ["#F75C03", "#D90368", "#04A777", "#7E3F8F", "#CBF3D2", "#FCFF4B", "#FFAD05", "#E08DAC", "#8CFF98", "#AAD922", "#6F7C12", "#45CB86"]
colors = colors.concat(colors)
async function line_chart_graph(labels, values_and_label){
  //console.log(values_and_label)
  //this is because you have to delete former graph, or you will not be able assign it to the same canvas. .
  //console.log(Chart.defaults.global)


  if(line_chart_list.length === 1){
    line_chart_list[0].destroy()
    line_chart_list.pop()
  }
  let datasets = []
  //the array length is equal to how many different label there is. if a countries has two values, then it because dataset has been pushed twice.
  for (let i = 0; i < values_and_label.length; i++ ){
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    let label = values_and_label[i]["label"];
    let value =  values_and_label[i]["value"]
    let new_label = label["country"]
    let backgroundcolor = colors[i]

    datasets.push({
      label: new_label,
      data: value,
      borderColor: backgroundcolor,
      fill:false

    })
  }
  //console.log(linechart)
  let massPopChart = new Chart(linechart, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      title:{
        display:true,
        text:'Population per Age with Related BMI',
        fontSize:25,
        fontColor: "white"
      },
      legend:{
        display:true,
        position:"bottom",
        labels:{
          fontColor:'white'
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
            fontColor:"white",
            callback: function(value, index, values) {
              return  value +'%';
            },
          },
          //display:true,
          scaleLabel: {
            fontColor: "white",
            display: true,
            labelString: 'Population'
          }
        }],
        xAxes: [{
          scaleLabel: {
            fontColor:"white",
            display: true,
            labelString: 'Age'
          },
          ticks:{
            fontColor:"white",
          }
        }]
      }
    },

  });


  line_chart_list.push(massPopChart)
}

$("#carouselExampleControls").on('slide.bs.carousel', function (e) {
  let direction = e.direction
  console.log(direction, "right")

  if (direction === "left") {
    switch (current_shown_element) {
      case"LT18.5":
        current_shown_element = "GE30";
        break;
      case "GE30":
        current_shown_element = "18.5-25";
        break;
      case "18.5-25":
        current_shown_element = "LT18.5";
        break;
      default:
        alert("something went wrong slide")
    }
  }
  if (direction === "right") {
    switch (current_shown_element) {
      case"LT18.5":
        current_shown_element = "18.5-25";
        break;
      case "GE30":
        current_shown_element = "LT18.5";
        break;
      case "18.5-25":
        current_shown_element = "GE30";
        break;
      default:
        alert("something went wrong slide")
    }
  }

  if (countries_chosen_to_be_vis_obese !== 0) {
      getData(bmi_data_file, [current_shown_element])
  }



});