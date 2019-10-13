from flask import Blueprint, request
from app.models import User
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from app import db

user_controller = Blueprint("user_controller", __name__)


@user_controller.route('/', methods=['GET'])
def get_all_users():
    """
    Gets list of all users - probably not useful
    """
    try:
        users = User.query.all()
        return APIResponseBuilder.success({
            'users': users
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


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
        data = request.form.to_dict()
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
