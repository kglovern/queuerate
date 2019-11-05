from flask import Blueprint
from app.models import RelevantKeyword
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import desc

rk_controller = Blueprint("relevant_keyword_controller", __name__)


@rk_controller.route('/<link_id>', methods=['GET'])
def get_relevant_keywords_for_link(link_id):
    try:
        keywords = RelevantKeyword.query.filter_by(link_id=link_id).order_by(desc(RelevantKeyword.relevance)).all()
        if keywords:
            return APIResponseBuilder.success({
                "keywords": keywords
            })
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find link with ID of {link_id}"
            })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")
