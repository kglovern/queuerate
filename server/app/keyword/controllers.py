from flask import Blueprint
from app.models import Keyword
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from app import db


keyword_controller = Blueprint("keyword_controller", __name__)


@keyword_controller.route('/', methods=["GET"])
def get_all_keywords():
    try:
        keywords = Keyword.query.all()
        return APIResponseBuilder.success({
            "keywords": keywords
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@keyword_controller.route('/<keyword_id>', methods=["GET"])
def get_keyword_by_id(keyword_id):
    try:
        keyword = Keyword.query.get(keyword_id)
        if keyword:
            return APIResponseBuilder.success({
                "keyword": keyword
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"No keyword with id {keyword_id} found"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")



@keyword_controller.route('/', methods=["POST"])
def create_keyword():
    pass


@keyword_controller.route('/<keyword_id>', methods=["PATCH"])
def update_keyword_by_id(keyword_id):
    pass


@keyword_controller.route("/<keyword_id>", methods=["DELETE"])
def delete_keyword_by_id(keyword_id):
    try:
        keyword = Keyword.query.filter_by(id=keyword_id).delete()
        print(keyword)
        db.session.commit()
        print(keyword)
        if keyword:
            return APIResponseBuilder.success({
                "deleted": True
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"Unable to delete keyword with ID {keyword_id}"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")

