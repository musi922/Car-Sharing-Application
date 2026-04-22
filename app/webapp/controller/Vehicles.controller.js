sap.ui.define(
    [
        "com/moyo/demo/caplugins/controller/BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    function (BaseController, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("com.moyo.demo.caplugins.controller.Vehicles", {
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
                const oList = this.byId("vehiclesGrid");
                oList.getBinding("items").filter(aFilters);
            },

            onFilterType: function (oEvent) {
                const sKey = oEvent.getParameter("item").getKey();
                const aFilters = [];
                if (sKey !== "all") {
                    aFilters.push(new Filter("model", FilterOperator.Contains, sKey)); 
                }
                const oList = this.byId("vehiclesGrid");
                oList.getBinding("items").filter(aFilters);
            }
        });
    }
);
