let csv_file="";
function getData(){       //this will read file and send information to other function
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            csv_file = xmlhttp.responseText;
            console.log(csv_file);
        }
    }

    xmlhttp.open("GET", "hlth_ehis_de2.csv", true);
    xmlhttp.send();    
}

var data = Papa.parse(csv_file);
console.log(data);