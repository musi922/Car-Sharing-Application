sap.ui.define(
    [
        "com/moyo/demo/caplugins/controller/BaseController"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.moyo.demo.caplugins.controller.Home", {
            onInit: function () {
            },

            onNavHome: function () {
                this.getRouter().navTo("Home");
            },

            onNavVehicles: function () {
                this.getRouter().navTo("Vehicles");
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
