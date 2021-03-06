// ==UserScript==
/* globals jQuery, $, L, waitForKeyElements, cloneInto */
// @name            California Grids overlay
// @author          rragan (derived from cachetur Assistant code)
// @version         1.0.0.5
// @description     Companion script for geocaching.com with Norcal and Golden State DeLorme Grids
// @include         https://www.geocaching.com/play/map*
// @include         http://www.geocaching.com/play/map*
// @include         https://www.geocaching.com/map/*
// @include         http://www.geocaching.com/map/*
// @include         https://www.geocaching.com/play/map*
// @include         http://www.geocaching.com/play/map*
// @include         https://www.geocaching.com/geocache/*
// @include         http://www.geocaching.com/geocache/*
// @include         https://www.geocaching.com/seek/cache_details.aspx*
// @include         https://www.geocaching.com/plan/lists/BM*
// @include         http://www.geocaching.com/play/geotours/*
// @include         https://www.geocaching.com/play/geotours/*
// @include         http://project-gc.com/*
// @include         https://project-gc.com/*
// @connect         self
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_openInTab
// @grant           GM_addStyle
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-end
// @copyright       2021+, rragan
// @require         https://code.jquery.com/jquery-latest.js
// @require         https://gist.github.com/raw/2625891/waitForKeyElements.js
// @updateURL       https://github.com/rragan/DeLormeGridOverlay/raw/main/CaliforniaGrids.meta.js
// @downloadURL     https://github.com/rragan/DeLormeGridOverlay/raw/main/CaliforniaGrids.user.js
// ==/UserScript==

