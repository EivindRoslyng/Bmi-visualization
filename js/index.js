
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
    let data_for_graph = bmi_data[5]
    let countries_and_value = get_countries_and_their_values(countries_in_data, data_for_graph)
    generate_graph_for_single_gender(countries_and_value["countries"], countries_and_value["countries_value"], get_label(data_for_graph), "Yes", "No")
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


let myChart = document.getElementById('myChart').getContext('2d');
let latest_chart = []


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
async function create_graph(e)    {
    e.preventDefault()
    let countries = $('#country').val();
    let bmi =  $('#bmi').val();
    const sex =  document.getElementById("gender").value
    const average_salary = document.getElementById("Average Salary").value
    const check_if_vis_on_age = document.getElementById("vis_on_age").checked
    const gender_separation = document.getElementById("gender-separation").checked

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
                if(gender_separation &&  sex === "T" ){
                    const generated_data_age_female =  finddataforageallcountries(bmi_data, countries, age, quantile, bmi, "F", check_if_vis_on_age);
                    const generated_data_age_male =  finddataforageallcountries(bmi_data, countries, age, quantile, bmi, "M", check_if_vis_on_age);
                    generate_graph_for_both_gender(all_ages, generated_data_age_male.concat(generated_data_age_male), "No", check_if_vis_on_age, gender_separation)
                }
                else{
                    let Each_age_data = finddataforageallcountries(bmi_data, countries, age, quantile, bmi, sex, check_if_vis_on_age)
                    generate_graph_for_both_gender(all_ages, Each_age_data, "No", check_if_vis_on_age, gender_separation)

                }
            }
            else {
                if(gender_separation &&  sex === "T" ){
                    const generated_data_female =  finddatawithtag(bmi_data, countries, age, quantile, bmi, "F", gender_separation);
                    const generated_data_male =  finddatawithtag(bmi_data, countries, age, quantile, bmi, "M", gender_separation);
                    generate_graph_for_both_gender(countries, generated_data_female.concat(generated_data_male), "No", check_if_vis_on_age, gender_separation)
                }
                else{
                    const generated_data =  finddatawithtag(bmi_data, countries, age, quantile, bmi, sex, gender_separation);
                    generate_graph_for_both_gender(countries, generated_data, "No", check_if_vis_on_age, gender_separation)
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

//to be deleted
function generate_graph_for_single_gender(labels, values, label, sorted , average_salary){
    if(latest_chart.length === 1){
        latest_chart[0].destroy()
        latest_chart.pop()
        //console.log(latest_chart)
    }
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    if (sorted === "Yes"){
        labels = sort_changed_label_position(labels, values)["labels"]
        values = sort_changed_label_position(labels, values)["values"]
    }

    //console.log(label, values)
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
                position:'bottom',
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


//this created the graph with graph js.
function generate_graph_for_both_gender(labels, values_and_label , average_salary , checked, gender_seperation){
    //console.log(values_and_label)
    //this is because you have to delete former graph, or you will not be able assign it to the same canvas. .
    if(latest_chart.length === 1){
        latest_chart[0].destroy()
        latest_chart.pop()
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
        if (checked){
            new_label=  label["country"]
        }
        datasets.push({
            label: new_label,
            data: value,
            backgroundColor: "#" + randomColor,
            borderWidth:1,
            borderColor:'#777',
            hoverBorderWidth:3,
            hoverBorderColor:'#000'
        })
    }
    if(checked && gender_seperation){
        console.log(datasets)
        let new_sorted_dataset = []
        for (let i =0; i< (datasets.length/2);i++ ){
            new_sorted_dataset.push(datasets[i])
            new_sorted_dataset.push(datasets[i + (datasets.length/2)])
        }
        datasets = new_sorted_dataset
        console.log(datasets)
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
    latest_chart.push(massPopChart)
}


