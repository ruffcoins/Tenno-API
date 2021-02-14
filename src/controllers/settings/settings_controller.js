const db = require('../../db/sequilize');
const Sequelize = require('sequelize');
const Settings = db.settings;
const { errorResponse, successResponse } = require('../../utils/responses');

class SettingsController{

    static async createOrganization(req, res) {
        try {
            const organizationInformation = await Settings.create({
                organization_name: req.body.organization_name,
                address: req.body.address
            });
            return successResponse(true, organizationInformation, null, res);
        }catch (err) {
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res
            );
        }
    }

    static async showOrganization(req, res){

        await Settings.findOne({
            where: {
                id: req.params.id
            },
            
        }).then(settings => {
            if (settings === null) {
                return successResponse(false, 'Organization does not exist', null, res);
            }else {
                return successResponse(true, settings, null, res);
            }            
        }).catch(err => {
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res

            );
        });
    }

    static async updateOrganization(req, res) {

        try {
            const organizationInformation = await Settings.update({
                organization_name: req.body.organization_name,
                address: req.body.address
                },
                { where: { id: req.params.id } }
            );
            
            if (!organizationInformation) {
                return successResponse(false, 'Organization does not exist', null, res);
            } else {
                return successResponse(true, 'Organization information updated successfully', null, res);
            }
        }catch (err) {
            return errorResponse(
                false,
                'Something went wrong',
                err.toString(),
                500,
                res
            );
        }
    }
}

module.exports = {
    createOrganization: SettingsController.createOrganization,
    updateOrganization: SettingsController.updateOrganization,
    showOrganization: SettingsController.showOrganization
};