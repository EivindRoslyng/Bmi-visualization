
//---DATA CLEANING STEPS---
// converted .tsv to .csv
// trimmed unnecessary spaces and double quotes from .csv
// Replace the abbreviation of country names to actual names of the country
// Remove "time/geo" column and values associated with it
//Remove P5 and replaced it with ".5"
//Removed any value having "u" in the end.

let bmi_data_file = "bmi-dataset-2008.csv";
let average_wage_file = "average-wage-2008.csv";
async function getData(filename) {
    var xmlhttp = window.XMLHttpRequest
        ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let bmi_data = filecontent(xmlhttp)
            startup(bmi_data)
        }
    };

    await xmlhttp.open("GET", filename, true);
    await xmlhttp.send();
}
const bmi = getData(bmi_data_file);
//const avg_wage_data = getData(average_wage_file);
const countries = ["Belgium", "Bulgaria", "Czechia", "Germany",  "Estonia" , "Ireland", 	"Spain",  	"France" , 	"Cyprus" , 	"Latvia" 	, "Luxembourg"   , 	"Malta"  , "Austria","Poland" , "Romania", "Slovenia", "Slovakia" , "Turkey"]

/////////////////////////////////////////////////////////
// TODO STARTS HERE


function get_countries_and_their_values(countries_dict){
    let countries = Object.keys(countries_dict)
    countries.splice(0,4 )
    let countries_value = Object.values(countries_dict)
    countries_value.splice(0,4)
    return{
        countries:countries,
        countries_value:countries_value
    }
}


function get_label(countries_dict){
    let bmi = countries_dict["bmi"]
    let age = countries_dict["age"]
    let gender = countries_dict["sex"]
    let income = countries_dict["quantile"]
    switch(bmi) {
        case "LT18.5":
            bmi = "Underweight"
            break
        case "18.5-25":
            bmi = "Normal weight"
            break;
        case "25-30":
            bmi = "Overweight"
            break;
        case "GE30":
            bmi = "Obese"
            break;
        default:
            bmi = "Error"
    }
    if (age === "TOTAL"){
        age = "All ages"
    }
    if (gender === "F"){

        gender = "Female"
    }else{
        gender = "Male"
    }
    switch(income) {
        case "TOTAL":
            income = "All income level"
            break
        case "QU1":
            income = "lowest income level"
            break;
        case "Q2":
            income = "lower middle income level"
            break;
        case "Q3":
            income = "middle income level"
            break;
        case "Q4":
            income = "upper middle income level"
            break;
        case "Q5":
            income = "upper income level"
            break;
        default:
            income = "Error"
    }
    return bmi + " " + age + " " + gender + " " + income
}

function startup(bmi_data){
    let data_for_graph = bmi_data[5]
    let countries_and_value = get_countries_and_their_values(data_for_graph)
    generate_graph_for_single_gender(countries_and_value["countries"], countries_and_value["countries_value"], get_label(data_for_graph), "Yes", "No")
}




function filecontent(file){
   csv_file = file.responseText;
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
   return jsonObj
}


let myChart = document.getElementById('myChart').getContext('2d');
let latest_chart = []

