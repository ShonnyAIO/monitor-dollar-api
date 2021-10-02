const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 5000;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* Esta funcion hace de convertir de bolivares a dolares, aplicando el factor de conversion de BCV */
app.get('/dollar-bcv/', (req, res) => {
    axios.get(`http://www.bcv.org.ve/`).then((response) => {

        const html = response.data;

        const $ = cheerio.load(html);

        let dollar = "";
        let data = [];

        /* Para convertir de USD a BS.D */
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
});

app.listen(PORT, () => {
    console.log("Servidor aperturado, puedes hacer las consultas:", PORT);
});