// Northern California DeLorme Grid coordinates
var NCalCoords = [
    [42.009722, 41.5, -123.9375, -124.375, "22"],
    [42.009722, 41.5, -123.5, -123.9375, "23"],
    [42.009722, 41.5, -123.0625, -123.5, "24"],
    [42.009722, 41.5, -122.625, -123.0625, "25"],
    [42.009722, 41.5, -122.1875, -122.625, "26"],
    [42.009722, 41.5, -121.75, -122.1875, "27"],
    [42.009722, 41.5, -121.3125, -121.75, "28"],
    [42.009722, 41.5, -120.875, -121.3125, "29"],
    [42.009722, 41.5, -120.4375, -120.875, "30"],
    [42.009722, 41.5, -119.998056, -120.4375, "31"],
    [41.5, 41.0, -123.9375, -124.375, "32"],
    [41.5, 41.0, -123.5, -123.9375, "33"],
    [41.5, 41.0, -123.0625, -123.5, "34"],
    [41.5, 41.0, -122.625, -123.0625, "35"],
    [41.5, 41.0, -122.1875, -122.625, "36"],
    [41.5, 41.0, -121.75, -122.1875, "37"],
    [41.5, 41.0, -121.3125, -121.75, "38"],
    [41.5, 41.0, -120.875, -121.3125, "39"],
    [41.5, 41.0, -120.4375, -120.875, "40"],
    [41.5, 41.0, -119.998056, -120.4375, "41"],
    [41.0, 40.5, -123.945833, -124.391667, "42"],
    [41.0, 40.5, -123.5, -123.945833, "43"],
    [41.0, 40.5, -123.0625, -123.5, "44"],
    [41.0, 40.5, -122.625, -123.0625, "45"],
    [41.0, 40.5, -122.1875, -122.625, "46"],
    [41.0, 40.5, -121.75, -122.1875, "47"],
    [41.0, 40.5, -121.3125, -121.75, "48"],
    [41.0, 40.5, -120.875, -121.3125, "49"],
    [41.0, 40.5, -120.4375, -120.875, "50"],
    [41.0, 40.5, -120.0, -120.4375, "51"],
    [40.5, 40.0, -123.956389, -124.416667, "52"],
    [40.5, 40.0, -123.5, -123.956389, "53"],
    [40.5, 40.0, -123.0625, -123.5, "54"],
    [40.5, 40.0, -122.625, -123.0625, "55"],
    [40.5, 40.0, -122.1875, -122.625, "56"],
    [40.5, 40.0, -121.75, -122.1875, "57"],
    [40.5, 40.0, -121.3125, -121.75, "58"],
    [40.5, 40.0, -120.875, -121.3125, "59"],
    [40.5, 40.0, -120.4375, -120.875, "60"],
    [40.5, 40.0, -119.995278, -120.4375, "61"],
    [40.0, 39.5, -123.9375, -124.375, "62"],
    [40.0, 39.5, -123.5, -123.9375, "63"],
    [40.0, 39.5, -123.0625, -123.5, "64"],
    [40.0, 39.5, -122.625, -123.0625, "65"],
    [40.0, 39.5, -122.1875, -122.625, "66"],
    [40.0, 39.5, -121.75, -122.1875, "67"],
    [40.0, 39.5, -121.3125, -121.75, "68"],
    [40.0, 39.5, -120.875, -121.3125, "69"],
    [40.0, 39.5, -120.4375, -120.875, "70"],
    [40.0, 39.5, -119.996667, -120.4375, "71"],
    [39.0, 38.708889, -123.5, -123.77, "72"],
    [39.5, 39.0, -123.5, -123.9375, "73"],
    [39.5, 39.0, -123.0625, -123.5, "74"],
    [39.5, 39.0, -122.625, -123.0625, "75"],
    [39.5, 39.0, -122.1875, -122.625, "76"],
    [39.5, 39.0, -121.75, -122.1875, "77"],
    [39.5, 39.0, -121.3125, -121.75, "78"],
    [39.5, 39.0, -120.875, -121.3125, "79"],
    [39.5, 39.0, -120.4375, -120.875, "80"],
    [39.5, 39.0, -120.0, -120.4375, "81"],
    [39.0, 38.5, -123.0625, -123.5, "82"],
    [39.0, 38.5, -122.625, -123.0625, "83"],
    [39.0, 38.5, -122.1875, -122.625, "84"],
    [39.0, 38.5, -121.75, -122.1875, "85"],
    [39.0, 38.5, -121.3125, -121.75, "86"],
    [39.0, 38.5, -120.875, -121.3125, "87"],
    [39.0, 38.5, -120.4375, -120.875, "88"],
    [39.0, 38.5, -120.0, -120.4375, "89"],
    [39.0, 38.5, -119.5625, -120.0, "90"],
    [39.0, 38.5, -119.125, -119.5625, "91"],
    [38.5, 38.0, -123.0625, -123.5, "92"],
    [38.5, 38.0, -122.625, -123.0625, "93"],
    [38.5, 38.0, -122.1875, -122.625, "94"],
    [38.5, 38.0, -121.75, -122.1875, "95"],
    [38.5, 38.0, -121.3125, -121.75, "96"],
    [38.5, 38.0, -120.875, -121.3125, "97"],
    [38.5, 38.0, -120.4375, -120.875, "98"],
    [38.5, 38.0, -120.0, -120.4375, "99"],
    [38.5, 38.0, -119.5625, -120.0, "100"],
    [38.5, 38.0, -119.125, -119.5625, "101"],
    [38.441667, 38.0, -118.6875, -119.125, "102"],
    [38.0, 37.5, -122.625, -123.0625, "103"],
    [38.133333, 38.0, -118.483333, -118.6875, "103"],
    [38.0, 37.5, -122.1875, -122.625, "104"],
    [38.0, 37.5, -121.75, -122.1875, "105"],
    [38.0, 37.5, -121.3125, -121.75, "106"],
    [38.0, 37.5, -120.875, -121.3125, "107"],
    [38.0, 37.5, -120.4375, -120.875, "108"],
    [38.0, 37.5, -120.0, -120.4375, "109"],
    [38.0, 37.5, -119.5625, -120.0, "110"],
    [38.0, 37.5, -119.125, -119.5625, "111"],
    [38.0, 37.5, -118.6875, -119.125, "112"],
    [38.0, 37.5, -118.25, -118.6875, "113"],
    [37.5, 37.0, -122.1875, -122.625, "114"],
    [37.796944, 37.5, -117.866667, -118.25, "114"],
    [37.5, 37.0, -121.75, -122.1875, "115"],
    [37.5, 37.0, -121.3125, -121.75, "116"],
    [37.5, 37.0, -120.875, -121.3125, "117"],
    [37.5, 37.0, -120.4375, -120.875, "118"],
    [37.5, 37.0, -120.0, -120.4375, "119"],
    [37.5, 37.0, -119.5625, -120.0, "120"],
    [37.5, 37.0, -119.125, -119.5625, "121"],
    [37.5, 37.0, -118.6875, -119.125, "122"],
    [37.5, 37.0, -118.25, -118.6875, "123"],
    [37.5, 37.0, -117.8125, -118.25, "124"],
    [37.5, 37.0, -117.203889, -117.8125, "125"],

];

