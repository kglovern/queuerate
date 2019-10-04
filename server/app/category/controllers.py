from flask import Blueprint, request
from app.models import Category
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy import exc
from app import db


category_controller = Blueprint("category_controller", __name__)


@category_controller.route('/', methods=['GET'])
def get_all_categories():
    """
    Returns a JSON response of all categories in the system
    Does not include associated keywords
    """
    try:
        categories = Category.query.all()
        return APIResponseBuilder.success({
         "categories": categories
        })
    except exc.SQLAlchemyError as e:
        return APIResponseBuilder.error({
            "message": f"Issue running query: {e}"
        })
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@category_controller.route('/<category_id>', methods=['GET'])
def get_category_by_id(category_id):
    """
    Returns a JSON response of a single category with id of category_id
    Includes all single keywords associated with that category

    :param  category_id: ID of the specific category to be found
    :return: JSON response
    """
    try:
        category = Category.query.get(category_id)
        # Return category if successful, return fail if category not found matching that id
        if category:
            return APIResponseBuilder.success({"category": category})
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find category with id {category_id}"
            })
    except exc.SQLAlchemyError as e:
        return APIResponseBuilder.error({
            "message": f"Issue running query: {e}"
        })
    except Exception as e:
        return APIResponseBuilder.error({
            "message": f"Error encountered: {e}"
        })


@category_controller.route('/', methods=['POST'])
def create_new_category():
    """
    Create a new category with the passed information

    :return: JSON of new category if successful, error response if not
    """
    try:
        data = request.form.to_dict()
        # We'll never want a category to be archived by default so we can ignore the is_archived param
        # and just go with the default
        category = Category(
            user_id=data["user_id"],
            category_name=data["category_name"],
        )
        db.session.add(category)
        db.session.commit()
        return APIResponseBuilder.success({
            "category": category
        })
    except exc.SQLAlchemyError as e:
        return APIResponseBuilder.error({
            "message": f"Issue running query: {e}"
        })
    except Exception as e:
        return APIResponseBuilder.error({
            "message": f"Error encountered: {e}"
        })


@category_controller.route('/<category_id>', methods=['PATCH'])
def update_category_by_id(category_id):
    pass


@category_controller.route('/archive/<category_id>/archive', methods=['POST'])
def archive_category_by_id(category_id):
    return category_id


@category_controller.route('/archive/<category_id>/unarchive', methods=['POST'])
def unarchive_category_by_id(category_id):
    return category_id