sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("gj.api.test.APITestProj.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				}
			);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress : function () {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object:{
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},


		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			if ( sObjectId !== 'Create' ) {
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("A_Product", {
					Product :  sObjectId
				});
				this._bindView("/" + sObjectPath);
				this._bindAssociationPlant(sObjectId, this);
				this._bindAssociationSales(sObjectId, this);
				this._bindAssociationProductDesc(sObjectId, this);
			}.bind(this));
			}
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
        // read associated property from oData model 
        _bindAssociationPlant : function(sObjId){
        var oViewModel = this.getModel("objectView");
        var oDataModel = this.getModel();
        var that = this;
        var lv_asso_url = "/A_Product('"+sObjId+"')/to_Plant";
  //      var lv_asso_url = "/A_Product('"+sObjId+"')";
  //      debugger;
  //      this.getView().byId("SimpleFormDisplayITab1").bindElement({
  //      	 path: lv_asso_url,
  //      	 model: "plantData",
  //      	 parameters: {
  //      	 	"expand": "/to_Plant"
  //      	 },
  //      // react on binding events here
		// 	    events: {
		// 	    change: function (oEv) { },
		// 	    dataRequested: function (oEv) {
		// 	    	debugger; },
		// 	    dataReceived: function (oEv) {
		// 	    	debugger;
		// 	    }
  //}
  //      });
          oViewModel.setProperty("/busy", true);
          oDataModel.read(lv_asso_url, {
            success: function(oData, oResponse){
           	var plantJsonModel = new JSONModel();
           	plantJsonModel.setData(oData.results[0]);
           	that.setModel(plantJsonModel, "plantModel");
           	oViewModel.setProperty("/busy", false);
         //  	// that.getView().byId("PlantTextITab1").setText(plantJson.oData.Plant);
         //  	// that.getView().byId("ProfitCenterITab1").setText(plantJson.oData.ProfitCenter);
         //  	// that.getView().byId("MaintStatITab1").setText(plantJson.oData.MaintenanceStatusName);
         //  	// that.getView().byId("PurchasingGroupITab1").setText(plantJson.oData.PurchasingGroup);
         },
           error: function(oError){
           oViewModel.setProperty("/busy", false);
          }
          });
        },
        _bindAssociationSales : function(sObjId) {
        var oViewModel = this.getModel("objectView");
        var oDataModel = this.getModel();
        var that = this;
        var lv_asso_url = "/A_Product('"+sObjId+"')/to_ProductSales";
        oViewModel.setProperty("/busy", true);
          oDataModel.read(lv_asso_url, {
            success: function(oData, oResponse){
           	var pSalesJsonModel = new JSONModel();
           	pSalesJsonModel.setData(oResponse.data);
           	that.setModel(pSalesJsonModel, "SalesModel");
           	oViewModel.setProperty("/busy", false);
         },
           error: function(oError){
           oViewModel.setProperty("/busy", false);
          }
          });
        },
        _bindAssociationProductDesc : function(sObjId) {
        var oViewModel = this.getModel("objectView");
        var oDataModel = this.getModel();
        var that = this;
        var lv_asso_url = "/A_Product('"+sObjId+"')/to_Description";
        oViewModel.setProperty("/busy", true);
          oDataModel.read(lv_asso_url, {
            success: function(oData, oResponse){
           	var pDescJsonModel = new JSONModel();
           	pDescJsonModel.setData(oResponse.data);
           	that.setModel(pDescJsonModel, "prodDesc");
           	oViewModel.setProperty("/busy", false);
         },
           error: function(oError){
           oViewModel.setProperty("/busy", false);
          }
          });	
        },
		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Product,
				sObjectName = oObject.Product;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#APIIntegrationTest-display&/A_Product/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
			oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
			oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

	});

});