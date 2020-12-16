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
const countries_in_data = ["Belgium", "Bulgaria", "Czechia", "Germany",  "Estonia" , "Ireland", 	"Spain",  	"France" , 	"Cyprus" , 	"Latvia" 	, "Luxembourg"   , 	"Malta"  , "Austria","Poland" , "Romania", "Slovenia", "Slovakia" , "Turkey"];
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
    let new_countries = countries_in_data.filter(country => (countries.includes(country)))
    if (countries.includes("TOTAL")){
        new_countries = countries_in_data
    }
    return new_countries

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
            bmi = "Normal Weight"
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
        age = ""
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
            income = ""
            break
        case "QU1":
            income = " Lowest Income"
            break;
        case "QU2":
            income = " Lower Middle Income"
            break;
        case "QU3":
            income = " Middle Income"
            break;
        case "QU4":
            income = " Upper Middle Income"
            break;
        case "QU5":
            income = " Upper Income"
            break;
        default:
            income = "Unknown"
    }
    let label =  bmi + ", " + gender
    if (age !== ""){
        label = label+ ", " +  age
    }
    if(income!== ""){
        label = label + ", " + income
    }
    return label
}


//this one will create starting graph.
function startup(bmi_data){
    const generated_data_female =  finddatawithtag(bmi_data, countries_in_data, ["TOTAL"], ["TOTAL"], ["18.5-25"], "F");
    const generated_data_male =  finddatawithtag(bmi_data, countries_in_data, ["TOTAL"], ["TOTAL"], ["18.5-25"], "M");
    scatter_plot_graph(countries_in_data,generated_data_female.concat(generated_data_male))
}



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



//meant to sort, so that get to see largest value first on the graph
function sort_changed_label_position(values, labels, reverse=false){
    let new_combined_array = []
    var i;
    for (i = 0; i < values.length; i++) {
        let new_combined_element = [values[i], labels[i] ] ;
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
async function create_bar_chart(e)    {

    e.preventDefault()
    let countries = $('#bar_country').val();
    let bmi =  $('#bar_bmi').val();
    const sex =  document.getElementById("bar_gender").value
    countries = countries_in_correct_order(countries)
    let age = $('#bar_age').val();
    let quantile = $('#bar_quantile').val();
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
    console.log(countries, bmi, sex, quantile)
    if(bmi.length > 1 &&  age.length > 1 || bmi.length > 1 &&  quantile.length > 1 || quantile.length > 1 &&  age.length > 1 ){
        Swal.fire({
            icon: "error",
            title: "Sorry :(",
            text: "Unable to generate Bar chart",
            footer: "You can not show set or subset of multiple bmi, quantile or age together.",
          }).then(()=>{
            $('#bar_bmi').val('18.5-25').selectpicker('refresh');
            $('#bar_age').val('TOTAL').selectpicker('refresh');
            $('#bar_gender').val('T').selectpicker('refresh');
            $('#bar_country').val('TOTAL').selectpicker('refresh');
            $('#bar_quantile').val('TOTAL').selectpicker('refresh');
          });
          

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
                console.log(generated_data_female)
                bar_graph(countries, generated_data_female.concat(generated_data_male))
            }
        else{
            const generated_data =  finddatawithtag(bmi_data, countries, age, quantile, bmi, sex);
            bar_graph(countries, generated_data)
        }

            }




    }

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


async function create_scatter_plot(e){
    e.preventDefault()
    let countries = $('#scatter_country').val();
    let bmi =  [$('#scatter_bmi').val()];
    const sex =  document.getElementById("scatter_gender").value
    console.log(countries)
    countries = countries_in_correct_order(countries)
    let age = [$('#scatter_age').val()];
    let quantile = [$('#scatter_quantile').val()];
    if (bmi.length === 0){
        bmi = ["18.5-25"]
    }
    if (age.length === 0){
        age = ["TOTAL"]
    }
    if (quantile.length === 0){
        quantile = ["TOTAL"]
    }
    console.log(countries)
    if (countries.length === 0 || countries.includes("TOTAL")){
        countries = countries_in_data
    }
    //console.log(bmi, sex, age, quantile, countries)
    if(bmi.length > 1 &&  age.length > 1 || bmi.length > 1 &&  quantile.length > 1 || quantile.length > 1 &&  age.length > 1 ){
        // alert("you can not show multiple bmi, quantile, age together with each other ")
        Swal.fire({
            icon: "error",
            title: "Sorry :(",
            text: "Unable to generate Bar chart",
            footer: "You can not show set or subset of multiple bmi, quantile or age together.",
          }).then(()=>{
            $('#bar_bmi').val('18.5-25').selectpicker('refresh');
            $('#bar_age').val('TOTAL').selectpicker('refresh');
            $('#bar_gender').val('T').selectpicker('refresh');
            $('#bar_country').val('TOTAL').selectpicker('refresh');
            $('#bar_quantile').val('TOTAL').selectpicker('refresh');
          });
          
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
    //console.log(values_and_label)
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';
    let datasets = []
    //the array length is equal to how many different label there is. if a countries has two values, then it because dataset has been pushed twice.
    let female_count = 0
    let male_count = 0
    //console.log(values_and_label)
    for (let i = 0; i < values_and_label.length; i++ ){
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        let label = values_and_label[i]["label"];
        let value =  values_and_label[i]["value"]
        let new_label = get_label(label)
        let backgroundcolor = ""
        let new_value = change_value_into_scatter_value(value)
        switch(label["sex"]){
            case "F":
                backgroundcolor = "#DB3069"
                break;
            case "M":
                backgroundcolor = "#39da7c"
                break;
            default:
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
                text:'Correlation of Average wage and BMI (2008)',
                fontSize:25,
                fontColor:'white'

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
                    top:100
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
                            return  value +'€';
                        },
                        beginAtZero: true,
                    },
                    //display:true,
                    scaleLabel: {
                        fontColor:"white",
                        display: true,
                        labelString: 'Average Wage'
                    }
                }],
                xAxes: [{
                    position: "bottom",
                    type:"linear",
                    ticks: {
                        fontColor:"white",
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return  value +'%';
                        },
                        //display: true,

                    },
                    scaleLabel: {
                        fontColor:"white",
                        display: true,
                        labelString: 'Population Percentage(%)'
                    }
                }]
            }
        },





    });
    scatterplot_chart.push(massPopChart)
}

function change_value_into_scatter_value(bmi_countries){
    let new_list = []
    let average_wage =  [2936,279,906,3103,825,3682,2014,2003,1801,682,4051,1042,3410,837,478,1391,773,144]
    for (let i = 0; i < bmi_countries.length; i++){
        new_list.push({x:bmi_countries[i], y:average_wage[i]})
    }

    return new_list
}





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

async function both_graph(e){
    create_bar_chart(e)
    create_scatter_plot(e)
}
