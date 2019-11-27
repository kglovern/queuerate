from flask import Blueprint, request, jsonify
from app.models import User, Link, Category, Keyword
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from app import db
from app.DataPortability import DataPortabilityService

user_controller = Blueprint("user_controller", __name__)


@user_controller.route('/<user_id>', methods=['GET'])
def get_user_by_id(user_id):
    """
    Returns information for a single user by ID

    :param user_id: UUID from firebase
    :return: JSON response representing the user
    """
    try:
        user = User.query.filter_by(uuid=user_id).first()
        if user:
            return APIResponseBuilder.success({
                "user": user
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"Unable to find user with uuid {user_id}"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@user_controller.route('/', methods=['POST'])
def create_new_user():
    """
    Creates a new user

    :return: JSON representing the new User entity
    """
    try:
        data = request.json
        user = User(
            email=data['email'],
            uuid=data['uuid']
        )
        db.session.add(user)
        db.session.commit()
        return APIResponseBuilder.success({
            "user": user
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@user_controller.route('/<user_id>', methods=['DELETE'])
def delete_user_by_id(user_id):
    """
    Delete a user with firebase id user_id
    :param user_id:
    :return: JSON boolean representing whether the user was successfully create
    """
    try:
        user = User.query.filter_by(uuid=user_id).delete()
        if user:
            return APIResponseBuilder.success({
                "deleted": True
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"Cannot find user with id {user_id}"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@user_controller.route('/<user_id>/links', methods=["GET"])
def get_all_links_by_user(user_id):
    """
    Returns a JSON response of all links by user

    :param :user_id
    """
    # TODO: validate user ID
    try:
        links = Link.query.filter_by(user_id=user_id).all()
        return APIResponseBuilder.success({
            "links": links,
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@user_controller.route('/<user_id>/export', methods=["GET"])
def export_data_by_user_id(user_id):
    try:
        export_data = jsonify(DataPortabilityService.export_user_data(user_id))
        export_data.headers['Content-Disposition'] = f"attachment;filename={user_id}_export.json"
        return export_data
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@user_controller.route('/import', methods=['POST'])
def import_data_for_user():
    data = request.json
    try:
        for category in data["categories"]:
            # Create new category
            cat = Category(
                user_id=data["uuid"],
                category_name=category["name"]
            )
            db.session.add(cat)
            db.session.commit()
            # add keywords
            for keyword in category["keywords"]:
                k = Keyword(
                    keyword=keyword["keyword"],
                    is_excluded=keyword["is_excluded"],
                    category_id=cat.id
                )
                db.session.add(k)
            db.session.commit()
        return APIResponseBuilder.success({
            "success": True
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")
