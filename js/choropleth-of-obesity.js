//obese_Data cleaning process:
/*
Modify obese_dataset to contain percentage of underweight population of respective European countries
Clean each row excluding bmi,sex,age,quantile
convert each row to array of float
replace all the NaN values to zero
sum each indices of each row value and take average of it
*/

let obese_population_percentage = [];

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
      let country =  pt.location
      if (countries_chosen_to_be_vis.includes(country)){
        let index_country = countries_chosen_to_be_vis.indexOf(country)
        //console.log(index_country)
        countries_chosen_to_be_vis.splice(index_country,index_country+1)
      }
      else{
        countries_chosen_to_be_vis.push(country)
      }
      getData("bmi-dataset-2008.csv")
    });
  });
});

