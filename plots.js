// This code is taken from intructor Dom's office hours on 12/11/21

console.log("plots.js loaded");

function DrawBarchart(sampleId) {

    console.log(`DrawBarchart(${sampleId})`);

    d3.json("samples.json").then(data => {

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id === sampleId);
        let result = resultArray[0];

        console.log(result);

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        let yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

        let barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h"
        };

        let barArray = [barData];

        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t:30, l: 150 }
        }

        Plotly.newPlot("bar", barArray, barLayout);

    });
}

function DrawBubblechart(sampleId) {

    console.log(`DrawBubblechart(${sampleId})`);

    d3.json("samples.json").then(data => {

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id === sampleId);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values,
            },
        };

        let bubbleArray = [bubbleData];

        let bubbleLayout = {
            title: "Bacteria Cultures per Sample",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" },
            margin: { t: 30 }
        };

        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);
    });
}

function ShowMetadata(sampleId) {

    console.log(`ShowMetadata(${sampleId})`);
    
    d3.json("samples.json").then(function(data) {

        console.log(data);

        let metadataArray = data.metadata.filter(metadata => metadata.id == sampleId);
        console.log(metadataArray)

        let demographicInfo = d3.select("#sample-metadata");

        demographicInfo.html("");

        Object.entries(metadataArray[0]).forEach(([key, value]) => {
            console.log([key, value]);
            demographicInfo.append("h5").text(`${key.toUpperCase()}: ${value}`);

        });

    });

}

function optionChanged(id) {
    console.log(`optionChanged(${id})`);

    DrawBarchart(id);
    DrawBubblechart(id);
    ShowMetadata(id);
}

function InitDashboard()
{
    console.log("Initializing Dashboard");

    let selector = d3.select("#selDataSet");

    d3.json("samples.json").then(data => {;

        let sampleNames = data.names;

        sampleNames.forEach(sampleId => {
            selector.append("option")  
                .text(sampleId)
                .property("value", sampleId);

        });

        let sampleId = sampleNames[0];

        DrawBarchart(sampleId);
        DrawBubblechart(sampleId);
        ShowMetadata(sampleId);
    });
}

InitDashboard();
