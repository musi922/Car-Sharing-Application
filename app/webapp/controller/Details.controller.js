sap.ui.define(
    [
        "com/moyo/demo/caplugins/controller/BaseController",
        "sap/m/MessageToast"
    ],
    function (BaseController, MessageToast) {
        "use strict";

        return BaseController.extend("com.moyo.demo.caplugins.controller.Details", {
            onInit: function () {
                this.getRouter().getRoute("Details").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                this.getView().bindElement({
                    path: "/Cars(" + oEvent.getParameter("arguments").carID + ")",
                    events: {
                        dataRequested: function () {
                            this.getView().setBusy(true);
                        }.bind(this),
                        dataReceived: function () {
                            this.getView().setBusy(false);
                        }.bind(this)
                    }
                });
            },

            onNavHome: function () {
                this.getRouter().navTo("Home");
            },

            onNavVehicles: function () {
                this.getRouter().navTo("Vehicles");
            },

            onRentPress: function () {
                const oView = this.getView();
                const oContext = oView.getBindingContext();
                const sCarID = oContext.getProperty("ID");
                const oModel = this.getModel();

                oView.setBusy(true);

                const oAction = oModel.bindContext("/rentCar(...)");
                oAction.setParameter("carID", sCarID);

                oAction.execute().then(
                    function () {
                        oView.setBusy(false);
                        MessageToast.show("Car rented successfully!");
                        oContext.refresh();
                    }.bind(this),
                    function (oError) {
                        oView.setBusy(false);
                        MessageToast.show("Error renting car: " + oError.getMessage());
                    }.bind(this)
                );
            },

            onTilePress: function (oEvent) {
                const sTitle = oEvent.getSource().getHeader();
                MessageToast.show("Technical specification: " + sTitle);
            },

            onViewDetails: function (oEvent) {
                const oCarID = oEvent.getSource().getBindingContext().getProperty("ID");
                this.getRouter().navTo("Details", {
                    carID: oCarID
                });
            }
        });
    }
);
