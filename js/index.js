
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
const countries_in_data = ["Belgium", "Bulgaria", "Czechia", "Germany",  "Estonia" , "Ireland", 	"Spain",  	"France" , 	"Cyprus" , 	"Latvia" 	, "Luxembourg"   , 	"Malta"  , "Austria","Poland" , "Romania", "Slovenia", "Slovakia" , "Turkey"]

/////////////////////////////////////////////////////////
// TODO STARTS HERE

//we get a object like {bmi: 18-25,  sex: F ,  belgium: 20.50 and so on } then we return object with countries and values we want, thereby discarding sex, bmi, ects.
function get_countries_and_their_values(allowed_countries, countries_dict){
    let countries = []
    let countries_value = []
    for (const [key, value] of Object.entries(countries_dict)) {

        if (allowed_countries.includes(key)){
            countries.push(key)
            countries_value.push(value)
        }
    }
    return{
        countries:countries,
        countries_value:countries_value
    }
}

//this one was meant to create the output users see of the label attached to the data
function countries_in_correct_order(countries){
    return countries_in_data.filter(country => (countries.includes(country)))

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
    switch (gender) {
        case "F":
            gender = "Female"
            break
        case "M":
            gender = "Male"
            break
        case "T":
            gender = "Both gender"
            break
        default:
            gender = "Error"
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


//this one will create starting graph.
function startup(bmi_data){
    const generated_data_female =  finddatawithtag(bmi_data, countries_in_data, ["TOTAL"], ["TOTAL"], ["18.5-25"], "F");
    const generated_data_male =  finddatawithtag(bmi_data, countries_in_data, ["TOTAL"], ["TOTAL"], ["18.5-25"], "M");
    bar_graph(countries_in_data, generated_data_female.concat(generated_data_male), false)
    const generated_data_age_female =  finddataforageallcountries(bmi_data, ["Belgium", "Austria", "Spain"],["TOTAL"], ["TOTAL"], ["18.5-25"], "F");
    const generated_data_age_male =  finddataforageallcountries(bmi_data, countries_in_data,["TOTAL"], ["TOTAL"], ["18.5-25"], "M");
    line_chart_graph([18, 45, 55, 65, 75], generated_data_age_female)
}



//takes the csv file and create an array with obj consisting of one set of tags.
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
   //console.log("AS JAVASCRIPT KEY-VALUE OBJECT========== \n", jsonObj);
   return jsonObj
}



//meant to sort, so that get to see largest value first on the graph
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


//this is a function we call when a user enter create graph on the website.
async function create_bar_graph(e)    {
    e.preventDefault()
    let countries = $('#country').val();
    let bmi =  $('#bmi').val();
    const sex =  document.getElementById("gender").value
    const check_if_vis_on_age = document.getElementById("vis_on_age").checked
    countries = countries_in_correct_order(countries)
    let age = $('#age').val();
    let quantile = $('#quantile').val();
    if (bmi.length === 0){
        bmi = ["18.5-25"]
    }
    if (age.length === 0){
        age = ["TOTAL"]
    }
    if (quantile.length === 0){
        quantile = ["TOTAL"]
    }

    if (countries.length === 0 || countries.includes("TOTAL")){
        countries = countries_in_data
    }

    if(bmi.length > 1 &&  age.length > 1 || bmi.length > 1 &&  quantile.length > 1 || quantile.length > 1 &&  age.length > 1 ){
        alert("you can not show multiple bmi, quantile, age together with each other ")
        return;
    }
    var xmlhttp = window.XMLHttpRequest
        ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            const all_ages = ["Y18-44", "Y45-54", "Y55-64", "Y65-74", "Y_GE75"]
            const bmi_data = filecontent(xmlhttp)
            if(check_if_vis_on_age){
                if(sex === "T" ){
                    const generated_data_age_female =  finddataforageallcountries(bmi_data, countries, age, quantile, bmi, "F");
                    const generated_data_age_male =  finddataforageallcountries(bmi_data, countries, age, quantile, bmi, "M");
                    bar_graph(all_ages, generated_data_age_female.concat(generated_data_age_male), check_if_vis_on_age)
                }
                else{
                    let Each_age_data = finddataforageallcountries(bmi_data, countries, age, quantile, bmi, sex, check_if_vis_on_age)
                    bar_graph(all_ages, Each_age_data, check_if_vis_on_age)

                }
            }
            else {
                if(sex === "T" ){
                    const generated_data_female =  finddatawithtag(bmi_data, countries, age, quantile, bmi, "F");
                    const generated_data_male =  finddatawithtag(bmi_data, countries, age, quantile, bmi, "M");
                    bar_graph(countries, generated_data_female.concat(generated_data_male), check_if_vis_on_age)
                }
                else{
                    const generated_data =  finddatawithtag(bmi_data, countries, age, quantile, bmi, sex);
                    bar_graph(countries, generated_data,  check_if_vis_on_age)
                }

            }
        }



    };

    await xmlhttp.open("GET", bmi_data_file, true);
    await xmlhttp.send();

}


