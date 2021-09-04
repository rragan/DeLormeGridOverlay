// ==UserScript==
/* globals jQuery, $, L, waitForKeyElements, cloneInto */
// @name            Delorme Grid Generic State Overlay
// @author          rragan (derived from cachetur Assistant code)
// @version         1.0.0.2
// @description     Companion script for geocaching.com
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
// @connect         rragan.atwebpages.com
// @connect         raw.githubusercontent.com
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
// @updateURL       https://github.com/rragan/DeLormeGridOverlay/raw/main/multiState.meta.js
// @downloadURL     https://github.com/rragan/DeLormeGridOverlay/raw/main/multiState.user.js
// ==/UserScript==
function wait4containers() {
    let mapNode = document.querySelector("div.map-container, .leaflet-container");
    if (mapNode == null) {
        // the node doesn't exist yet, wait and try again
        window.setTimeout(wait4containers, 300);
        return;
    }

    //Handy tool to convert GSAK data to JSON grid form: https://www.convertcsv.com/csv-to-json.htm Use CSV to JSON array

    // Generic State DeLorme Grid coordinates
    this.$ = this.jQuery = jQuery.noConflict(true);
    let _dgPage = "unknown";
    let _gridLayer = [];
    let _pagenumberLayer = [];
    let _initialized = false;
    let _pageNumbersShown = false;
    let _dgGridColor = "#CC00FF";
    let _dgWhichGrid = "";
    let _stateCode = "";
    let _newView = "";
    let _changedState;
    let options = '<option value="XX">Pick State</option>';
    // # Sign icon
    let numberImg = '<img id="stateIcon" style="cursor: pointer" src="data:image/png;base64,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" alt="" />';

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
        console.log("Doing dirty trick to take over Geocaching.com's leaflet object");
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

    // Init the menu and data needed
    function ctInit() {
        console.log("Initializing Delorme Grid");
        // Build state list menu
        dgDataCall("stateCodesList", function(data) {
            var codes = data.list;
            let storedState = GM_getValue("dg_selected_state", 0);
            var selected = "";
            var opt = "";
            if (data.list.length > 0) {
                codes.forEach(function(item) {
                    if (storedState === item.code) {
                        opt = '<option value="' + item.code + '" selected>' + item.name + '</option>';
                    } else {
                        opt = '<option value="' + item.code + '">' + item.name + '</option>';
                    }
                    options = options + opt;
                });
            }
            if (!_initialized) {
                ctPrependToHeader('<li>DeLorme Grid&nbsp;<select id="stateSelect">' + options + '</select>' + numberImg + '</li>');
            }

            dgDataCall(storedState, function(data) {
                    let unsafeLeafletObject = ctGetUnsafeLeafletObject();
                    if (!data.grid) {
                        alert("No grid data available");
                    } else {
                        _dgWhichGrid = data.grid;
                        _stateCode = data.state;
                        dgCreateGrid();
                        _initialized = true;
                    }
                }

            );
        });
    };

    function ctDrawGrid() {
        GM_addStyle(".map-label { position: absolute; bottom: 0;left: -50%; display: flex; flex-direction: column; text-align: center; ");
        GM_addStyle(".map-label-content { order: 1; position: relative; left: -50%; background-color: #fff; border-radius: 5px; border-width: 2px; border-style: solid; border-color: #f00; padding: 3px; white-space: nowrap;");

        let markers = [];
        let numbers = [];
        let unsafeLeafletObject = ctGetUnsafeLeafletObject();
        clearLayers();
        let firstLatLon = true;
        let newView;

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
            // capture first lat/lon for shifting map view
            if (firstLatLon) {
                newView = new L.LatLng(lat1, lng1);
                firstLatLon = false;
            }
            var rect = L.rectangle(bounds, {
                color: _dgGridColor,
                fill: false,
                weight: 1
            });
            var pageText = latline[4];
            pageText = pageText.replace(/page /i, "");
            var icon = L.divIcon({
                iconSize: null,
                html: '<div class="map-label"><div class="map-label-content">' + pageText + '</div></div>'
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
        if(_changedState) {
            unsafeLeafletObject.flyTo(newView, 6);
            _changedState = false;
         }

        // Prepare page number layer.
        _pagenumberLayer = L.layerGroup(numbers);
        unsafeWindow.delormePageNumberLayer = cloneInto(_pagenumberLayer, unsafeWindow);
    }

    function clearLayers() {
        let unsafeLeafletObject = ctGetUnsafeLeafletObject();
        if (unsafeWindow.delormeGridLayer) {
            unsafeLeafletObject.removeLayer(unsafeWindow.delormeGridLayer);
        }
        if (unsafeWindow.delormePageNumberLayer) {
            unsafeLeafletObject.removeLayer(unsafeWindow.delormePageNumberLayer);
        }
        _pageNumbersShown = false;
    }

    function ctPrependToHeader(data) {
        console.log("Injecting icon in menu");

        let header;
        if (_dgPage === "gc_map_new") header = $('.user-menu,.profile-panel');
        else if (_dgPage === "gc_map") header = $('.user-menu');

        if (header) {
            header.prepend(data);
        }

        // Toggle page numbers on and off
        $("#stateIcon").click(function() {
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
        $("#stateSelect").change(function() {
            let unsafeLeafletObject = ctGetUnsafeLeafletObject();
            let id = $("#stateSelect").val();
            if (id !== "XX") {
                GM_setValue("dg_selected_state", id);
                _changedState = true;
                _initialized = true;
                clearLayers();
                ctInit();
            } else {
                GM_setValue("dg_selected_state", "");
            }
        });
    }

    function dgCreateGrid() {
        setTimeout(function() {
            ctDrawGrid(_dgWhichGrid);
        }, 1500);
    }


    function ctGetUnsafeLeafletObject() {
        if (_dgPage === "gc_map" && unsafeWindow.MapSettings) return unsafeWindow.MapSettings.Map;
        else if (_dgPage === "gc_map_new" && unsafeWindow.delormeGCMap) return unsafeWindow.delormeGCMap;
        else {
            return null;
        }
    }

    // Call for DG data load
    function dgDataCall(param, callback) {
        let appId = "DGOverlay " + GM_info.script.version + " - ";
        var url = "https://raw.githubusercontent.com/rragan/DeLormeGridOverlay/main/gridData/" + param + ".json";
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(data) {
                try {

                    let response = $.parseJSON(data.responseText);
                    if (typeof(response.error) === "undefined") {
                        callback(response);
                    } else {
                        callback("");
                    }
                } catch (e) {
                    console.warn("Failed to verify response: " + e);
                    callback("");
                }
            },
            onerror: function() {
                callback("");
            },
            ontimeout: function() {
                callback("");
            }
        });
    }
}
wait4containers();
