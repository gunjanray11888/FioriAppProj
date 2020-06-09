sap.ui.define([
	"./BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("gj.api.test.APITestProj.controller.CreateView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gj.api.test.APITestProj.view.CreateView
		 */
		onInit: function () {

		},
        onCreSave : function () {
        	MessageBox.information("You've pressed the SAVE button",{
				icon: "sap-icon://paper-plane",
				title: "Wohh!! You've saved the data"});
        },
        
        onCreCancel : function () {
        	var that = this;
        	MessageBox.information("You've pressed the CANCEL button",{
				icon: "sap-icon://message-error",
				title: "Cancelling the product creation process",
        		onClose: function() {
        		         that.getRouter().navTo("worklist");
        		}
        	});
        }
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gj.api.test.APITestProj.view.CreateView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gj.api.test.APITestProj.view.CreateView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gj.api.test.APITestProj.view.CreateView
		 */
		//	onExit: function() {
		//
		//	}

	});

});