// Golden State DeLorme Grid coordinates
//* at start of coords triggers alternate map placement
var GSCoords = [
    [42.008330, 41.366670, -123.850000, -124.433330, "22"],
    [42.008330, 41.366670, -123.266670, -123.850000, "23"],
    [42.008330, 41.366670, -122.683330, -123.266670, "24"],
    [42.008330, 41.366670, -122.100000, -122.683330, "25"],
    [42.008330, 41.366670, -121.516670, -122.100000, "26"],
    [42.008330, 41.366670, -120.933330, -121.516670, "27"],
    [42.008330, 41.366670, -120.350000, -120.933330, "28"],
    [42.008330, 41.366670, -119.766670, -120.350000, "29"],
    [41.366670, 40.725000, -123.850000, -124.433330, "30"],
    [41.366670, 40.725000, -123.266670, -123.850000, "31"],
    [41.366670, 40.725000, -122.683330, -123.266670, "32"],
    [41.366670, 40.725000, -122.100000, -122.683330, "33"],
    [41.366670, 40.725000, -121.516670, -122.100000, "34"],
    [41.366670, 40.725000, -120.933330, -121.516670, "35"],
    [41.366670, 40.725000, -120.350000, -120.933330, "36"],
    [41.366670, 40.725000, -119.766670, -120.350000, "37"],
    [40.725000, 40.083330, -123.850000, -124.433330, "38"],
    [40.725000, 40.083330, -123.266670, -123.850000, "39"],
    [40.725000, 40.083330, -122.683330, -123.266670, "40"],
    [40.725000, 40.083330, -122.100000, -122.683330, "41"],
    [40.725000, 40.083330, -121.516670, -122.100000, "42"],
    [40.725000, 40.083330, -120.933330, -121.516670, "43"],
    [40.725000, 40.083330, -120.350000, -120.933330, "44"],
    [40.725000, 40.083330, -119.766670, -120.350000, "45"],
    [40.083330, 39.441670, -123.850000, -124.433330, "46"],
    [40.083330, 39.441670, -123.266670, -123.850000, "47"],
    [40.083330, 39.441670, -122.683330, -123.266670, "48"],
    [40.083330, 39.441670, -122.100000, -122.683330, "49"],
    [40.083330, 39.441670, -121.516670, -122.100000, "50"],
    [40.083330, 39.441670, -120.933330, -121.516670, "51"],
    [40.083330, 39.441670, -120.350000, -120.933330, "52"],
    [40.083330, 39.441670, -119.766670, -120.350000, "53"],
    [39.441670, 38.800000, -123.266670, -123.850000, "54"],
    [39.441670, 38.800000, -122.683330, -123.266670, "55"],
    [39.441670, 38.800000, -122.100000, -122.683330, "56"],
    [39.441670, 38.800000, -121.516670, -122.100000, "57"],
    [39.441670, 38.800000, -120.933330, -121.516670, "58"],
    [39.441670, 38.800000, -120.350000, -120.933330, "59"],
    [39.441670, 38.800000, -119.766670, -120.350000, "60"],
    [38.800000, 38.158330, -123.266670, -123.850000, "61"],
    [38.800000, 38.158330, -122.683330, -123.266670, "62"],
    [38.800000, 38.158330, -122.100000, -122.683330, "63"],
    [38.800000, 38.158330, -121.516670, -122.100000, "64"],
    [38.800000, 38.158330, -120.933330, -121.516670, "65"],
    [38.800000, 38.158330, -120.350000, -120.933330, "66"],
    [38.800000, 38.158330, -119.766670, -120.350000, "67"],
    [38.800000, 38.158330, -119.183330, -119.766670, "68"],
    [38.800000, 38.158330, -118.600000, -119.183330, "69"],
    [38.891670, 38.800000, -119.650000, -119.766670, "69"],
    [38.158330, 37.516670, -122.683330, -123.266670, "70"],
    [38.158330, 37.516670, -122.100000, -122.683330, "71"],
    [38.158330, 37.516670, -121.516670, -122.100000, "72"],
    [38.158330, 37.516670, -120.933330, -121.516670, "73"],
    [38.158330, 37.516670, -120.350000, -120.933330, "74"],
    [38.158330, 37.516670, -119.766670, -120.350000, "75"],
    [38.158330, 37.516670, -119.183330, -119.766670, "76"],
    [38.158330, 37.516670, -118.600000, -119.183330, "77"],
    [38.158330, 37.516670, -118.016670, -118.600000, "78"],
    [38.158330, 37.516670, -117.433330, -118.016700, "79"],
    [37.516670, 36.875000, -122.100000, -122.683330, "80"],
    [37.516670, 36.875000, -121.516670, -122.100000, "81"],
    [37.516670, 36.875000, -120.933330, -121.516670, "82"],
    [37.516670, 36.875000, -120.350000, -120.933330, "83"],
    [37.516670, 36.875000, -119.766670, -120.350000, "84"],
    [37.516670, 36.875000, -119.183330, -119.766670, "85"],
    [37.516670, 36.875000, -118.600000, -119.183330, "86"],
    [37.516670, 36.875000, -118.016670, -118.600000, "87"],
    [37.516670, 36.875000, -117.433330, -118.016670, "88"],
    [37.516670, 36.875000, -116.850000, -117.433330, "89"],
    [36.875000, 36.233330, -121.516670, -122.100000, "90"],
    [36.875000, 36.233330, -120.933330, -121.516670, "91"],
    [36.875000, 36.233330, -120.350000, -120.933330, "92"],
    [36.875000, 36.233330, -119.766670, -120.350000, "93"],
    [36.875000, 36.233330, -119.183330, -119.766670, "94"],
    [36.875000, 36.233330, -118.600000, -119.183330, "95"],
    [36.875000, 36.233330, -118.016670, -118.600000, "96"],
    [36.875000, 36.233330, -117.433330, -118.016670, "97"],
    [36.875000, 36.233330, -116.850000, -117.433330, "98"],
    [36.875000, 36.233330, -116.266670, -116.850000, "99"],
    [36.325000, 36.233330, -116.150000, -116.266670, "99"],
    [36.233330, 35.591670, -121.516670, -122.100000, "100"],
    [36.233330, 35.591670, -120.933330, -121.516670, "101"],
    [36.233330, 35.591670, -120.350000, -120.933330, "102"],
    [36.233330, 35.591670, -119.766670, -120.350000, "103"],
    [36.233330, 35.591670, -119.183330, -119.766670, "104"],
    [36.233330, 35.591670, -118.600000, -119.183330, "105"],
    [36.233330, 35.591670, -118.016670, -118.600000, "106"],
    [36.233330, 35.591670, -117.433330, -118.016670, "107"],
    [36.233330, 35.591670, -116.850000, -117.433330, "108"],
    [36.233330, 35.591670, -116.266670, -116.850000, "109"],
    [36.233330, 35.591670, -115.683330, -116.266670, "110"],
    [36.233330, 35.591670, -115.100000, -115.683330, "111"],
    [35.591670, 34.950000, -120.933330, -121.516670, "112"],
    [35.591670, 34.950000, -120.350000, -120.933330, "113"],
    [35.591670, 34.950000, -119.766670, -120.350000, "114"],
    [35.591670, 34.950000, -119.183330, -119.766670, "115"],
    [35.591670, 34.950000, -118.600000, -119.183330, "116"],
    [35.591670, 34.950000, -118.016670, -118.600000, "117"],
    [35.591670, 34.950000, -117.433330, -118.016670, "118"],
    [35.591670, 34.950000, -116.850000, -117.433330, "119"],
    [35.591670, 34.950000, -116.266670, -116.850000, "120"],
    [35.591670, 34.950000, -115.683330, -116.266670, "121"],
    [35.591670, 34.950000, -115.100000, -115.683330, "122"],
    [35.591670, 34.950000, -114.516670, -115.100000, "123"],
    [34.950000, 34.308330, -120.350000, -120.933330, "124"],
    [34.950000, 34.308330, -119.766670, -120.350000, "125"],
    [34.950000, 34.308330, -119.183330, -119.766670, "126"],
    [34.950000, 34.308330, -118.600000, -119.183330, "127"],
    [34.950000, 34.308330, -118.016670, -118.600000, "128"],
    [34.950000, 34.308330, -117.433330, -118.016670, "129"],
    [34.950000, 34.308330, -116.850000, -117.433330, "130"],
    [34.950000, 34.308330, -116.266670, -116.850000, "131"],
    [34.950000, 34.308330, -115.683330, -116.266670, "132"],
    [34.950000, 34.308330, -115.100000, -115.683330, "133"],
    [34.950000, 34.308330, -114.516670, -115.100000, "134"],
    [34.950000, 34.308330, -113.933330, -114.516670, "135"],
    [34.308330, 33.941670, -119.183330, -119.766670, "138"],
    [34.308330, 33.941670, -118.600000, -119.183330, "139"],
    [33.525000, 33.250000, -118.283330, -118.633330, "139"],
    [34.308330, 33.666670, -118.016670, -118.600000, "140"],
    [34.308330, 33.666670, -117.433330, -118.016670, "141"],
    [34.308330, 33.666670, -116.850000, -117.433330, "142"],
    [34.308330, 33.666670, -116.266670, -116.850000, "143"],
    [34.308330, 33.666670, -115.683330, -116.266670, "144"],
    [34.308330, 33.666670, -115.100000, -115.683330, "145"],
    [34.308330, 33.666670, -114.516670, -115.100000, "146"],
    [34.308330, 33.666670, -113.933330, -114.516670, "147"],
    [33.666670, 33.025000, -117.433330, -118.016670, "148"],
    [33.666670, 33.025000, -116.850000, -117.433330, "149"],
    [33.666670, 33.025000, -116.266670, -116.850000, "150"],
    [33.666670, 33.025000, -115.683330, -116.266670, "151"],
    [33.666670, 33.025000, -115.100000, -115.683330, "152"],
    [33.666670, 33.025000, -114.516670, -115.100000, "153"],
    [33.025000, 32.383330, -116.850000, -117.433330, "154"],
    [33.025000, 32.383330, -116.266670, -116.850000, "155"],
    [33.025000, 32.383330, -115.683330, -116.266670, "156"],
    [33.025000, 32.383330, -115.100000, -115.683330, "157"],
    [33.025000, 32.383330, -114.516670, -115.100000, "158"],
    [33.025000, 32.383330, -113.933330, -114.516670, "159"]

];

