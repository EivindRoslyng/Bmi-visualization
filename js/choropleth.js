//Data cleaning process:
/*
Modify dataset to contain percentage of underweight population of respective European countries
Clean each row excluding bmi,sex,age,quantile
convert each row to array of float
replace all the NaN values to zero
sum each indices of each row value and take average of it
*/

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
  console.log(
    " ROUNDED Avg_of_sum_population_percentage \n",
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

  Plotly.newPlot("underweight-all-age-income-map", data, layout, config, {
    showLink: false,
  }).then((gd) => {
    gd.on("plotly_click", (d) => {
      var pt = (d.points || [])[0];
      console.log(pt);
      switch (pt.location) {
        case "Belgium":
          alert("you clicked on Belgium");
          break;
        case "Bulgaria":
          alert("you clicked on Bulgaria");
          break;
        case "Czechia":
          alert("you clicked on Czechia");
          break;
        case "Germany":
          alert("you clicked on Germany");
          break;
        case "Estonia":
          alert("you clicked on Estonia");
          break;
        case "Ireland":
          alert("you clicked on Ireland");
          break;
        case "Spain":
          alert("you clicked on Spain");
          break;
        case "France":
          alert("you clicked on France");
          break;
        case "Cyprus":
          alert("you clicked on Cyprus");
          break;
        case "Latvia":
          alert("you clicked on Latvia");
          break;
        case "Luxembourg":
          alert("you clicked on Luxembourg");
          break;
        case "Malta":
          alert("you clicked on Malta");
          break;
        case "Austria":
          alert("you clicked on Austria");
          break;
        case "Poland":
          alert("you clicked on Poland");
          break;
        case "Romania":
          alert("you clicked on Romania");
          break;
        case "Turkey":
          alert("you clicked on Turkey");
          break;
        case "Slovenia":
          alert("you clicked on Slovenia");
          break;
        case "Slovakia":
          alert("you clicked on Slovakia");
          break;
      }
    });
  });
});
