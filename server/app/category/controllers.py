from flask import Flask, Blueprint


category_controller = Blueprint("category_controller", __name__)


@category_controller.route('/', methods=['GET'])
def get_all_categories():
    return None


@category_controller.route('/<category_id>', methods=['GET'])
def get_category_by_id(category_id):
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
