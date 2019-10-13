from flask import Blueprint
from app.models import Link
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from app import db


link_controller = Blueprint("link_controller", __name__)


@link_controller.route('/', methods=["GET"])
def get_all_links():
    try:
        links = link.query.all()
        return APIResponseBuilder.success({
            "links": links
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route('/<link_id>', methods=["GET"])
def get_link_by_id(link_id):
    try:
        link = link.query.get(link_id)
        if link:
            return APIResponseBuilder.success({
                "link": link
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"No link with id {link_id} found"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")



@link_controller.route('/', methods=["POST"])
def create_link():
    pass


@link_controller.route('/<link_id>', methods=["PATCH"])
def update_link_by_id(link_id):
    pass


@link_controller.route("/<link_id>", methods=["DELETE"])
def delete_link_by_id(link_id):
    try:
        link = link.query.filter_by(id=link_id).delete()
        print(link)
        db.session.commit()
        print(link)
        if link:
            return APIResponseBuilder.success({
                "deleted": True
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"Unable to delete link with ID {link_id}"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")

