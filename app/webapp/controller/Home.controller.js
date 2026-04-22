sap.ui.define(
    [
        "com/moyo/demo/caplugins/controller/BaseController",
        "sap/m/MessageToast",
        "sap/m/MessageBox"
    ],
    function (BaseController, MessageToast, MessageBox) {
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