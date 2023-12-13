const express = require('express');

const app = express();
const path = require('path');
const { DefaultDeserializer } = require('v8');
const api = require('./api');
const symbol = process.env.SYMBOL;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/data', async (req, res) => {
    const data = {};
    const mercado = await api.depth(symbol);
    data.buy = mercado.bids.length ? mercado.bids[0][0] : 0;
    data.sell = mercado.asks.length ? mercado.asks[0][0] : 0;

    const carteira = await api.accountInfo();
    const coins = carteira.balances.filter(b => symbol.indexOf(b.asset) !== -1);
    data.coins = coins;

    const sellPrice = parseFloat(data.sell);
    const carteiraUSD = parseFloat(coins.find(c => c.asset.endsWith('USDT')).free);

    if (sellPrice < 100000) {
        const qty = parseFloat((carteiraUSD / sellPrice) - 0.00001).toFixed(5); // calculo de quantidade
        data.qty = qty;
        // if (qty > 0) {
        //     const buyOrder = await api.newOrder(symbol, 0.2);
        //     data.buyOrder = buyOrder;
        //     if (buyOrder.status === 'FILLED') {
        //         const price = parseFloat(sell * profitability).toFixed(8);
        //         const sellOrder = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');
        //         data.sellOrder = sellOrder;
        //     }
        // }
    }

    res.json(data);
})

app.use('/', (req, res) => {
    res.render('app', {
        symbol: process.env.SYMBOL,
        profitability: process.env.PROFITABILITY,
        lastUpdate: new Date(),
        interval: parseInt(process.env.CRAWLER_INTERVAL)
    });
});

app.listen(process.env.PORT, () => {
    console.log('App rodando');
});