/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"gj/api/test/APITestProj/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});