// Southern/Central California DeLorme Grid coordinates"],
var SCalCoords = [
    [37.000000, 36.500000, -121.812500, -122.250000, "18"],
    [37.000000, 36.500000, -121.375000, -121.812500, "19"],
    [37.000000, 36.500000, -120.937500, -121.375000, "20"],
    [37.000000, 36.500000, -120.500000, -120.937500, "21"],
    [37.000000, 36.500000, -120.062500, -120.500000, "22"],
    [37.000000, 36.500000, -119.625000, -120.062500, "23"],
    [37.000000, 36.500000, -119.187500, -119.625000, "24"],
    [37.000000, 36.500000, -118.750000, -119.187500, "25"],
    [37.000000, 36.500000, -118.312500, -118.750000, "26"],
    [37.000000, 36.500000, -117.875000, -118.312500, "27"],
    [37.000000, 36.500000, -117.437500, -117.875000, "28"],
    [37.000000, 36.500000, -117.000000, -117.437500, "29"],
    [36.500000, 36.111110, -121.812500, -122.246110, "30"],
    [36.935280, 36.500000, -116.562500, -117.000000, "30"],
    [36.500000, 36.000000, -121.375000, -121.812500, "31"],
    [36.500000, 36.000000, -120.937500, -121.375000, "32"],
    [36.500000, 36.000000, -120.500000, -120.937500, "33"],
    [36.500000, 36.000000, -120.062500, -120.500000, "34"],
    [36.500000, 36.000000, -119.625000, -120.062500, "35"],
    [36.500000, 36.000000, -119.187500, -119.625000, "36"],
    [36.500000, 36.000000, -118.750000, -119.187500, "37"],
    [36.500000, 36.000000, -118.312500, -118.750000, "38"],
    [36.500000, 36.000000, -117.875000, -118.312500, "39"],
    [36.500000, 36.000000, -117.437500, -117.875000, "40"],
    [36.500000, 36.000000, -117.000000, -117.437500, "41"],
    [36.500000, 36.000000, -116.562500, -117.000000, "42"],
    [36.500000, 36.000000, -116.125000, -116.562500, "43"],
    [36.000000, 35.753330, -121.375000, -121.684720, "43"],
    [36.000000, 35.500000, -120.937500, -121.375000, "44"],
    [36.206670, 36.000000, -115.857500, -116.125000, "44"],
    [36.000000, 35.500000, -120.500000, -120.937500, "45"],
    [36.000000, 35.500000, -120.062500, -120.500000, "46"],
    [36.000000, 35.500000, -119.625000, -120.062500, "47"],
    [36.000000, 35.500000, -119.187500, -119.625000, "48"],
    [36.000000, 35.500000, -118.750000, -119.187500, "49"],
    [36.000000, 35.500000, -118.312500, -118.750000, "50"],
    [36.000000, 35.500000, -117.875000, -118.312500, "51"],
    [36.000000, 35.500000, -117.437500, -117.875000, "52"],
    [36.000000, 35.500000, -117.000000, -117.437500, "53"],
    [36.000000, 35.500000, -116.562500, -117.000000, "54"],
    [36.000000, 35.500000, -116.125000, -116.562500, "55"],
    [36.000000, 35.500000, -115.687500, -116.125000, "56"],
    [36.000000, 35.500000, -115.250000, -115.687500, "57"],
    [35.500000, 35.000000, -120.500000, -120.937500, "59"],
    [35.500000, 35.000000, -120.062500, -120.500000, "60"],
    [35.500000, 35.000000, -119.625000, -120.062500, "61"],
    [35.500000, 35.000000, -119.187500, -119.625000, "62"],
    [35.500000, 35.000000, -118.750000, -119.187500, "63"],
    [35.500000, 35.000000, -118.312500, -118.750000, "64"],
    [35.500000, 35.000000, -117.875000, -118.312500, "65"],
    [35.500000, 35.000000, -117.437500, -117.875000, "66"],
    [35.500000, 35.000000, -117.000000, -117.437500, "67"],
    [35.500000, 35.000000, -116.562500, -117.000000, "68"],
    [35.500000, 35.000000, -116.125000, -116.562500, "69"],
    [35.500000, 35.000000, -115.687500, -116.125000, "70"],
    [35.500000, 35.000000, -115.250000, -115.687500, "71"],
    [35.500000, 35.000000, -114.812500, -115.250000, "72"],
    [35.000000, 34.500000, -120.500000, -120.937500, "73"],
    [35.500000, 35.000000, -114.559170, -114.812500, "73"],
    [35.000000, 34.500000, -120.062500, -120.500000, "74"],
    [35.000000, 34.500000, -119.625000, -120.062500, "75"],
    [35.000000, 34.500000, -119.187500, -119.625000, "76"],
    [35.000000, 34.500000, -118.750000, -119.187500, "77"],
    [35.000000, 34.500000, -118.312500, -118.750000, "78"],
    [35.000000, 34.500000, -117.875000, -118.312500, "79"],
    [35.000000, 34.500000, -117.437500, -117.875000, "80"],
    [35.000000, 34.500000, -117.000000, -117.437500, "81"],
    [35.000000, 34.500000, -116.562500, -117.000000, "82"],
    [35.000000, 34.500000, -116.125000, -116.562500, "83"],
    [35.000000, 34.500000, -115.687500, -116.125000, "84"],
    [35.000000, 34.500000, -115.250000, -115.687500, "85"],
    [35.000000, 34.500000, -114.812500, -115.250000, "86"],
    [35.000000, 34.500000, -114.375000, -114.812500, "87"],
    [34.500000, 34.345000, -120.062500, -120.500000, "88"],
    [34.500000, 34.345000, -119.625000, -120.062500, "89"],
    [34.500000, 34.100000, -119.187500, -119.625000, "90"],
    [34.500000, 34.000000, -118.750000, -119.187500, "91"],
    [34.500000, 34.000000, -118.312500, -118.750000, "92"],
    [34.500000, 34.000000, -117.875000, -118.312500, "93"],
    [34.500000, 34.000000, -117.437500, -117.875000, "94"],
    [34.500000, 34.000000, -117.000000, -117.437500, "95"],
    [34.500000, 34.000000, -116.562500, -117.000000, "96"],
    [34.500000, 34.000000, -116.125000, -116.562500, "97"],
    [34.500000, 34.000000, -115.687500, -116.125000, "98"],
    [34.500000, 34.000000, -115.250000, -115.687500, "99"],
    [34.500000, 34.000000, -114.812500, -115.250000, "100"],
    [34.500000, 34.000000, -114.375000, -114.812500, "101"],
    [34.500000, 34.000000, -114.102220, -114.375000, "102"],
    [34.000000, 33.500000, -118.312500, -118.700000, "102"],
    [34.000000, 33.500000, -117.875000, -118.312500, "103"],
    [34.000000, 33.500000, -117.437500, -117.875000, "104"],
    [34.000000, 33.500000, -117.000000, -117.437500, "105"],
    [34.000000, 33.500000, -116.562500, -117.000000, "106"],
    [34.000000, 33.500000, -116.125000, -116.562500, "107"],
    [34.000000, 33.500000, -115.687500, -116.125000, "108"],
    [34.000000, 33.500000, -115.250000, -115.687500, "109"],
    [34.000000, 33.500000, -114.812500, -115.250000, "110"],
    [34.000000, 33.500000, -114.375000, -114.812500, "111"],
    [33.500000, 33.200000, -117.437500, -118.650000, "112"],
    [33.500000, 33.000000, -117.000000, -117.437500, "113"],
    [33.500000, 33.000000, -116.562500, -117.000000, "114"],
    [33.500000, 33.000000, -116.125000, -116.562500, "115"],
    [33.500000, 33.000000, -115.687500, -116.125000, "116"],
    [33.500000, 33.000000, -115.250000, -115.687500, "117"],
    [33.500000, 33.000000, -114.812500, -115.250000, "118"],
    [33.500000, 33.000000, -114.375000, -114.812500, "119"],
    [33.000000, 32.500000, -117.000000, -117.437500, "121"],
    [33.000000, 32.500000, -116.562500, -117.000000, "122"],
    [33.000000, 32.500000, -116.125000, -116.562500, "123"],
    [33.000000, 32.500000, -115.687500, -116.125000, "124"],
    [33.000000, 32.500000, -115.250000, -115.687500, "125"],
    [33.000000, 32.500000, -114.812500, -115.250000, "126"],
    [33.000000, 32.500000, -114.375000, -114.812500, "127"],
    [35.500000, 35.000000, -120.937500, -121.375000, "58"]

];

