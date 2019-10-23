from flask import Blueprint, request
from app.models import Keyword
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from app import db


keyword_controller = Blueprint("keyword_controller", __name__)


@keyword_controller.route('/', methods=["POST"])
def create_keyword():
    try:
        # TODO: verify category belongs to passed user ID
        data = request.json
        keyword = Keyword(
            keyword=data['keyword'],
            is_excluded=data["is_excluded"],
            category_id=data['category_id']
        )
        db.session.add(keyword)
        db.session.commit()
        return APIResponseBuilder.success({
            "keyword": keyword
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@keyword_controller.route('/<keyword_id>', methods=["PATCH"])
def update_keyword_by_id(keyword_id):
    try:
        data_dict = request.json
        keyword = Keyword.query.get(keyword_id)
        if keyword:
            keyword.keyword = data_dict['keyword']
            keyword.is_excluded = data_dict['is_excluded']
            db.session.commit()
            return APIResponseBuilder.success({
                "keyword": keyword
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"Unable to find keyword with id {keyword_id}"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@keyword_controller.route("/<keyword_id>", methods=["DELETE"])
def delete_keyword_by_id(keyword_id):
    try:
        keyword = Keyword.query.filter_by(id=keyword_id).delete()
        db.session.commit()
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

