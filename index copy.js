// converted .tsv to .csv
// trimmed unnecessary spaces and double quotes from .csv

let csv_file = "";
function getData() {
  //this will read file and send information to other function
  var xmlhttp = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      csv_file = xmlhttp.responseText;
      var data = Papa.parse(csv_file);
      console.log("AS JAVASCRIPT ARRAYS of ARRAYS========== \n",data);
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
      console.log("AS JAVASCRIPT KEY-VALUE OBJECT========== \n",jsonObj);
    }
  };

  xmlhttp.open("GET", "hlth_ehis_de2.csv", true);
  xmlhttp.send();
}
getData();