function generate_graph_for_single_gender(labels, values, label, sorted , average_salary){
    if(latest_chart.length === 1){
        latest_chart[0].destroy()
        latest_chart.pop()
        console.log(latest_chart)
    }
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    if (sorted === "Yes"){
        labels = sort_changed_label_position(labels, values)["labels"]
        values = sort_changed_label_position(labels, values)["values"]
    }
    /*
    //here is the problem
    if(average_salary === "Yes"){
        let testingvariable = read_average_wage_file()
        console.log(testingvariable)

        labels = sort_changed_label_position(labels, values)["labels"]
        values = sort_changed_label_position(labels, values)["values"]
    }
    */
    let massPopChart = new Chart(myChart, {
        type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data:{
            labels:labels,
            datasets:[{
                label:label,
                data: values,
                //backgroundColor:'green',
                backgroundColor: "pink",
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
    latest_chart.push(massPopChart)
}


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

async function create_graph(e)    {
    e.preventDefault()
    const bmi =  document.getElementById("bmi").value
    const sex =  document.getElementById("gender").value
    const country = document.getElementById("country").value
    const average_salary = document.getElementById("Average Salary").value
    const age = document.getElementById("Year").value
    const income_quantile = document.getElementById("QU").value
    const metadata_dict = {
        bmi:bmi,
        country: country,
        sex: sex,
        age: age,
        income_quantile: income_quantile,
    }
    console.log(metadata_dict)
    var xmlhttp = window.XMLHttpRequest
        ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            const bmi_data = filecontent(xmlhttp)
            if (country !== "TOTAL"){
                if (sex === "F" || sex === "M" ){
                    let data = finddataforcountry(bmi_data, metadata_dict)
                    generate_graph_for_single_gender(data["labels"],  data["values"],  get_label(metadata_dict), "No" ,average_salary)
                }
                else{
                    let metadata_male = Object.assign({},metadata_dict)
                    metadata_male.sex = "M"
                    let data_male = finddataforcountry(bmi_data, metadata_male)
                    let metadata_female = metadata_dict
                    metadata_female.sex = "F"
                    let data_female = finddataforcountry(bmi_data, metadata_female)
                    generate_graph_for_both_gender( data_male["labels"], data_male["values"],  data_female["values"], get_label(metadata_male), get_label(metadata_female)  , average_salary)
                }

            }
            else{
                if (sex === "F" || sex === "M" ){
                    let data = finddataforallcountries(bmi_data, metadata_dict)
                    //console.log(data)
                    let data_values_and_labels = get_countries_and_their_values(data)
                    generate_graph_for_single_gender(data_values_and_labels["countries"],  data_values_and_labels["countries_value"],   get_label(data), average_salary)
                }
                else{
                    let metadata_male = metadata_dict
                    metadata_male.sex = "M"
                    let data_male = finddataforallcountries(bmi_data, metadata_male)
                    let data_values_male = get_countries_and_their_values(data_male)
                    let metadata_female = metadata_dict
                    metadata_female.sex = "F"
                    let data_female = finddataforallcountries(bmi_data, metadata_female)
                    let data_values_female = get_countries_and_their_values(data_female)
                    generate_graph_for_both_gender(data_values_male["countries"], data_values_male["countries_value"], data_values_female["countries_value"], get_label(data_male),  get_label(data_female), "Yes" , average_salary)
                }
            }
        }
    };

    await xmlhttp.open("GET", bmi_data_file, true);
    await xmlhttp.send();

}



function finddataforcountry(array_of_bmi , metadata_dict){
    const all_year = ["Y18-44", "Y45-54", "Y55-64", "Y65-74", "Y_GE75"]
    let country = metadata_dict["country"]
    let data_array = []
    for (let i =0; i < array_of_bmi.length; i++){
        if (test_if_metadata_pass_for_a_country(array_of_bmi[i], metadata_dict, all_year)){
            console.log(array_of_bmi[i]["quantile"])
            data_array.push(array_of_bmi[i][country])
        }

    }

    return {
        label:country,
        labels:all_year,
        values:data_array
    }

}


function finddataforallcountries(array_of_bmi, metadata_dict){
    for (let i =0; i < array_of_bmi.length; i++){
        if (test_if_metadata_pass_for_all_countries(array_of_bmi[i], metadata_dict)){

            return array_of_bmi[i]
        }

    }
}

function test_if_metadata_pass_for_a_country(bmi_dict, metadata_dict, ages){
    return bmi_dict["sex"] === metadata_dict["sex"] && ages.includes(bmi_dict["age"]) && bmi_dict["quantile"] === metadata_dict["income_quantile"] && bmi_dict["bmi"] === metadata_dict["bmi"];
}

function test_if_metadata_pass_for_all_countries(bmi_dict, metadata_dict){
    return bmi_dict["sex"] === metadata_dict["sex"] && bmi_dict["age"]=== metadata_dict["age"]  && bmi_dict["quantile"] === metadata_dict["income_quantile"] && bmi_dict["bmi"] === metadata_dict["bmi"];
}


function generate_graph_for_both_gender(labels, male_values, female_values,  male_label, female_label, average_salary ){
    if(latest_chart.length === 1){
        latest_chart[0].destroy()
        latest_chart.pop()
    }
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    let massPopChart = new Chart(myChart, {
        type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data:{
            labels:labels,
            datasets:[{
                label:male_label,
                data: male_values,
                backgroundColor:'blue',
                borderWidth:1,
                borderColor:'#777',
                hoverBorderWidth:3,
                hoverBorderColor:'#000'
            }, {
                label:female_label,
                data: female_values,
                backgroundColor:"pink",
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
    latest_chart.push(massPopChart)
}