function wait4containers() {
    let mapNode = document.querySelector("div.map-container, .leaflet-container");
    if (mapNode == null) {
        // the node doesn't exist yet, wait and try again
        window.setTimeout(wait4containers, 300);
        return;
    }

this.$ = this.jQuery = jQuery.noConflict(true);
let _dgPage = "unknown";
let _gridLayer = [];
let _pagenumberLayer = [];
let _initialized = false;
let _pageNumbersShown = false;
let _dgWhichGrid = NCalCoords;
let _dgNorCalGridColor = "#ad1457";
let _dgSCalGridColor = "#1b5e20";
let _dgGSGridColor = "#01579b";
let _dgGridColor = _dgNorCalGridColor;
console.log("Starting Delorme Grid " + GM_info.script.version);
$("#gc-header, #GCHeader").show();
let pathname = window.location.pathname;
let domain = document.domain;

if (domain === "www.geocaching.com") {
    if (pathname.indexOf("/play/map") > -1) _dgPage = "gc_map_new";
    else if (pathname.indexOf("/map/") > -1) _dgPage = "gc_map";
}

console.log("Running in " + _dgPage + " mode");

if (_dgPage === "gc_map_new") {
    var checkExist = setInterval(function() {
        if ($('.mapboxgl-canvas').length) {
            console.log("Exists!");
            clearInterval(checkExist);
        }
    }, 100); // check every 100ms
   if (unsafeWindow.cacheturGCMap) {
        console.log("CALIF GRID was BEAT TO MAP BY CTA. Use it");
        unsafeWindow.delormeGCMap = unsafeWindow.cacheturGCMap;
    } else if (unsafeWindow.gcMap) { // If anyone has set the object in a shared place, use it
        console.log("CA Grid sees MAP from other extension/ Use it.");
        unsafeWindow.delormeGCMap = unsafeWindow.gcMap;
    } else {
        console.log("DeLorme Doing dirty trick to take over Geocaching.com's leaflet object");
        let originalLMap = L.Map;
        L.Map = function(div, settings) {
            unsafeWindow.delormeGCMap = new originalLMap(div, settings);
            L.Map = originalLMap;
            return unsafeWindow.delormeGCMap;
        };
    }

$(document).ready(function() {
    ctInit();
});

}
else if (_dgPage === "gc_map") {
	$(document).ready(function() {
	    ctInit();
	});
}

function ctInit() {
    if (_initialized) return;
    console.log("Initializing Delorme Grid");
    ctCreateTripList();
    _initialized = true;
}

function ctDrawGrid() {
    GM_addStyle(".map-label { position: absolute; bottom: 0;left: -50%; display: flex; flex-direction: column; text-align: center; ");
    GM_addStyle(".map-label-content { order: 1; position: relative; left: -50%; background-color: #fff; border-radius: 5px; border-width: 2px; border-style: solid; border-color: #f00; padding: 3px; white-space: nowrap;");

    let markers = [];
    let numbers = [];
    let unsafeLeafletObject = ctGetUnsafeLeafletObject();
    if (unsafeWindow.delormeGridLayer) {
        unsafeLeafletObject.removeLayer(unsafeWindow.delormeGridLayer);
    }
    if (unsafeWindow.delormePageNumberLayer) {
        unsafeLeafletObject.removeLayer(unsafeWindow.delormePageNumberLayer);
    }

    let grid = [];
    for (var i = 0; i < _dgWhichGrid.length; i++) {
        var latline = _dgWhichGrid[i];
        var lat1 = parseFloat(latline[0]);
        var lat2 = parseFloat(latline[1]);
        var lng1 = parseFloat(latline[2]);
        var lng2 = parseFloat(latline[3]);
        var bounds = [
            [lat1, lng1],
            [lat2, lng2]
        ];
        var rect = L.rectangle(bounds, {
            color: _dgGridColor,
            fill: false,
            weight: 1
        });
        var icon = L.divIcon({
            iconSize: null,
            html: '<div class="map-label"><div class="map-label-content">' + latline[4] + '</div></div>'
        });
        if (latline[4]) {
            var pageNumber = L.marker([lat2 + .15, lng2 + .15], {
                icon: icon
            });
            numbers.push(pageNumber);
        }
        grid.push(rect);
    }

    _gridLayer = L.layerGroup(grid);
    unsafeWindow.delormeGridLayer = cloneInto(_gridLayer, unsafeWindow);

    console.log("Injecting grid");
    unsafeLeafletObject.addLayer(unsafeWindow.delormeGridLayer);

    // Prepare page number layer. Show on toggle of NC/SC/GS label.
    _pagenumberLayer = L.layerGroup(numbers);
    unsafeWindow.delormePageNumberLayer = cloneInto(_pagenumberLayer, unsafeWindow);

}

function ctPrependToHeader(data) {
    console.log("Injecting icon in menu");
    let header;
    if (_dgPage === "gc_map_new") header = $('.user-menu,.profile-panel');
    else if (_dgPage === "gc_map") header = $('.user-menu');
    console.log(header);

    if (header) {
        header.prepend(data);
    }
}

function ctCreateTripList() {

    setTimeout(function() {
        // 32px tall
        var califImg = '&nbsp;<span id="whichGrid" title="Toggle page numbers on/off">NC</span><div id="califIcon" title="Switch NC/SC/GS grids"><img src="data:image/png;base64,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" alt="" /></div>';
        ctPrependToHeader('<li style="cursor: pointer" title="NC/GS switch">' + califImg + '</li>');
        ctDrawGrid(_dgWhichGrid);

        // Swap Norcal and Golden State Grids and SoCal
        $("#califIcon").click(function() {
            let unsafeLeafletObject = ctGetUnsafeLeafletObject();
            if (unsafeWindow.delormeGridLayer) {
                unsafeLeafletObject.removeLayer(unsafeWindow.delormeGridLayer);
            }
            if (unsafeWindow.delormePageNumberLayer) {
                unsafeLeafletObject.removeLayer(unsafeWindow.delormePageNumberLayer);
                _pageNumbersShown = false;
            }
            if (_dgWhichGrid === NCalCoords) { //N -> S
                _dgWhichGrid = SCalCoords;
                _dgGridColor = _dgSCalGridColor;
                document.getElementById("whichGrid").innerText = "SC";
            } else if (_dgWhichGrid === SCalCoords) { //S ->GS
                _dgWhichGrid = GSCoords;
                _dgGridColor = _dgGSGridColor;
                document.getElementById("whichGrid").innerText = "GS";
            } else if (_dgWhichGrid === GSCoords) { //GS -> N
                _dgWhichGrid = NCalCoords;
                _dgGridColor = _dgNorCalGridColor;
                document.getElementById("whichGrid").innerText = "NC";
            }
            ctDrawGrid(_dgWhichGrid);

        });

        // Toggle page numbers on and off
        $("#whichGrid").click(function() {
            let unsafeLeafletObject = ctGetUnsafeLeafletObject();
            if (_pageNumbersShown) {
                _pageNumbersShown = false;
                if (unsafeWindow.delormePageNumberLayer) {
                    unsafeLeafletObject.removeLayer(unsafeWindow.delormePageNumberLayer);
                }
            } else {
                _pageNumbersShown = true;
                console.log("showing delorme page numbers");
                unsafeLeafletObject.addLayer(unsafeWindow.delormePageNumberLayer);
            }

        });

    }, 1500);
}

function ctGetUnsafeLeafletObject() {
    if (_dgPage === "gc_map" && unsafeWindow.MapSettings) return unsafeWindow.MapSettings.Map;
    else if (_dgPage === "gc_map_new" && unsafeWindow.delormeGCMap) return unsafeWindow.delormeGCMap;
    else {
        return null;
    }
}
}
wait4containers();
