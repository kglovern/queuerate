from flask import Blueprint
from app.models import Keyword

keyword_controller = Blueprint("keyword_controller", __name__)


@keyword_controller.route('/', methods=["GET"])
def get_all_keywords():
    pass


@keyword_controller.route('/<keyword_id>', methods=["GET"])
def get_keyword_by_id(keyword_id):
    pass


@keyword_controller.route('/', methods=["POST"])
def create_keyword():
    pass


@keyword_controller.route('/<keyword_id>', methods=["PATCH"])
def update_keyword_by_id(keyword_id):
    pass


@keyword_controller.route("/<keyword_id>", methods=["DELETE"])
def delete_keyword_by_id(keyword_id):
    pass

