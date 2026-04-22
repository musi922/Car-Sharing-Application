sap.ui.define(
    [
        "com/moyo/demo/caplugins/controller/BaseController",
        "sap/m/MessageToast",
        "sap/m/MessageBox"
    ],
    function (BaseController, MessageToast, MessageBox) {
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
                const sBrand = oContext.getProperty("brand");
                const sModel = oContext.getProperty("model");
                const oModel = this.getModel();

                MessageBox.confirm(
                    "Are you sure you want to rent the " + sBrand + " " + sModel + "?",
                    {
                        title: "Confirm Rental",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (sAction) {
                            if (sAction === MessageBox.Action.YES) {
                                oView.setBusy(true);

                                const oAction = oModel.bindContext("/rentCar(...)");
                                oAction.setParameter("carID", sCarID);

                                oAction.execute().then(
                                    function () {
                                        oView.setBusy(false);
                                        MessageToast.show(sBrand + " " + sModel + " rented successfully!");
                                        oContext.refresh();
                                    },
                                    function (oError) {
                                        oView.setBusy(false);
                                        MessageToast.show("Error: " + oError.getMessage());
                                    }
                                );
                            }
                        }
                    }
                );
            },

            onTilePress: function (oEvent) {
                MessageToast.show("Technical specification: " + oEvent.getSource().getHeader());
            },

            onViewDetails: function (oEvent) {
                const oCarID = oEvent.getSource().getBindingContext().getProperty("ID");
                this.getRouter().navTo("Details", { carID: oCarID });
            }
        });
    }
);