const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    allow_forward_starting: {
        type: Number,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    display_order: {
        type: Number,
        required: true
    },
    exchange_is_open: {
        type: Number,
        required: true
    },
    is_trading_suspended: {
        type: Number,
        required: true
    },
    market: {
        type: String,
        required: true
    },
    market_display_name: {
        type: String,
        required: true
    },
    pip: {
        type: Number,
        required: true
    },
    subgroup: {
        type: String,
        required: true
    },
    subgroup_display_name: {
        type: String,
        required: true
    },
    submarket: {
        type: String,
        required: true
    },
    submarket_display_name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    symbol_type: {
        type: String,
        required: true
    }
},
{timestamps: true}
);

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
