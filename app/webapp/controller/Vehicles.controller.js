sap.ui.define(
    [
        "com/moyo/demo/caplugins/controller/BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast"
    ],
    function (BaseController, Filter, FilterOperator, MessageToast) {
        "use strict";

        return BaseController.extend("com.moyo.demo.caplugins.controller.Vehicles", {
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
                        // Refresh the whole model so Home and Vehicles both update
                        oModel.refresh();
                    }.bind(this),
                    function (oError) {
                        oSource.setBusy(false);
                        MessageToast.show("Error: " + oError.getMessage());
                    }.bind(this)
                );
            },

            onSearch: function (oEvent) {
                const sQuery = oEvent.getParameter("query");
                const aFilters = [];
                if (sQuery) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter("brand", FilterOperator.Contains, sQuery),
                            new Filter("model", FilterOperator.Contains, sQuery)
                        ],
                        and: false
                    }));
                }
                this.byId("vehiclesGrid").getBinding("items").filter(aFilters);
            },

            onFilterType: function (oEvent) {
                const sKey = oEvent.getParameter("item").getKey();
                const aFilters = [];
                if (sKey !== "all") {
                    aFilters.push(new Filter("model", FilterOperator.Contains, sKey));
                }
                this.byId("vehiclesGrid").getBinding("items").filter(aFilters);
            }
        });
    }
);