from flask import Blueprint, request
from app.models import User, ForwardingSettings, ThirdPartyIntegration
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from app import db
from app.tasks import tasks
import json

fs_controller = Blueprint("fs_controller", __name__)


@fs_controller.route('/', methods=['POST'])
def create_new_forwarding_settings():
    """
    Create a new forwarding_settings

    :return: JSON of new forwarding_settings if successful, error response if not
    """
    try:
        data = request.json
        valid_apps = set(item.value for item in ThirdPartyIntegration)
        forwarding_app = int(data['forwarding_app'])
        print(forwarding_app)
        print(valid_apps)
        print(forwarding_app in valid_apps)
        print(forwarding_app == ThirdPartyIntegration.DEFAULT.value)
        # not a valid app or the default app
        if (forwarding_app not in valid_apps) or forwarding_app == ThirdPartyIntegration.DEFAULT.value:
            return APIResponseBuilder.failure({
                "invalid_id": f"Not a valid forwarding app for value of {forwarding_app}"
            })

        # make sure only one forwarding setting per third party integration exists for the user
        #ForwardingSettings.query.

        forwarding_settings = ForwardingSettings(
            user_id=data["user_id"],
            forwarding_app=forwarding_app,
            api_key=data["api_key"],
            default_forwarding_url=data['default_forwarding_url'],

        )
        db.session.add(forwarding_settings)

        # update the default integration
        user = User.query.filter_by(uuid=forwarding_settings.user_id).first()
        user.default_integration = forwarding_settings.forwarding_app
        db.session.commit()
        return APIResponseBuilder.success({
            "forwarding_settings": forwarding_settings
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@fs_controller.route('/<forwarding_settings_id>', methods=['POST'])
def update_forwarding_settings(forwarding_settings_id):
    """
    Update a forwarding_settings represented by forwarding_settings_id.
    Attributes that can change:
    api_key: the api key for authorization to third party integration
    default_forwarding_url: the forwarding url to use for all links

    :param forwarding_settings_id: ID of the forwarding_settings to be updated
    :return: JSON response with the updated forwarding_settings entity
    """
    try:
        data = request.json
        forwarding_settings = ForwardingSettings.query.get(forwarding_settings_id)
        if forwarding_settings:
            forwarding_settings.api_key = data['api_key']
            forwarding_settings.default_forwarding_url = data['default_forwarding_url']

            new_fs = ForwardingSettings(
                user_id=forwarding_settings.user_id,
                forwarding_app=forwarding_settings.forwarding_app,
                api_key=data["api_key"],
                default_forwarding_url=data['default_forwarding_url'],

            )
            ForwardingSettings.query.filter_by(id=forwarding_settings_id).delete()
            db.session.add(new_fs)

            # update the default integration
            user = User.query.filter_by(uuid=forwarding_settings.user_id).first()
            user.default_integration = forwarding_settings.forwarding_app
            db.session.commit()
            return APIResponseBuilder.success({
                "forwarding_settings": new_fs
            })
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find forwarding_settings with ID of {forwarding_settings_id}"
            })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@fs_controller.route("/<forwarding_settings_id>", methods=["DELETE"])
def delete_forwarding_settings(forwarding_settings_id):
    """
    Delete a forwarding_settings with id forwarding_settings_id
    :param forwarding_settings_id:
    :return: JSON boolean representing whether the user was successfully create
    """
    try:
        forwarding_settings = ForwardingSettings.query.filter_by(id=forwarding_settings_id).delete()
        db.session.commit()
        if forwarding_settings:
            return APIResponseBuilder.success({
                "deleted": True
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"Unable to delete forwarding_settings with ID {forwarding_settings_id}"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")
