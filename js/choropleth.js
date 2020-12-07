//Data cleaning process:
/*
Modify dataset to contain percentage of underweight population of respective European countries
Clean each row excluding bmi,sex,age,quantile
convert each row to array of float
replace all the NaN values to zero
sum each indices of each row value and take average of it
*/

let population_percentage = [];
// Plotly.d3.csv("bmi-dataset-choropleth.csv", function (err, rows) {
//   function unpack(rows, key) {
//     return rows.map(function (row) {
//       population_percentage.push(Object.values(row).splice(4, Object.values(row).length));
//     //   console.log(
//     //     "Row",
//     //     Object.values(row).splice(4, Object.values(row).length)
//     //   );
//     //   return row[key];
//     return population_percentage;
//     });

//   }
Plotly.d3.csv("bmi-dataset-choropleth.csv", function (err, rows) {
  rows.map(function (row) {
    let converted_row_to_float = Object.values(row).splice(
      4,
      Object.values(row).length
    );
    converted_row_to_float = converted_row_to_float.map(Number);
    converted_row_to_float = converted_row_to_float.map((value) =>
      Number.isNaN(value) ? 0 : value
    );

    console.log("Converted_row_to_float", converted_row_to_float);

    population_percentage.push(converted_row_to_float);
    //   console.log(
    //     "Row",
    //     Object.values(row).splice(4, Object.values(row).length)
    //   );
    //   return row[key];
    // return population_percentage;
  });

  console.log("Population_percentage", population_percentage);
  let sum_population_percentage = population_percentage.reduce(function (r, a) {
    a.forEach(function (b, i) {
      r[i] = (r[i] || 0) + b;
    });
    return r;
  }, []);
  console.log("sum_population_percentage \n", sum_population_percentage);

  let avg_of_sum_population_percentage = sum_population_percentage.map(
    function (item) {
      return item / population_percentage.length;
    }
  );
  console.log(
    "Avg_of_sum_population_percentage \n",
    avg_of_sum_population_percentage
  );

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
      //   text: [
      //     "belgium",
      //     "bulgaria",
      //     "czechia",
      //     "germany",
      //     "estonia",
      //     "ireland",
      //     "spain",
      //     "france",
      //     "cyprus",
      //     "latvia",
      //     "luxembourg",
      //     "malta",
      //     "austria",
      //     "poland",
      //     "romania",
      //     "slovenia",
      //     "slovakia",
      //     "turkey",
      //   ],
      zmin: 0,
      zmax: 3,
      colorscale: [
        [0.5, "rgb(236,231,242)"],
        [1.1, "rgb(166,189,219)"],
        [1.6, "rgb(188,189,220)"],
        [2.0, "rgb(158,154,200)"],
        [2.5, "rgb(117,107,177)"],
        [3, "rgb(209 20 20)"],
      ],
      colorbar: {
        tick0: 0,
        dtick: 1,
        title: "<b>Underweighted</b> Population",
        thickness: 20,
        thicknessmode: "pixel",
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
    title: "Underweightness in European Countries",
    autosize: false,
    width: 1100,
    height: 900,
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

  Plotly.newPlot("underweight-all-age-income-map", data, layout, {
    showLink: false,
  });
});
