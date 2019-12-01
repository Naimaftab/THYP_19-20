var dataOfFormulaireulaire;
var posibilities = {
    "Pas besoin":1, 
    "Besoin d'approfondissement":5, 
    "Besoin urgent":10, 
    "je ne connais pas du tout":1,
    "je connais un peu":5,
    "je connais bien":10,
    "je suis expert(e)":20
    };

let globalComp = [];
let globalNeeds = [];
let expertComp = {'id':[],'nom':[]}
let expertNeeds = {'id':[],'nom':[]}
        
// Recupe Google Data Form
var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv'            
var q = d3.queue()
    .defer(d3.csv, url)
    .awaitAll(function(error, results) {
         if (error) throw error;
         setData(results);
    });
        
function setData(data){
    dataOfFormulaire = data[0];

    dataOfFormulaire.forEach(function(d, j){
        d.reponses = {'besoins': [] ,'competences': [], 'outils': []};
        for (let i in d) {
            var prop = i.substring(i.indexOf("[") + 1, i.indexOf("]")); 
            var z = d[i];
            var e = posibilities[z];
            if(i.indexOf("besoins") > 0) {
                d.reponses.besoins.push({
                    'prop':prop,
                    'importance':e,
                    'expression':z,
                    'id':j
                    });
            }

            if(i.indexOf("compétences") > 0 && e){
                d.reponses.competences.push({
                    'prop': prop,
                    'importance': e,
                    'expression':  z,
                    'id': j
                    });
                }
            if(i.indexOf("outils utilisez") > 0 )
            {
                d.reponses.outils.push({
                    'prop': prop,
                    'importance': e,
                    'expression': z,
                    'id': j
                });
            }							
        }
    });
        

    dataOfFormulaire.forEach(etudiant => {
        etudiant.reponses.competences.forEach((competence,index) => {
            if (competence.importance){
            
            switch (competence.importance){
                case 1:
                    globalComp.push(0);
                    break;
                case 5:
                    globalComp.push(33);
                    break;
                case 10:
                    globalComp.push(66);
                    break;
                case 20:
                    globalComp.push(100);
                    expertComp.id.push(index);
                    expertComp.nom.push(etudiant["Votre prénom"] + " " + etudiant["Votre nom"]);
                    break;
                default:
                    globalComp.push(0);
                    break;
            }
            }
        });
        
        etudiant.reponses.besoins.forEach((besoin,index) => {
            if (besoin.importance) {
                switch (besoin.importance) {
                    case 1:
                        globalNeeds.push(0);
                        break;
                    case 5:
                        globalNeeds.push(50);
                        break;
                    case 10:
                        globalNeeds.push(100);
                        expertNeeds.id.push(index);
                        expertNeeds.nom.push(etudiant["Votre prénom"] + " " + etudiant["Votre nom"]);
                        break;
                    default:
                        globalNeeds.push(0);
                        break;
                }
            }      
        });
    });
        
        
    let incrementeCompetences =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    
    dataOfFormulaire[0].reponses.competences.forEach((competence, compIndex) => {
        for (let i = compIndex; i < globalComp.length; i += dataOfFormulaire[0].reponses.competences.length) {
            incrementeCompetences[compIndex] += globalComp[i];
        }
        incrementeCompetences[compIndex] = Math.round((incrementeCompetences[compIndex]) / (dataOfFormulaire.length));
    });

    let incrementeBesoins =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    dataOfFormulaire[0].reponses.besoins.forEach((besoin, besIndex) => {
        for(let i = besIndex; i < globalNeeds.length; i += dataOfFormulaire[0].reponses.besoins.length){
            incrementeBesoins[besIndex] += globalNeeds[i];
        }
        incrementeBesoins[besIndex] = Math.round((incrementeBesoins[besIndex]) / (dataOfFormulaire.length));
    });

    var globalCompSideBox = d3.select('#globalCompId').selectAll(".col-md-12").data(incrementeCompetences).enter()
            .append('div').attr('class', 'col-md-12')
            .append('div').attr('class', 'progress_br')
            .attr('id', function (d, i)  { return "" + i })
            .attr('onclick', 'BoxCompetences(this.id)')
            .append('span').attr('class','progress-badge')
            .text(function (d, i) { return '' + dataOfFormulaire[0].reponses.competences[i].prop + ' : '})
            .append('span').attr('class', 'progress-value')
            .text(function (d, i) { return d + "%" })
            .append('div').attr('class', 'progress_br')
            .style('margin-top', "-14px")
            .style('margin-bottom', "8px")
            .style('border', "1px")
            .style('padding', "5px")
            .style('border-radius', "10px")
            .append('div').attr('class', 'tools_expert')
            .append('div').attr('class', 'skill_main')
            .append('div').attr('class', 'skill_item')
            .append('div').attr('class', 'progress')
            .append('div').attr('class', 'progress-bar')
            .attr('progress-bar', 'progress-full')
            .attr('progress-bar', 10)
            .attr('role', 'progressbar')
            .attr('aria-valuenow', 60)
            .attr('aria-valuemin', 0)
            .attr('aria-valuemax', 100)
            .attr('style', function (d, i) { return "width: " + d + "%;"});

    var needsCompSideBox = d3.select('#globalNeedsId').selectAll(".col-md-12").data(incrementeBesoins).enter()
            .append('div').attr('class', 'col-md-12')
            .append('div').attr('class', 'progress_br')
            .attr('id', function (d, i) { return "" + i })
            .attr('onclick', 'BoxCompetences(this.id)')
            .append('span').attr('class','progress-badge')
            .text(function (d, i) { return ''+dataOfFormulaire[0].reponses.competences[i].prop + ' : '})
            .append('span').attr('class', 'progress-value')
            .text(function (d, i) { return d + "%" })
            .append('div').attr('class', 'progress_br')
            .style('margin-top', "-14px")
            .style('margin-bottom', "8px")
            .style('border', "1px")
            .style('padding', "5px")
            .style('border-radius', "10px")
            .append('div').attr('class', 'tools_expert')
            .append('div').attr('class', 'skill_main')
            .append('div').attr('class', 'skill_item')
            .append('div').attr('class', 'progress')
            .append('div').attr('class', 'progress-bar')
            .attr('progress-bar', 'progress-full')
            .attr('progress-bar', 10)
            .attr('role', 'progressbar')
            .attr('aria-valuenow', 60)
            .attr('aria-valuemin', 0)
            .attr('aria-valuemax', 100)
            .attr('style', function (d, i) { return "width: " + d + "%;"});

    }

    var modalBox = document.getElementById("mymodalBox");
    var headermodalBox = document.getElementById("headermodalBox");
    var span = document.getElementsByClassName("close")[0];
    var ContentmodalBox1 = document.getElementById('ContentmodalBox1');

        span.onclick = function() {
        modalBox.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modalBox) {
            modalBox.style.display = "none";
            }
        }

    function BoxCompetences(compId) {

        headermodalBox.innerHTML = 'Les étudiants experts pour cette compétence sont :';
        modalBoxFooter.innerHTML = 'Les étudiants ayant un besoin pour cette compétence sont :';
        ContentmodalBox1.innerHTML = "";
        ContentmodalBox2.innerHTML = "";
        var content1 = "";
        var content2 = "";

        expertComp.id.forEach((id, index) => {
        if (id == compId) {
            content1 = content1 + expertComp.nom[index] + '\n';
            ContentmodalBox1.innerHTML += ("<p>" + expertComp.nom[index] + "</p>");																  
        }
        });

        expertNeeds.id.forEach((id, index) => {
        if(id == compId){
            content2 = content2 + expertNeeds.nom[index] + '\n';
            ContentmodalBox2.innerHTML += ("<p>" + expertNeeds.nom[index] + "</p>");
        }
        });

        if(content1 == "")
            ContentmodalBox1.innerHTML = "Aucun étudiant est expert sur cette compétence";
        if(content2 == "")
            ContentmodalBox2.innerHTML = "Aucun étudiant n'a de besoin pour cette compétence";
                modalBox.style.display = "block";

    };

    function BoxNeeds(besoinId) {

        headermodalBox.innerHTML = 'Les étudiants ayant un besoin pour cette compétence sont :';
        modalBoxFooter.innerHTML = 'Les étudiants experts sur cette compétence sont :';
        ContentmodalBox1.innerHTML = "";
        ContentmodalBox2.innerHTML = "";
        var content1 = "";
        var content2 = "";

        expertNeeds.id.forEach((id, index) => {
            if (id == besoinId){
                content1 = content1 + expertNeeds.nom[index] + '\n';
                ContentmodalBox1.innerHTML += ("<p>" + expertNeeds.nom[index] + "</p>");
            }
        });

        expertComp.id.forEach((id, index) => {
            if(id == besoinId){
                content2 = content2 + expertComp.nom[index] + '\n';
                ContentmodalBox2.innerHTML += ("<p>" +expertComp.nom[index] + "</p>");
            }
        });

            if(content1 == "")
            ContentmodalBox1.innerHTML = "Aucun étudiant n'a de besoin pour cette compétence";
            if(content2 == "")
            ContentmodalBox2.innerHTML = "Aucun étudiant est expert sur cette compétence";
                modalBox.style.display = "block";

    };
