
function startup(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let file = this.responseText
            let countries = filecontent(file)["countries"]
            let countries_values = filecontent(file)["countries_values"]
            let label = filecontent(file)["label"]
            generate_graph_for_single_gender(countries, countries_values, label, "Yes")

        }
    };
    xhttp.open("GET", "hlth_ehis_de2.tsv", true);
    xhttp.send();
}

startup()

function filecontent(file){
    let allRows = file.split(/\r?\n|\r/);
    let metadata = allRows[0]

    let countries = metadata.split("\t").splice(1, metadata.length)
    let data_about_values = allRows[6].split("\t").shift()
    let countries_values_with_unknown = allRows[6].split("\t").splice(1, metadata.length)
    let countries_values = clean_array(countries_values_with_unknown)
    return {
        countries: countries,
        countries_values: countries_values,
        label: data_about_values
    }
}






function clean_array(array){
    let new_array = []
    for (let i = 0; i < array.length; i++) {
        let element = array[i].replace("u", "")
        new_array.push(element)
    }
    return new_array
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



let myChart = document.getElementById('myChart').getContext('2d');
let latest_chart = []

function generate_graph_for_single_gender(labels, values, label, average_salary){
    if(latest_chart.length === 1){
        latest_chart[0].destroy()
        latest_chart.pop()
        console.log(latest_chart)
    }
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';
    contries = ["Belgium", "Bulgaria", "Czechia", "Germany",  "Estonia" , "Ireland", 	"Spain",  	"France" , 	"Cyprus" , 	"Latvia" 	, "Luxembourg"   , 	"Malta"  , "Austria","Poland" , "Romania", "Slovenia", "Slovakia" , "Turkey"]
    if (contries.indexOf(label) == "-1"){
        labels = sort_changed_label_position(labels, values)["labels"]
        values = sort_changed_label_position(labels, values)["values"]
    }
    //here is the problem
    if(average_salary === "Yes"){
        let testingvariable = read_average_wage_file()
        console.log(testingvariable)

        labels = sort_changed_label_position(labels, values)["labels"]
        values = sort_changed_label_position(labels, values)["values"]
    }
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



function create_graph(e){
    e.preventDefault()
    const bmi =  document.getElementById("bmi").value
    const gender =  document.getElementById("gender").value
    const country = document.getElementById("country").value
    const average_salary = document.getElementById("Average Salary").value
    console.log(average_salary)
    const year = document.getElementById("Year").value
    const income_quantile = document.getElementById("QU").value
    const metadata_dict = {
        bmi:bmi,
        country: country,
        gender: gender,
        year: year,
        income_quantile: income_quantile,
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let file = this.responseText
            if (country !== "TOTAL"){
                if (gender === "F" || gender === "M" ){
                    let data = finddataforcountry(file, metadata_dict)

                    generate_graph_for_single_gender(data["labels"],  data["values"],  data["label"], average_salary)
                }
                else {
                    let metadata_male = metadata_dict
                    metadata_male.gender = "M"
                    let data_male = finddataforcountry(file, metadata_male)
                    let metadata_female = metadata_dict
                    metadata_female.gender = "F"
                    let data_female = finddataforcountry(file, metadata_female)
                    generate_graph_for_both_gender( data_male["labels"], data_male["values"],  data_female["values"], data_male["label"], data_male["label"] , average_salary )
                }
            }
            else{
                if (gender === "F" || gender === "M" ) {
                    let data_dict = finddatainfile(file, metadata_dict, gender)
                    generate_graph_for_single_gender(data_dict["label"], data_dict["values"][0], data_dict["labels"][0] , average_salary)
                }
                else{
                    let data_dict = finddatainfile(file, metadata_dict)
                    generate_graph_for_both_gender(data_dict["label"], data_dict["values"][0],   data_dict["values"][1], data_dict["labels"][0],  data_dict["labels"][1] , average_salary )
                }
            }

        }
    };
    xhttp.open("GET", "hlth_ehis_de2.tsv", true);
    xhttp.send();

}

function read_average_wage_file(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            let file = this.responseText
            let allRows = file.split(/\r?\n|\r/);
            return {
                labels: allRows[0],
                values: allRows[1]
            }

        }
    };
    xhttp.open("GET", "average_wage.csv", false);
    xhttp.send();
}




function finddataforcountry(file , metadata_dict){
    const all_year = ["Y18-44", "Y45-54", "Y55-64", "Y65-74", "Y_GE75"]
    let data = file.split(/\r?\n|\r/);
    const countries = data[0].split("\t").splice(1, data[0].length)
    const countryindex = countries.indexOf(metadata_dict["country"])
    let data_array = []
    for (let i =0; i < all_year.length; i++){
        metadata_dict["year"]  = all_year[i]
        let metadata = metadata_dict["bmi"] + "," + metadata_dict["gender"] + "," + metadata_dict["year"] + "," + metadata_dict["income_quantile"] + ",2008"
        //console.log(metadata)
        data_array.push(findrow(metadata , data)[countryindex])
    }


    return {
        label:metadata_dict["country"],
        labels:all_year,
        values:data_array
    }

}




function finddatainfile (file, metadata_dict) {
    let data = file.split(/\r?\n|\r/);
    let countries = data[0].split("\t").splice(1, data[0].length)
    if (metadata_dict["gender"] === "F" || metadata_dict["gender"] === "M" ){
        const metadata = metadata_dict["bmi"] + "," + metadata_dict["gender"] + "," + metadata_dict["year"] + "," + metadata_dict["income_quantile"] + ",2008"
        const values =  findrow(metadata, data)  //generate_graph_for_single_gender(countries, findrow(metadata, data), metadata)

        return {
           label: countries,
           labels: [metadata],
           values: [values]

        }
    }
    else{
        const male_metadata = metadata_dict["bmi"] + "," + "M" + "," + metadata_dict["year"] + "," + metadata_dict["income_quantile"] + ",2008"
        const female_metadata = metadata_dict["bmi"] + "," + "F" + "," + metadata_dict["year"] + "," + metadata_dict["income_quantile"] + ",2008"
        const male_values = findrow(male_metadata, data)
        const female_values = findrow(female_metadata, data)
        //generate_graph_for_both_gender(countries, findrow(male_metadata, data), findrow(female_metadata, data) , male_metadata , female_metadata)
        return {
            label: countries,
            labels: [male_metadata, female_metadata],
            values: [male_values, female_values]

        }
    }
}



function findrow(label, data){
    for (let i = 0; i < data.length; i++) {
        let data_metadata = data[i].split("\t").shift()
        if (data_metadata === label){
            return  clean_array(data[i].split("\t").splice(1, data[i].length))

        }

    }
}