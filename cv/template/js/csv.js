d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv").then((data) => {

    // ICI ON GENERE TOUTE LES PHOTO POUR CREER LA GRILLE DE DEPART, ET CHAQUE PHOTO CONTIENT L'APPEL A LA FONCTION USER CHANGE

    console.log(data[0]);

    for (var i = 0; i <= data.length - 1; i++) {

        let url = new URL(data[i]['Votre photo']);
        let urlParam = new URLSearchParams(url.search);
        let id = urlParam.get('id');
        let urlTof = "https://drive.google.com/uc?id="+id+"&export=download"; 

        document.getElementById('etuCards').innerHTML += "<divid='divImg"+i+"'><img src='"+urlTof+"' id='img"+i+"' onclick='changeUser("+i+")'></div>";

    }


});

    // QUAND LA FONCTION USER CHANGE EST APPELEE, ELLE CHANGE TES INFOS EN FONCTION DE L'ID

    function changeUser(i){

    d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv").then((data) => {


        let url = new URL(data[i]['Votre photo']);
        let urlParam = new URLSearchParams(url.search);
        let id = urlParam.get('id');
        let urlTof = "https://drive.google.com/uc?id="+id+"&export=download"; 

        document.getElementById('photo_principale').setAttribute('src', urlTof);
        document.getElementById('nom').innerHTML = data[i]['Votre nom'];
        document.getElementById('prenom').innerHTML = data[i]['Votre prénom'];
        document.getElementById('email').innerHTML = data[i]['Votre mail'];
    });

    };