//here we search all the data, with all the tags we can have. You can only choose once mutiple choice for age, quantile, bmi.
function finddatawithtag(array_of_bmi, countries,  age, quantile, bmi, sex){
        if (age.length > 1) {
            let value_and_label = []
            for (let i = 0; i < age.length; i++) {
                const data_dict = finddataforallcountries(array_of_bmi, age[i], quantile[0], bmi[0], sex)
                const data_for_countries = get_countries_and_their_values(countries, data_dict)["countries_value"]
                let element_of_value_and_length = {
                    value: data_for_countries,
                    label: {
                        bmi: bmi[0],
                        country: countries,
                        sex: sex,
                        age: age[i],
                        quantile: quantile[0]
                    }
                }
                value_and_label.push(element_of_value_and_length)
            }
            return value_and_label
        }
        if (quantile.length > 1) {
            let value_and_label = []
            for (let i = 0; i < quantile.length; i++) {
                const data_dict = finddataforallcountries(array_of_bmi, age[0], quantile[i], bmi[0], sex)
                const data_for_countries = get_countries_and_their_values(countries, data_dict)["countries_value"]
                let element_of_value_and_length = {
                    value: data_for_countries,
                    label: {
                        bmi: bmi[0],
                        country: countries,
                        sex: sex,
                        age: age[0],
                        quantile: quantile[i]
                    }
                }
                value_and_label.push(element_of_value_and_length)
            }
            return value_and_label
        } else {
            let value_and_label = []
            for (let i = 0; i < bmi.length; i++) {
                const data_dict = finddataforallcountries(array_of_bmi, age[0], quantile[0], bmi[i], sex)
                const data_for_countries = get_countries_and_their_values(countries, data_dict)["countries_value"]
                let element_of_value_and_length = {
                    value: data_for_countries,
                    label: {
                        bmi: bmi[i],
                        country: countries,
                        sex: sex,
                        age: age[0],
                        quantile: quantile[0]
                    }
                }
                value_and_label.push(element_of_value_and_length)
            }
            return value_and_label

        }
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


//finds the data in the file given with tags
function finddataforallcountries(array_of_bmi, age, quantile, bmi, sex){
    for (let i =0; i < array_of_bmi.length; i++){
        if (test_if_metadata_pass_for_all_countries(array_of_bmi[i], age, quantile, bmi, sex)){

            return array_of_bmi[i]
        }

    }
}

//check tags in the file are in the same as the ones we have supplied
function test_if_metadata_pass_for_all_countries(bmi_dict, age, quantile, bmi, sex){
    return bmi_dict["sex"] === sex  && bmi_dict["age"]=== age  && bmi_dict["quantile"] ===quantile  && bmi_dict["bmi"] === bmi;
}

//here we want to find different data when we are looking with age.
function test_if_metadata_pass_for_a_country(bmi_dict, age, quantile, bmi, sex, ages){
    return bmi_dict["sex"] === sex && bmi_dict["quantile"] === quantile && bmi_dict["bmi"] === bmi;
}


//this created the graph with graph js.

let myChart = document.getElementById('myChart').getContext('2d');
let bar_chart = []

async function bar_graph(labels, values_and_label  , check_if_vis_age){
    //console.log(values_and_label)
    //this is because you have to delete former graph, or you will not be able assign it to the same canvas. .
    if(bar_chart.length === 1){
        bar_chart[0].destroy()
        bar_chart.pop()
    }
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';
    let datasets = []
    //the array length is equal to how many different label there is. if a countries has two values, then it because dataset has been pushed twice.
    for (let i = 0; i < values_and_label.length; i++ ){
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        let label = values_and_label[i]["label"];
        let value =  values_and_label[i]["value"]
        let new_label = label["sex"] + " " +  label["bmi"] + " "+ label["age"] + " " + label["quantile"]
        if (check_if_vis_age){
            new_label=  label["country"]
        }
        let backgroundcolor = ""
        switch(label["sex"]){
            case "T":
                backgroundcolor = "purple"
                break
            case "F":
                backgroundcolor = "pink"
                break
            case "M":
                backgroundcolor = "red"
                break
            default:
                backgroundcolor =  "#" + randomColor
        }
        datasets.push({
            label: new_label,
            data: value,
            backgroundColor: backgroundcolor,
            borderWidth:1,
            borderColor:'#777',
            hoverBorderWidth:3,
            hoverBorderColor:'#000'
        })
    }
    if(check_if_vis_age){
        let new_sorted_dataset = []
        for (let i =0; i< (datasets.length/2);i++ ){
            new_sorted_dataset.push(datasets[i])
            new_sorted_dataset.push(datasets[i + (datasets.length/2)])
        }
        datasets = new_sorted_dataset
    }

    let massPopChart = new Chart(myChart, {
        type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data:{
            labels:labels,
            datasets:datasets
        },

        options:{
            title:{
                display:true,
                text:'bmi ',
                fontSize:25
            },
            legend:{
                display:true,
                position:"bottom",
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
    bar_chart.push(massPopChart)
}
/*
async function create_scatter_plot(e){
    e.preventDefault()
    let countries = $('#country').val();
    let bmi =  $('#bmi').val();
    const sex =  document.getElementById("gender").value
    countries = countries_in_correct_order(countries)
    let age = $('#age').val();
    let quantile = $('#quantile').val();
    if (bmi.length === 0){
        bmi = ["18.5-25"]
    }
    if (age.length === 0){
        age = ["TOTAL"]
    }
    if (quantile.length === 0){
        quantile = ["TOTAL"]
    }

    if (countries.length === 0 || countries.includes("TOTAL")){
        countries = countries_in_data
    }

    if(bmi.length > 1 &&  age.length > 1 || bmi.length > 1 &&  quantile.length > 1 || quantile.length > 1 &&  age.length > 1 ){
        alert("you can not show multiple bmi, quantile, age together with each other ")
        return;
    }
    var xmlhttp = window.XMLHttpRequest
        ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            const bmi_data = filecontent(xmlhttp)
            if(sex === "T" ){
                const generated_data_female =  finddatawithtag(bmi_data, countries, age, quantile, bmi, "F");
                const generated_data_male =  finddatawithtag(bmi_data, countries, age, quantile, bmi, "M");
                scatter_plot_graph(countries, generated_data_female.concat(generated_data_male))
            }
            else{
                const generated_data =  finddatawithtag(bmi_data, countries, age, quantile, bmi, sex);
                scatter_plot_graph(countries, generated_data)
            }
        }



    };

    await xmlhttp.open("GET", bmi_data_file, true);
    await xmlhttp.send();


}

let scatterchart = document.getElementById('scatterplot').getContext('2d');
let scatterplot_chart = []

async function scatter_plot_graph(labels, values_and_label){
    //console.log(values_and_label)
    //this is because you have to delete former graph, or you will not be able assign it to the same canvas. .
    if(scatterplot_chart.length === 1){
        scatterplot_chart[0].destroy()
        scatterplot_chart.pop()
    }
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';
    let datasets = []
    //the array length is equal to how many different label there is. if a countries has two values, then it because dataset has been pushed twice.
    for (let i = 0; i < values_and_label.length; i++ ){
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        let label = values_and_label[i]["label"];
        let value =  values_and_label[i]["value"]
        let new_label = label["sex"] + " " +  label["bmi"] + " "+ label["age"] + " " + label["quantile"]
        let backgroundcolor = ""
        let new_value = change_value_into_scatter_value(value)
        switch(label["sex"]){
            case "T":
                backgroundcolor = "purple"
                break
            case "F":
                backgroundcolor = "pink"
                break
            case "M":
                backgroundcolor = "red"
                break
            default:
                backgroundcolor =  "#" + randomColor
        }
        if(values_and_label.length > 2){
            backgroundcolor =  "#" + randomColor
        }
        datasets.push({
            label: new_label,
            data: new_value,
            backgroundColor: backgroundcolor,
            fill: false,
            showLine: false

        })
    }


    let massPopChart = new Chart(scatterchart, {
        type:'scatter', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data:{
            labels:labels,
            datasets:datasets
        },

        options:{
            title:{
                display:true,
                text:'bmi ',
                fontSize:25
            },
            legend:{
                display:true,
                position:"bottom",
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
                    position: "bottom",
                    type:"linear",
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },





    });
    scatterplot_chart.push(massPopChart)
}

function change_value_into_scatter_value(value){
    let new_list = []
    value.forEach(add_x_y)
    function add_x_y(item, index){
            new_list.push({x:item, y:item})
    }
    return new_list
}

*/



async function create_line_chart(e){
    e.preventDefault()
    let countries = $('#country').val();
    let bmi =  $('#bmi').val();
    const sex =  document.getElementById("gender").value
    countries = countries_in_correct_order(countries)
    let age = $('#age').val();
    let quantile = $('#quantile').val();
    if (bmi.length === 0){
        bmi = ["18.5-25"]
    }
    if (age.length === 0){
        age = ["TOTAL"]
    }
    if (quantile.length === 0){
        quantile = ["TOTAL"]
    }

    if (countries.length === 0 || countries.includes("TOTAL")){
        countries = countries_in_data
    }

    if(bmi.length > 1 &&  age.length > 1 || bmi.length > 1 &&  quantile.length > 1 || quantile.length > 1 &&  age.length > 1 ){
        alert("you can not show multiple bmi, quantile, age together with each other ")
        return;
    }
    var xmlhttp = window.XMLHttpRequest
        ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            const all_ages = ["Y18-44", "Y45-54", "Y55-64", "Y65-74", "Y_GE75"]
            const labels_age = [18, 45, 55, 65,75]
            const bmi_data = filecontent(xmlhttp)
            if (sex === "T") {
                const generated_data_age_female = finddataforageallcountries(bmi_data, countries, age, quantile, bmi, "F");
                const generated_data_age_male = finddataforageallcountries(bmi_data, countries, age, quantile, bmi, "M");
                line_chart_graph(labels_age, generated_data_age_female.concat(generated_data_age_male))
            } else {
                let Each_age_data = finddataforageallcountries(bmi_data, countries, age, quantile, bmi, sex)
                line_chart_graph(labels_age, Each_age_data)

            }
        }




    };

    await xmlhttp.open("GET", bmi_data_file, true);
    await xmlhttp.send();


}
//let linechart = document.getElementById('linegraph').getContext('2d');
let line_chart_list = []

async function line_chart_graph(labels, values_and_label){
    console.log(values_and_label)
    //this is because you have to delete former graph, or you will not be able assign it to the same canvas. .
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
        let new_label = label["country"] + " " +  label["sex"]
        let backgroundcolor = "#" + randomColor

        datasets.push({
            label: new_label,
            data: value,
            borderColor: backgroundcolor,
            fill:false

        })
    }
    let massPopChart = new Chart(document.getElementById("linegraph"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            title:{
                display:true,
                text:'bmi ',
                fontSize:25
            },
            legend:{
                display:true,
                position:"bottom",
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


    line_chart_list.push(massPopChart)
}



async function both_graph(e){
    create_bar_graph(e)
    create_line_chart(e)
}



