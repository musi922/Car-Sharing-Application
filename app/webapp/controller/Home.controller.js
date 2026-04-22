sap.ui.define(
    [
        "com/moyo/demo/caplugins/controller/BaseController",
        "sap/m/MessageToast"
    ],
    function (BaseController, MessageToast) {
        "use strict";

        return BaseController.extend("com.moyo.demo.caplugins.controller.Home", {
            onInit: function () {},

            onNavHome: function () {
                this.getRouter().navTo("Home");
            },

            onNavVehicles: function () {
                this.getRouter().navTo("Vehicles");
            },

            onViewDetails: function (oEvent) {
                const oCarID = oEvent.getSource().getBindingContext().getProperty("ID");
                this.getRouter().navTo("Details", { carID: oCarID });
            },

            onRentNow: function (oEvent) {
                const oSource = oEvent.getSource();
                const oContext = oSource.getBindingContext();
                const sCarID = oContext.getProperty("ID");
                const oModel = this.getModel();

                oSource.setBusy(true);

                const oAction = oModel.bindContext("/rentCar(...)");
                oAction.setParameter("carID", sCarID);

                oAction.execute().then(
                    function () {
                        oSource.setBusy(false);
                        MessageToast.show("Car rented successfully!");
                        // Refresh the whole /Cars list so status updates everywhere
                        oModel.refresh();
                    }.bind(this),
                    function (oError) {
                        oSource.setBusy(false);
                        MessageToast.show("Error: " + oError.getMessage());
                    }.bind(this)
                );
            }
        });
    }
);