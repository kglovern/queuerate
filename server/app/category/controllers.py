from flask import Blueprint
from app.models import Category
from app.services.APIResponseBuilder import APIResponseBuilder
from app import db


category_controller = Blueprint("category_controller", __name__)


@category_controller.route('/', methods=['GET'])
def get_all_categories():
    """
    Returns a JSON response of all categories in the system
    Does not include associated keywords
    """
    categories = Category.query.all()
    response = APIResponseBuilder.success({
        "categories": categories
    })
    return response


@category_controller.route('/<category_id>', methods=['GET'])
def get_category_by_id(category_id):
    """
    Returns a JSON response of a single category with id of category_id
    Includes all single keywords associated with that category

    :param category_id:
    :return:
    """
    return category_id


@category_controller.route('/', methods=['POST'])
def create_new_category():
    return None


@category_controller.route('/<category_id>', methods=['PATCH'])
def update_category_by_id(category_id):
    return category_id


@category_controller.route('/archive/<category_id>', methods=['POST'])
def archive_category_by_id(category_id):
    return category_id
