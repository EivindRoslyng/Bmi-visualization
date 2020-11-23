//---DATA CLEANING STEPS---
// converted .tsv to .csv
// trimmed unnecessary spaces and double quotes from .csv
// Replace the abbreviation of country names to actual names of the country
// Remove "time/geo" column and values associated with it
//Remove P5 and replaced it with ".5"
//Removed any value having "u" in the end.
/*
let bmi_data_file = "bmi-dataset-2008.csv";
let average_wage_file = "average-wage-2008.csv";
async function getData(filename) {
  var xmlhttp = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      csv_file = xmlhttp.responseText;
      arr = csv_file.split("\n");
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
      console.log("AS JAVASCRIPT KEY-VALUE OBJECT========== \n", jsonObj);
      makeDoughnutChart(jsonObj);
      // return jsonObj;
    }
  };

  await xmlhttp.open("GET", filename, true);
  await xmlhttp.send();
}
// const bmi_data = getData(bmi_data_file);
const avg_wage_data = getData(average_wage_file);

function makeDoughnutChart(data) {
  if (data.length == 1) {
    data = data[0];
  }
  new Chart(document.getElementById("doughnut-chart"), {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Average monthly wage (Euros)",
          //generate random color for of countries.length
          backgroundColor: [...Array(Object.keys(data).length)].map(
            () =>
              "#" +
              Math.floor(
                16 ** 5 + Math.random() * (16 ** 6 - 16 ** 5)
              ).toString(16)
          ),
          data: Object.values(data),
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Average monthly wage (Euros)",
      },
    },
  });
}
*/