sap.ui.define(
    [
        "com/moyo/demo/caplugins/controller/BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/m/MessageBox"
    ],
    function (BaseController, Filter, FilterOperator, JSONModel, MessageToast, MessageBox) {
        "use strict";

        return BaseController.extend("com.moyo.demo.caplugins.controller.Home", {
            onInit: function () {
                this.getView().getBindingContext(); // Trigger context calculation
                this.getView().attachModelContextChange(this._loadStats, this);
            },

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

            onFilterChange: function () {
                const sType = this.byId("selectCarType").getSelectedKey();
                const sLocation = this.byId("inputLocation").getValue();
                const aFilters = [];

                if (sType) {
                    aFilters.push(new Filter("description", FilterOperator.Contains, sType));
                }

                if (sLocation) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter("description", FilterOperator.Contains, sLocation),
                            new Filter("brand", FilterOperator.Contains, sLocation),
                            new Filter("model", FilterOperator.Contains, sLocation)
                        ],
                        and: false
                    }));
                }

                this.byId("featuredCarsList").getBinding("items").filter(aFilters);
            },

            _loadStats: function () {
                const oModel = this.getModel();
                if (!oModel || this._bStatsLoaded) {
                    return;
                }
                this._bStatsLoaded = true;

                const oStatsModel = new JSONModel({
                    fleetSize: 0,
                    availableCars: 0,
                    rentedCars: 0
                });
                this.getView().setModel(oStatsModel, "stats");

                // Total Fleet
                const oTotalBinding = oModel.bindList("/Cars", null, null, null, { "$count": true });
                oTotalBinding.requestContexts(0, 1).then(function () {
                    oStatsModel.setProperty("/fleetSize", oTotalBinding.getCount());
                });

                // Available Cars
                const oAvailableBinding = oModel.bindList("/Cars", null, null, [new Filter("status", FilterOperator.EQ, "Available")], { "$count": true });
                oAvailableBinding.requestContexts(0, 1).then(function () {
                    oStatsModel.setProperty("/availableCars", oAvailableBinding.getCount());
                });

                // Rented Cars
                const oRentedBinding = oModel.bindList("/Cars", null, null, [new Filter("status", FilterOperator.EQ, "Rented")], { "$count": true });
                oRentedBinding.requestContexts(0, 1).then(function () {
                    oStatsModel.setProperty("/rentedCars", oRentedBinding.getCount());
                });
            },

            onRentNow: function (oEvent) {
                const oSource = oEvent.getSource();
                const oContext = oSource.getBindingContext();
                const sCarID = oContext.getProperty("ID");
                const sBrand = oContext.getProperty("brand");
                const sModel = oContext.getProperty("model");
                const sStatus = oContext.getProperty("status");

                if (sStatus !== "Available") {
                    MessageToast.show("This car is already rented.");
                    return;
                }

                const oModel = this.getModel();

                MessageBox.confirm(
                    "Are you sure you want to rent the " + sBrand + " " + sModel + "?",
                    {
                        title: "Confirm Rental",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (sAction) {
                            if (sAction === MessageBox.Action.YES) {
                                oSource.setBusy(true);

                                const oAction = oModel.bindContext("/rentCar(...)");
                                oAction.setParameter("carID", sCarID);

                                oAction.execute().then(
                                    function () {
                                        oSource.setBusy(false);
                                        MessageToast.show(sBrand + " " + sModel + " rented successfully!");
                                        oModel.refresh();
                                    },
                                    function (oError) {
                                        oSource.setBusy(false);
                                        MessageToast.show("Error: " + oError.getMessage());
                                    }
                                );
                            }
                        }
                    }
                );
            }
        });
    }
);