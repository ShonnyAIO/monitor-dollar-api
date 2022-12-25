const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
app.get('/dollar-bcv/', (req, res) => {
    axios.get(`http://www.bcv.org.ve/`).then((response) => {

        const html = response.data;

        const $ = cheerio.load(html);

        let dollar = "";
        let data = [];

        $('div', '.view-content').each((index, element) => {
            dollar = ($(element).find('div#dolar').text().trim());
            if (dollar != '') {
                data.push(dollar);
                return data;
            }
        });
        data = [...new Set(data)];
        data[0] = data[0].replace(/\t/g, '');
        data[0] = data[0].replace(/\n/g, '');
        data[0] = data[0].replace(/ /g, '');
        data[0] = data[0].replace('USD', '');
        data[0] = data[0].replace(/,/g, '.');
        res.status(200).send({ precio: data[0] });
    });
}); */



/*
app.get('/euro-bcv/', (req, res) => {
    axios.get(`http://www.bcv.org.ve/`).then((response) => {

        const html = response.data;

        const $ = cheerio.load(html);

        let euro = "";
        let data = [];

        $('div', '.view-content').each((index, element) => {
            euro = ($(element).find('div.row.recuadrotsmc').text().trim());
            // console.log('EUR: ', euro);
            if (euro != '') {
                data.push(euro);
                return data;
            }
        });
        data = [...new Set(data)];
        data[0] = data[0].replace(/\t/g, '');
        data[0] = data[0].replace(/\n/g, '');
        data[0] = data[0].replace(/ /g, '');
        data[0] = data[0].replace('EUR', '');
        data[0] = data[0].replace(/,/g, '.');
        moneda_euro = data[0].split('CNY')[0];
        moneda_dollar = data[0].split('USD')[1];
        res.status(200).send({ euro: moneda_euro, dollar: moneda_dollar });
    });
});
*/

/* Hace el Scrapping al Banco Central de Venezuela - DOLLAR Y EURO */
app.get('/data-bcv', (req, res) => {
    axios.get(`http://www.bcv.org.ve/`).then((response) => {

        const html = response.data;

        const $ = cheerio.load(html);

        let euro = "";
        let data = [];

        /* Para convertir de USD a BS.D */
        $('div', '.view-content').each((index, element) => {
            euro = ($(element).find('div.row.recuadrotsmc').text().trim());
            // console.log('EUR: ', euro);
            if (euro != '') {
                data.push(euro);
                return data;
            }
        });
        data = [...new Set(data)];
        data[0] = data[0].replace(/\t/g, '');
        data[0] = data[0].replace(/\n/g, '');
        data[0] = data[0].replace(/ /g, '');
        data[0] = data[0].replace('EUR', '');
        data[0] = data[0].replace(/,/g, '.');
        moneda_euro = data[0].split('CNY')[0];
        moneda_dollar = data[0].split('USD')[1];
        res.status(200).send({ euro: moneda_euro, dollar: moneda_dollar });
    });
});

/* Hace el Scrapping al Exchange Monitor - Dolares */
app.get('/dollar-paralelo', (req, res) => {
    axios.get('https://exchangemonitor.net/estadisticas/ve/dolar-enparalelovzla').then((response) => {

        const html = response.data;
        const $ = cheerio.load(html);

        let data = [];
        let dollar = '';

        $('div', '.container').each((index, element) => {
            dollar = ($(element).find('div.col.texto h2').text().trim());
            if (dollar) {
                data.push(dollar);
            }
        });
        data = [...new Set(data)];
        data[0] = data[0].replace(/\t/g, '');
        data[0] = data[0].replace(/\n/g, '');
        data[0] = data[0].replace(/ /g, '');
        data[0] = data[0].replace('BS/USD', '');
        data[0] = data[0].replace(/,/g, '.');
        res.status(200).send({ precio: data[0] });
    });
});

/* Hace el Scrapping al Exchange monitor de Pesos Colombianos */
app.get('/pesos-colombianos', (req, res) => {
    axios.get('https://exchangemonitor.net/calculadora/monedas/COP-VES').then((response) => {

        const html = response.data;
        const $ = cheerio.load(html);

        let data = [];
        let pesos_colombianos = '';

        $('div', '.row').each((index, element) => {
            pesos_colombianos = ($(element).find('h3').text().trim());
            if (pesos_colombianos) {
                data.push(pesos_colombianos);
            }
        });
        data = [...new Set(data)];
        data[0] = data[0].split('=')[1];
        data[0] = data[0].split('VES')[0];
        data[0] = data[0].replace(/,/g, '.');
        data[0] = data[0].trim();
        res.status(200).send({ precio: data[0] });
    });
});

app.listen(PORT, () => {
    console.log("Servidor aperturado, puedes hacer las consultas:", PORT);
});